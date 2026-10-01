/**
 * Application configuration and platform integration.
 *
 * @module
 */
/** Application configuration and platform integration. */
export { ConfigFlags, OpenURL, SetConfigFlags } from "./raylib.ts";

export {
  Close,
  Init,
  IsInitialized,
  Run,
  Stop,
} from "./Runtime/Application.ts";
export type {
  InitOptions,
  RaylibWebBackend,
  RunOptions,
  WebBackendFactory,
  WebBackendFactoryOptions,
} from "./Runtime/Application.ts";
export {
  UnsupportedPlatformError,
  WebNotInitializedError,
} from "./Runtime/Application.ts";
