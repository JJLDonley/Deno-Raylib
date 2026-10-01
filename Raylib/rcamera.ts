/**
 * Direct rcamera movement, rotation, and projection APIs.
 *
 * @module
 */
export {
  CameraMoveForward,
  CameraMoveRight,
  CameraMoveToTarget,
  CameraMoveUp,
  CameraPitch,
  CameraRoll,
  CameraYaw,
  GetCameraForward,
  GetCameraProjectionMatrix,
  GetCameraRight,
  GetCameraUp,
  GetCameraViewMatrix,
} from "../Bindings/rlgl.ts";

export { Camera3D, Matrix, Vector3 } from "../Bindings/Structs/structs.ts";
export type { Camera } from "./raylib.ts";
