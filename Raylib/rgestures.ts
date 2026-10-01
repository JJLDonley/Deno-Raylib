/** Direct rgestures.h public gesture implementation.
 * @module
 */
import { lib as DLL } from "../Bindings/bindings.ts";
import { Vector2 } from "../Bindings/Structs/structs.ts";
export { Vector2 } from "../Bindings/Structs/structs.ts";
import type { float } from "./raylib.ts";
const lib = DLL.symbols;

/** Gesture */
export enum Gesture {
  /** NONE member. */
  NONE = 0, // No gesture
  /** TAP member. */
  TAP = 1, // Tap gesture
  /** DOUBLETAP member. */
  DOUBLETAP = 2, // Double tap gesture
  /** HOLD member. */
  HOLD = 4, // Hold gesture
  /** DRAG member. */
  DRAG = 8, // Drag gesture
  /** SWIPE_RIGHT member. */
  SWIPE_RIGHT = 16, // Swipe right gesture
  /** SWIPE_LEFT member. */
  SWIPE_LEFT = 32, // Swipe left gesture
  /** SWIPE_UP member. */
  SWIPE_UP = 64, // Swipe up gesture
  /** SWIPE_DOWN member. */
  SWIPE_DOWN = 128, // Swipe down gesture
  /** PINCH_IN member. */
  PINCH_IN = 256, // Pinch in gesture
  /** PINCH_OUT member. */
  PINCH_OUT = 512, // Pinch out gesture
}

/** Enable a set of gestures using flags */
export function SetGesturesEnabled(flags: Gesture): void {
  lib.SetGesturesEnabled(flags);
}

/** Check if a gesture have been detected */
export function IsGestureDetected(gesture: Gesture): boolean {
  return !!lib.IsGestureDetected(gesture);
}

/** Get latest detected gesture */
export function GetGestureDetected(): Gesture {
  return lib.GetGestureDetected() as Gesture;
}

/** Get gesture hold time in seconds */
export function GetGestureHoldDuration(): float {
  return lib.GetGestureHoldDuration();
}

/** Get gesture drag vector */
export function GetGestureDragVector(): Vector2 {
  const buffer = lib.GetGestureDragVector();
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

/** Get gesture drag angle */
export function GetGestureDragAngle(): float {
  return lib.GetGestureDragAngle();
}

/** Get gesture pinch delta */
export function GetGesturePinchVector(): Vector2 {
  const buffer = lib.GetGesturePinchVector();
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

/** Get gesture pinch angle */
export function GetGesturePinchAngle(): float {
  return lib.GetGesturePinchAngle();
}
