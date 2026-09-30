// Browser runtime dispatch shared by every generated Web module.
// deno-lint-ignore-file no-explicit-any

import type { FunctionName } from "../function_names.ts";
import type { WebFunction } from "../api_types.ts";

type AnyFunction = (...args: any[]) => any;

export type RaylibWebBackend = Partial<
  {
    [Name in FunctionName]: WebFunction<Name>;
  }
>;

export class WebNotInitializedError extends Error {
  constructor() {
    super(
      "Deno-Raylib Web is not initialized. Call `await Application.Init()` before using a Web module.",
    );
    this.name = "WebNotInitializedError";
  }
}

export class UnsupportedPlatformError extends Error {
  readonly functionName: FunctionName;

  constructor(functionName: FunctionName) {
    super(
      `${functionName} is not supported by the active Deno-Raylib web backend.`,
    );
    this.name = "UnsupportedPlatformError";
    this.functionName = functionName;
  }
}

let activeBackend: RaylibWebBackend | undefined;

export function installBackend(backend: RaylibWebBackend): void {
  activeBackend = backend;
}

export function removeBackend(): void {
  activeBackend = undefined;
}

export function isInitialized(): boolean {
  return activeBackend !== undefined;
}

export function invoke<Name extends FunctionName>(
  name: Name,
  args: Parameters<WebFunction<Name>>,
): ReturnType<WebFunction<Name>> {
  if (!activeBackend) throw new WebNotInitializedError();
  const implementation = activeBackend[name] as AnyFunction | undefined;
  if (!implementation) throw new UnsupportedPlatformError(name);
  return implementation(...args) as ReturnType<WebFunction<Name>>;
}
