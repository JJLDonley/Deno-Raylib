import { installBackend, isInitialized, removeBackend } from "./context.ts";
import type { RaylibWebBackend } from "./context.ts";

export type { RaylibWebBackend } from "./context.ts";
export { UnsupportedPlatformError, WebNotInitializedError } from "./context.ts";

export interface WebBackendFactoryOptions {
  /** A CSS selector, HTMLCanvasElement, or OffscreenCanvas. */
  canvas?: object | string;
  /** Wasm binary URL; relative URLs resolve beside the generated backend. */
  wasmUrl?: URL | string;
  /** Base directory for Emscripten runtime files (not a virtual filesystem mount). */
  assetBaseUrl?: URL | string;
}

export type WebBackendFactory = (
  options: WebBackendFactoryOptions,
) => RaylibWebBackend | Promise<RaylibWebBackend>;

export interface InitOptions extends WebBackendFactoryOptions {
  /** A ready backend, primarily useful for embedding and testing. */
  backend?: RaylibWebBackend;
  /** A custom generated Wasm backend factory. */
  backendFactory?: WebBackendFactory;
  /** ES module containing a default WebBackendFactory export. */
  moduleUrl?: URL | string;
}

export interface RunOptions {
  init?: () => void | Promise<void>;
  update?: (deltaTime: number) => void;
  draw: () => void;
  shutdown?: () => void | Promise<void>;
  shouldClose?: () => boolean;
}

let activeRun:
  | { stop: (close: boolean) => void; isClosing: () => boolean }
  | undefined;
let initialization: Promise<void> | undefined;
let generation = 0;

type BrowserHost = {
  location?: { href: string };
  requestAnimationFrame?: (callback: (now: number) => void) => number;
  cancelAnimationFrame?: (handle: number) => void;
};

const browser = globalThis as unknown as BrowserHost;

function asUrl(value: URL | string): URL {
  return value instanceof URL ? value : new URL(value, browser.location?.href);
}

export async function Init(options: InitOptions = {}): Promise<void> {
  if (activeRun?.isClosing()) {
    throw new Error(
      "Await Application.Run() shutdown before initializing again.",
    );
  }
  if (initialization) return await initialization;
  if (isInitialized()) return;
  const currentGeneration = generation;
  const operation = initialize(options, currentGeneration);
  initialization = operation;
  try {
    await operation;
  } finally {
    if (initialization === operation) initialization = undefined;
  }
}

async function initialize(
  options: InitOptions,
  currentGeneration: number,
): Promise<void> {
  if (options.backend) {
    installBackend(options.backend);
    return;
  }

  let factory = options.backendFactory;
  if (!factory) {
    const moduleUrl = options.moduleUrl
      ? asUrl(options.moduleUrl)
      : new URL("./backend.mjs", browser.location?.href ?? import.meta.url);
    let module: { default?: WebBackendFactory };
    try {
      module = await import(moduleUrl.href);
    } catch (cause) {
      throw new Error(
        "The raylib web backend has not been built. Install a generated Web runtime or provide Application.Init({ backendFactory }).",
        { cause },
      );
    }
    if (typeof module.default !== "function") {
      throw new TypeError(
        `The web backend module ${moduleUrl.href} does not export a default factory.`,
      );
    }
    factory = module.default;
  }

  const backend = await factory(options);
  if (currentGeneration !== generation) {
    throw new Error("Web initialization was cancelled by Application.Close().");
  }
  installBackend(backend);
}

export async function Run(options: RunOptions): Promise<void> {
  if (activeRun) throw new Error("Application.Run() is already active.");
  if (!isInitialized()) {
    throw new Error(
      "Call `await Application.Init()` before Application.Run().",
    );
  }
  if (typeof browser.requestAnimationFrame !== "function") {
    throw new Error(
      "Application.Run() requires a browser animation frame API.",
    );
  }

  return await new Promise<void>((resolve, reject) => {
    let stopRequested = false;
    let closeRequested = false;
    let busy = true;
    let finished = false;
    let animationFrame: number | undefined;
    let previous = performance.now();

    const finish = async (failure?: { error: unknown }) => {
      if (finished) return;
      finished = true;
      if (animationFrame !== undefined) {
        browser.cancelAnimationFrame?.(animationFrame);
      }
      animationFrame = undefined;
      try {
        await options.shutdown?.();
      } catch (error) {
        failure = {
          error: failure
            ? new AggregateError(
              [failure.error, error],
              "Application and shutdown both failed",
            )
            : error,
        };
      } finally {
        if (closeRequested) removeBackend();
        activeRun = undefined;
      }
      if (failure) reject(failure.error);
      else resolve();
    };

    const frame = (now: number) => {
      animationFrame = undefined;
      if (finished) return;
      busy = true;
      try {
        if (stopRequested || options.shouldClose?.() || stopRequested) {
          void finish();
          return;
        }
        const deltaTime = Math.max(0, (now - previous) / 1000);
        previous = now;
        options.update?.(deltaTime);
        if (!stopRequested) options.draw();
        if (stopRequested) void finish();
        else animationFrame = browser.requestAnimationFrame!(frame);
      } catch (error) {
        void finish({ error });
      } finally {
        busy = false;
      }
    };

    activeRun = {
      isClosing: () => closeRequested,
      stop(close) {
        stopRequested = true;
        closeRequested ||= close;
        if (!busy) void finish();
      },
    };
    void (async () => {
      try {
        await options.init?.();
        previous = performance.now();
        busy = false;
        if (stopRequested) await finish();
        else animationFrame = browser.requestAnimationFrame!(frame);
      } catch (error) {
        busy = false;
        await finish({ error });
      }
    })();
  });
}

export function Stop(): void {
  activeRun?.stop(false);
}

/** Stop the loop; Run() settles after shutdown, then the backend is detached. */
export function Close(): void {
  generation++;
  initialization = undefined;
  if (activeRun) activeRun.stop(true);
  else removeBackend();
}

export { isInitialized as IsInitialized } from "./context.ts";
