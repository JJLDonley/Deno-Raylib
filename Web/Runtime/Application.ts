import { installBackend, isInitialized, removeBackend } from "./context.ts";
import type { RaylibWebBackend } from "./context.ts";

export type { RaylibWebBackend } from "./context.ts";
export { UnsupportedPlatformError, WebNotInitializedError } from "./context.ts";

export interface WebBackendFactoryOptions {
  /** A CSS selector, HTMLCanvasElement, or OffscreenCanvas. */
  canvas?: object | string;
  wasmUrl?: URL | string;
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

let stopRequested = false;
let animationFrame: number | undefined;

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
  if (isInitialized()) return;

  if (options.backend) {
    installBackend(options.backend);
    return;
  }

  let factory = options.backendFactory;
  if (!factory) {
    const moduleUrl = options.moduleUrl
      ? asUrl(options.moduleUrl)
      : new URL("../generated/raylib_web.mjs", import.meta.url);
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

  installBackend(await factory(options));
}

export async function Run(options: RunOptions): Promise<void> {
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

  stopRequested = false;
  await options.init?.();

  return await new Promise<void>((resolve, reject) => {
    let previous = performance.now();

    const finish = async () => {
      animationFrame = undefined;
      try {
        await options.shutdown?.();
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    const frame = (now: number) => {
      if (stopRequested || options.shouldClose?.()) {
        void finish();
        return;
      }
      try {
        const deltaTime = Math.max(0, (now - previous) / 1000);
        previous = now;
        options.update?.(deltaTime);
        options.draw();
        animationFrame = browser.requestAnimationFrame!(frame);
      } catch (error) {
        animationFrame = undefined;
        reject(error);
      }
    };

    animationFrame = browser.requestAnimationFrame!(frame);
  });
}

export function Stop(): void {
  stopRequested = true;
}

export function Close(): void {
  stopRequested = true;
  if (animationFrame !== undefined) {
    browser.cancelAnimationFrame?.(animationFrame);
    animationFrame = undefined;
  }
  removeBackend();
}

export { isInitialized as IsInitialized } from "./context.ts";
