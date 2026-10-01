/**
 * Low-level framebuffer allocation, binding, attachment, copy, and resize.
 *
 * @module
 */
/** Low-level framebuffer allocation, binding, attachment, copy, and resize. */
export {
  rlActiveDrawBuffers,
  rlBindFramebuffer,
  rlBlitFramebuffer,
  rlCopyFramebuffer,
  rlDisableFramebuffer,
  rlEnableFramebuffer,
  rlFramebufferAttach,
  rlFramebufferComplete,
  rlGetActiveFramebuffer,
  rlGetFramebufferHeight,
  rlGetFramebufferWidth,
  rlLoadFramebuffer,
  rlResizeFramebuffer,
  rlSetFramebufferHeight,
  rlSetFramebufferWidth,
  rlUnloadFramebuffer,
} from "../Raylib/raylib.ts";
