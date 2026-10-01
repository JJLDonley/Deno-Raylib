/** Direct raymath.h implementation.
 * @module
 */
import { lib as DLL } from "../Bindings/bindings.ts";
import {
  Matrix,
  Vector2,
  Vector3,
  Vector4,
  Vector4 as Quaternion,
} from "../Bindings/Structs/structs.ts";
export {
  float16,
  float3,
  Matrix,
  Vector2,
  Vector3,
  Vector4,
  Vector4 as Quaternion,
} from "../Bindings/Structs/structs.ts";
import type { float } from "./raylib.ts";
const lib = DLL.symbols;

/** Clamp from the raylib 6.0 API. */
export function Clamp(value: float, min: float, max: float): float {
  return lib.Clamp(value, min, max);
}

/** Lerp from the raylib 6.0 API. */
export function Lerp(start: float, end: float, amount: float): float {
  return lib.Lerp(start, end, amount);
}

/** Normalize from the raylib 6.0 API. */
export function Normalize(value: float, start: float, end: float): float {
  return lib.Normalize(value, start, end);
}

/** Remap from the raylib 6.0 API. */
export function Remap(
  value: float,
  inputStart: float,
  inputEnd: float,
  outputStart: float,
  outputEnd: float,
): float {
  return lib.Remap(value, inputStart, inputEnd, outputStart, outputEnd);
}

/** Wrap from the raylib 6.0 API. */
export function Wrap(value: float, min: float, max: float): float {
  return lib.Wrap(value, min, max);
}

/** FloatEquals from the raylib 6.0 API. */
export function FloatEquals(x: float, y: float): boolean {
  return !!lib.FloatEquals(x, y);
}

/** Vector2Zero from the raylib 6.0 API. */
export function Vector2Zero(): Vector2 {
  const buf = lib.Vector2Zero();
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2One from the raylib 6.0 API. */
export function Vector2One(): Vector2 {
  const buf = lib.Vector2One();
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Add from the raylib 6.0 API. */
export function Vector2Add(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Add(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2AddValue from the raylib 6.0 API. */
export function Vector2AddValue(v: Vector2, add: float): Vector2 {
  const buf = lib.Vector2AddValue(v.buffer, add);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Subtract from the raylib 6.0 API. */
export function Vector2Subtract(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Subtract(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2SubtractValue from the raylib 6.0 API. */
export function Vector2SubtractValue(v: Vector2, sub: float): Vector2 {
  const buf = lib.Vector2SubtractValue(v.buffer, sub);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Length from the raylib 6.0 API. */
export function Vector2Length(v: Vector2): float {
  return lib.Vector2Length(v.buffer);
}

/** Vector2LengthSqr from the raylib 6.0 API. */
export function Vector2LengthSqr(v: Vector2): float {
  return lib.Vector2LengthSqr(v.buffer);
}

/** Vector2DotProduct from the raylib 6.0 API. */
export function Vector2DotProduct(v1: Vector2, v2: Vector2): float {
  return lib.Vector2DotProduct(v1.buffer, v2.buffer);
}

/** Vector2CrossProduct from the raylib 6.0 API. */
export function Vector2CrossProduct(v1: Vector2, v2: Vector2): float {
  return lib.Vector2CrossProduct(v1.buffer, v2.buffer);
}

/** Vector2Distance from the raylib 6.0 API. */
export function Vector2Distance(v1: Vector2, v2: Vector2): float {
  return lib.Vector2Distance(v1.buffer, v2.buffer);
}

/** Vector2DistanceSqr from the raylib 6.0 API. */
export function Vector2DistanceSqr(v1: Vector2, v2: Vector2): float {
  return lib.Vector2DistanceSqr(v1.buffer, v2.buffer);
}

/** Vector2Angle from the raylib 6.0 API. */
export function Vector2Angle(v1: Vector2, v2: Vector2): float {
  return lib.Vector2Angle(v1.buffer, v2.buffer);
}

/** Vector2LineAngle from the raylib 6.0 API. */
export function Vector2LineAngle(start: Vector2, end: Vector2): float {
  return lib.Vector2LineAngle(start.buffer, end.buffer);
}

/** Vector2Scale from the raylib 6.0 API. */
export function Vector2Scale(v: Vector2, scale: float): Vector2 {
  const buf = lib.Vector2Scale(v.buffer, scale);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Multiply from the raylib 6.0 API. */
export function Vector2Multiply(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Multiply(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Negate from the raylib 6.0 API. */
export function Vector2Negate(v: Vector2): Vector2 {
  const buf = lib.Vector2Negate(v.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Divide from the raylib 6.0 API. */
export function Vector2Divide(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Divide(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Normalize from the raylib 6.0 API. */
export function Vector2Normalize(v: Vector2): Vector2 {
  const buf = lib.Vector2Normalize(v.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Transform from the raylib 6.0 API. */
export function Vector2Transform(v: Vector2, mat: Matrix): Vector2 {
  const buf = lib.Vector2Transform(v.buffer, mat.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Lerp from the raylib 6.0 API. */
export function Vector2Lerp(v1: Vector2, v2: Vector2, amount: float): Vector2 {
  const buf = lib.Vector2Lerp(v1.buffer, v2.buffer, amount);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Reflect from the raylib 6.0 API. */
export function Vector2Reflect(v: Vector2, normal: Vector2): Vector2 {
  const buf = lib.Vector2Reflect(v.buffer, normal.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Min from the raylib 6.0 API. */
export function Vector2Min(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Min(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Max from the raylib 6.0 API. */
export function Vector2Max(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Max(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Rotate from the raylib 6.0 API. */
export function Vector2Rotate(v: Vector2, angle: float): Vector2 {
  const buf = lib.Vector2Rotate(v.buffer, angle);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2MoveTowards from the raylib 6.0 API. */
export function Vector2MoveTowards(
  v: Vector2,
  target: Vector2,
  maxDistance: float,
): Vector2 {
  const buf = lib.Vector2MoveTowards(v.buffer, target.buffer, maxDistance);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Invert from the raylib 6.0 API. */
export function Vector2Invert(v: Vector2): Vector2 {
  const buf = lib.Vector2Invert(v.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Clamp from the raylib 6.0 API. */
export function Vector2Clamp(v: Vector2, min: Vector2, max: Vector2): Vector2 {
  const buf = lib.Vector2Clamp(v.buffer, min.buffer, max.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2ClampValue from the raylib 6.0 API. */
export function Vector2ClampValue(v: Vector2, min: float, max: float): Vector2 {
  const buf = lib.Vector2ClampValue(v.buffer, min, max);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector2Equals from the raylib 6.0 API. */
export function Vector2Equals(p: Vector2, q: Vector2): boolean {
  return !!lib.Vector2Equals(p.buffer, q.buffer);
}

/** Vector2Refract from the raylib 6.0 API. */
export function Vector2Refract(v: Vector2, n: Vector2, r: float): Vector2 {
  const buf = lib.Vector2Refract(v.buffer, n.buffer, r);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Zero from the raylib 6.0 API. */
export function Vector3Zero(): Vector3 {
  const buf = lib.Vector3Zero();
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3One from the raylib 6.0 API. */
export function Vector3One(): Vector3 {
  const buf = lib.Vector3One();
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Add from the raylib 6.0 API. */
export function Vector3Add(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Add(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3AddValue from the raylib 6.0 API. */
export function Vector3AddValue(v: Vector3, add: float): Vector3 {
  const buf = lib.Vector3AddValue(v.buffer, add);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Subtract from the raylib 6.0 API. */
export function Vector3Subtract(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Subtract(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3SubtractValue from the raylib 6.0 API. */
export function Vector3SubtractValue(v: Vector3, sub: float): Vector3 {
  const buf = lib.Vector3SubtractValue(v.buffer, sub);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Scale from the raylib 6.0 API. */
export function Vector3Scale(v: Vector3, scalar: float): Vector3 {
  const buf = lib.Vector3Scale(v.buffer, scalar);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Multiply from the raylib 6.0 API. */
export function Vector3Multiply(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Multiply(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3CrossProduct from the raylib 6.0 API. */
export function Vector3CrossProduct(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3CrossProduct(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Perpendicular from the raylib 6.0 API. */
export function Vector3Perpendicular(v: Vector3): Vector3 {
  const buf = lib.Vector3Perpendicular(v.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Length from the raylib 6.0 API. */
export function Vector3Length(v: Vector3): float {
  return lib.Vector3Length(v.buffer);
}

/** Vector3LengthSqr from the raylib 6.0 API. */
export function Vector3LengthSqr(v: Vector3): float {
  return lib.Vector3LengthSqr(v.buffer);
}

/** Vector3DotProduct from the raylib 6.0 API. */
export function Vector3DotProduct(v1: Vector3, v2: Vector3): float {
  return lib.Vector3DotProduct(v1.buffer, v2.buffer);
}

/** Vector3Distance from the raylib 6.0 API. */
export function Vector3Distance(v1: Vector3, v2: Vector3): float {
  return lib.Vector3Distance(v1.buffer, v2.buffer);
}

/** Vector3DistanceSqr from the raylib 6.0 API. */
export function Vector3DistanceSqr(v1: Vector3, v2: Vector3): float {
  return lib.Vector3DistanceSqr(v1.buffer, v2.buffer);
}

/** Vector3Angle from the raylib 6.0 API. */
export function Vector3Angle(v1: Vector3, v2: Vector3): float {
  return lib.Vector3Angle(v1.buffer, v2.buffer);
}

/** Vector3Negate from the raylib 6.0 API. */
export function Vector3Negate(v: Vector3): Vector3 {
  const buf = lib.Vector3Negate(v.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Divide from the raylib 6.0 API. */
export function Vector3Divide(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Divide(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Normalize from the raylib 6.0 API. */
export function Vector3Normalize(v: Vector3): Vector3 {
  const buf = lib.Vector3Normalize(v.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Project from the raylib 6.0 API. */
export function Vector3Project(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Project(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Reject from the raylib 6.0 API. */
export function Vector3Reject(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Reject(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3OrthoNormalize from the raylib 6.0 API. */
export function Vector3OrthoNormalize(v1: Vector3, v2: Vector3): void {
  lib.Vector3OrthoNormalize(
    v1.buffer,
    v2.buffer,
  );
}

/** Vector3Transform from the raylib 6.0 API. */
export function Vector3Transform(v: Vector3, mat: Matrix): Vector3 {
  const buf = lib.Vector3Transform(v.buffer, mat.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3RotateByQuaternion from the raylib 6.0 API. */
export function Vector3RotateByQuaternion(v: Vector3, q: Quaternion): Vector3 {
  const buf = lib.Vector3RotateByQuaternion(v.buffer, q.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3RotateByAxisAngle from the raylib 6.0 API. */
export function Vector3RotateByAxisAngle(
  v: Vector3,
  axis: Vector3,
  angle: float,
): Vector3 {
  const buf = lib.Vector3RotateByAxisAngle(v.buffer, axis.buffer, angle);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3MoveTowards from the raylib 6.0 API. */
export function Vector3MoveTowards(
  v: Vector3,
  target: Vector3,
  maxDistance: float,
): Vector3 {
  const buf = lib.Vector3MoveTowards(v.buffer, target.buffer, maxDistance);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Lerp from the raylib 6.0 API. */
export function Vector3Lerp(v1: Vector3, v2: Vector3, amount: float): Vector3 {
  const buf = lib.Vector3Lerp(v1.buffer, v2.buffer, amount);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3CubicHermite from the raylib 6.0 API. */
export function Vector3CubicHermite(
  v1: Vector3,
  tangent1: Vector3,
  v2: Vector3,
  tangent2: Vector3,
  amount: float,
): Vector3 {
  const buf = lib.Vector3CubicHermite(
    v1.buffer,
    tangent1.buffer,
    v2.buffer,
    tangent2.buffer,
    amount,
  );
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Reflect from the raylib 6.0 API. */
export function Vector3Reflect(v: Vector3, normal: Vector3): Vector3 {
  const buf = lib.Vector3Reflect(v.buffer, normal.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Min from the raylib 6.0 API. */
export function Vector3Min(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Min(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Max from the raylib 6.0 API. */
export function Vector3Max(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Max(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Barycenter from the raylib 6.0 API. */
export function Vector3Barycenter(
  p: Vector3,
  a: Vector3,
  b: Vector3,
  c: Vector3,
): Vector3 {
  const buf = lib.Vector3Barycenter(p.buffer, a.buffer, b.buffer, c.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Unproject from the raylib 6.0 API. */
export function Vector3Unproject(
  source: Vector3,
  projection: Matrix,
  view: Matrix,
): Vector3 {
  const buf = lib.Vector3Unproject(
    source.buffer,
    projection.buffer,
    view.buffer,
  );
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3ToFloatV from the raylib 6.0 API. */
export function Vector3ToFloatV(v: Vector3): Float32Array {
  const buf = lib.Vector3ToFloatV(v.buffer);
  return new Float32Array(buf.buffer, buf.byteOffset, 3);
}

/** Vector3Invert from the raylib 6.0 API. */
export function Vector3Invert(v: Vector3): Vector3 {
  const buf = lib.Vector3Invert(v.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Clamp from the raylib 6.0 API. */
export function Vector3Clamp(v: Vector3, min: Vector3, max: Vector3): Vector3 {
  const buf = lib.Vector3Clamp(v.buffer, min.buffer, max.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3ClampValue from the raylib 6.0 API. */
export function Vector3ClampValue(v: Vector3, min: float, max: float): Vector3 {
  const buf = lib.Vector3ClampValue(v.buffer, min, max);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector3Equals from the raylib 6.0 API. */
export function Vector3Equals(p: Vector3, q: Vector3): boolean {
  return !!lib.Vector3Equals(p.buffer, q.buffer);
}

/** Vector3Refract from the raylib 6.0 API. */
export function Vector3Refract(v: Vector3, n: Vector3, r: float): Vector3 {
  const buf = lib.Vector3Refract(v.buffer, n.buffer, r);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Zero from the raylib 6.0 API. */
export function Vector4Zero(): Vector4 {
  const buf = lib.Vector4Zero();
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4One from the raylib 6.0 API. */
export function Vector4One(): Vector4 {
  const buf = lib.Vector4One();
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Add from the raylib 6.0 API. */
export function Vector4Add(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Add(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4AddValue from the raylib 6.0 API. */
export function Vector4AddValue(v: Vector4, add: float): Vector4 {
  const buf = lib.Vector4AddValue(v.buffer, add);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Subtract from the raylib 6.0 API. */
export function Vector4Subtract(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Subtract(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4SubtractValue from the raylib 6.0 API. */
export function Vector4SubtractValue(v: Vector4, add: float): Vector4 {
  const buf = lib.Vector4SubtractValue(v.buffer, add);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Length from the raylib 6.0 API. */
export function Vector4Length(v: Vector4): float {
  return lib.Vector4Length(v.buffer);
}

/** Vector4LengthSqr from the raylib 6.0 API. */
export function Vector4LengthSqr(v: Vector4): float {
  return lib.Vector4LengthSqr(v.buffer);
}

/** Vector4DotProduct from the raylib 6.0 API. */
export function Vector4DotProduct(v1: Vector4, v2: Vector4): float {
  return lib.Vector4DotProduct(v1.buffer, v2.buffer);
}

/** Vector4Distance from the raylib 6.0 API. */
export function Vector4Distance(v1: Vector4, v2: Vector4): float {
  return lib.Vector4Distance(v1.buffer, v2.buffer);
}

/** Vector4DistanceSqr from the raylib 6.0 API. */
export function Vector4DistanceSqr(v1: Vector4, v2: Vector4): float {
  return lib.Vector4DistanceSqr(v1.buffer, v2.buffer);
}

/** Vector4Scale from the raylib 6.0 API. */
export function Vector4Scale(v: Vector4, scale: float): Vector4 {
  const buf = lib.Vector4Scale(v.buffer, scale);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Multiply from the raylib 6.0 API. */
export function Vector4Multiply(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Multiply(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Negate from the raylib 6.0 API. */
export function Vector4Negate(v: Vector4): Vector4 {
  const buf = lib.Vector4Negate(v.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Divide from the raylib 6.0 API. */
export function Vector4Divide(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Divide(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Normalize from the raylib 6.0 API. */
export function Vector4Normalize(v: Vector4): Vector4 {
  const buf = lib.Vector4Normalize(v.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Min from the raylib 6.0 API. */
export function Vector4Min(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Min(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Max from the raylib 6.0 API. */
export function Vector4Max(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Max(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Lerp from the raylib 6.0 API. */
export function Vector4Lerp(v1: Vector4, v2: Vector4, amount: float): Vector4 {
  const buf = lib.Vector4Lerp(v1.buffer, v2.buffer, amount);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4MoveTowards from the raylib 6.0 API. */
export function Vector4MoveTowards(
  v: Vector4,
  target: Vector4,
  maxDistance: float,
): Vector4 {
  const buf = lib.Vector4MoveTowards(v.buffer, target.buffer, maxDistance);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Invert from the raylib 6.0 API. */
export function Vector4Invert(v: Vector4): Vector4 {
  const buf = lib.Vector4Invert(v.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Vector4Equals from the raylib 6.0 API. */
export function Vector4Equals(p: Vector4, q: Vector4): boolean {
  return !!lib.Vector4Equals(p.buffer, q.buffer);
}

/** MatrixDeterminant from the raylib 6.0 API. */
export function MatrixDeterminant(mat: Matrix): float {
  return lib.MatrixDeterminant(mat.buffer);
}

/** MatrixTrace from the raylib 6.0 API. */
export function MatrixTrace(mat: Matrix): float {
  return lib.MatrixTrace(mat.buffer);
}

/** MatrixTranspose from the raylib 6.0 API. */
export function MatrixTranspose(mat: Matrix): Matrix {
  const buf = lib.MatrixTranspose(mat.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixInvert from the raylib 6.0 API. */
export function MatrixInvert(mat: Matrix): Matrix {
  const buf = lib.MatrixInvert(mat.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixIdentity from the raylib 6.0 API. */
export function MatrixIdentity(): Matrix {
  const buf = lib.MatrixIdentity();
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixAdd from the raylib 6.0 API. */
export function MatrixAdd(left: Matrix, right: Matrix): Matrix {
  const buf = lib.MatrixAdd(left.buffer, right.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixSubtract from the raylib 6.0 API. */
export function MatrixSubtract(left: Matrix, right: Matrix): Matrix {
  const buf = lib.MatrixSubtract(left.buffer, right.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixMultiply from the raylib 6.0 API. */
export function MatrixMultiply(left: Matrix, right: Matrix): Matrix {
  const buf = lib.MatrixMultiply(left.buffer, right.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixMultiplyValue from the raylib 6.0 API. */
export function MatrixMultiplyValue(mat: Matrix, value: float): Matrix {
  const buf = lib.MatrixMultiplyValue(mat.buffer, value);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixTranslate from the raylib 6.0 API. */
export function MatrixTranslate(x: float, y: float, z: float): Matrix {
  const buf = lib.MatrixTranslate(x, y, z);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixRotate from the raylib 6.0 API. */
export function MatrixRotate(axis: Vector3, angle: float): Matrix {
  const buf = lib.MatrixRotate(axis.buffer, angle);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixRotateX from the raylib 6.0 API. */
export function MatrixRotateX(angle: float): Matrix {
  const buf = lib.MatrixRotateX(angle);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixRotateY from the raylib 6.0 API. */
export function MatrixRotateY(angle: float): Matrix {
  const buf = lib.MatrixRotateY(angle);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixRotateZ from the raylib 6.0 API. */
export function MatrixRotateZ(angle: float): Matrix {
  const buf = lib.MatrixRotateZ(angle);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixRotateXYZ from the raylib 6.0 API. */
export function MatrixRotateXYZ(angle: Vector3): Matrix {
  const buf = lib.MatrixRotateXYZ(angle.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixRotateZYX from the raylib 6.0 API. */
export function MatrixRotateZYX(angle: Vector3): Matrix {
  const buf = lib.MatrixRotateZYX(angle.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixScale from the raylib 6.0 API. */
export function MatrixScale(x: float, y: float, z: float): Matrix {
  const buf = lib.MatrixScale(x, y, z);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixFrustum from the raylib 6.0 API. */
export function MatrixFrustum(
  left: float,
  right: float,
  bottom: float,
  top: float,
  nearPlane: float,
  farPlane: float,
): Matrix {
  const buf = lib.MatrixFrustum(left, right, bottom, top, nearPlane, farPlane);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixPerspective from the raylib 6.0 API. */
export function MatrixPerspective(
  fovY: float,
  aspect: float,
  nearPlane: float,
  farPlane: float,
): Matrix {
  const buf = lib.MatrixPerspective(fovY, aspect, nearPlane, farPlane);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixOrtho from the raylib 6.0 API. */
export function MatrixOrtho(
  left: float,
  right: float,
  bottom: float,
  top: float,
  nearPlane: float,
  farPlane: float,
): Matrix {
  const buf = lib.MatrixOrtho(left, right, bottom, top, nearPlane, farPlane);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixLookAt from the raylib 6.0 API. */
export function MatrixLookAt(
  eye: Vector3,
  target: Vector3,
  up: Vector3,
): Matrix {
  const buf = lib.MatrixLookAt(eye.buffer, target.buffer, up.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixToFloatV from the raylib 6.0 API. */
export function MatrixToFloatV(mat: Matrix): Float32Array {
  const buf = lib.MatrixToFloatV(mat.buffer);
  return new Float32Array(buf.buffer, buf.byteOffset, 16);
}

/** QuaternionAdd from the raylib 6.0 API. */
export function QuaternionAdd(q1: Quaternion, q2: Quaternion): Quaternion {
  const buf = lib.QuaternionAdd(q1.buffer, q2.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionAddValue from the raylib 6.0 API. */
export function QuaternionAddValue(q: Quaternion, add: float): Quaternion {
  const buf = lib.QuaternionAddValue(q.buffer, add);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionSubtract from the raylib 6.0 API. */
export function QuaternionSubtract(q1: Quaternion, q2: Quaternion): Quaternion {
  const buf = lib.QuaternionSubtract(q1.buffer, q2.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionSubtractValue from the raylib 6.0 API. */
export function QuaternionSubtractValue(q: Quaternion, sub: float): Quaternion {
  const buf = lib.QuaternionSubtractValue(q.buffer, sub);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionIdentity from the raylib 6.0 API. */
export function QuaternionIdentity(): Quaternion {
  const buf = lib.QuaternionIdentity();
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionLength from the raylib 6.0 API. */
export function QuaternionLength(q: Quaternion): float {
  return lib.QuaternionLength(q.buffer);
}

/** QuaternionNormalize from the raylib 6.0 API. */
export function QuaternionNormalize(q: Quaternion): Quaternion {
  const buf = lib.QuaternionNormalize(q.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionInvert from the raylib 6.0 API. */
export function QuaternionInvert(q: Quaternion): Quaternion {
  const buf = lib.QuaternionInvert(q.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionMultiply from the raylib 6.0 API. */
export function QuaternionMultiply(q1: Quaternion, q2: Quaternion): Quaternion {
  const buf = lib.QuaternionMultiply(q1.buffer, q2.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionScale from the raylib 6.0 API. */
export function QuaternionScale(q: Quaternion, mul: float): Quaternion {
  const buf = lib.QuaternionScale(q.buffer, mul);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionDivide from the raylib 6.0 API. */
export function QuaternionDivide(q1: Quaternion, q2: Quaternion): Quaternion {
  const buf = lib.QuaternionDivide(q1.buffer, q2.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionLerp from the raylib 6.0 API. */
export function QuaternionLerp(
  q1: Quaternion,
  q2: Quaternion,
  amount: float,
): Quaternion {
  const buf = lib.QuaternionLerp(q1.buffer, q2.buffer, amount);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionNlerp from the raylib 6.0 API. */
export function QuaternionNlerp(
  q1: Quaternion,
  q2: Quaternion,
  amount: float,
): Quaternion {
  const buf = lib.QuaternionNlerp(q1.buffer, q2.buffer, amount);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionSlerp from the raylib 6.0 API. */
export function QuaternionSlerp(
  q1: Quaternion,
  q2: Quaternion,
  amount: float,
): Quaternion {
  const buf = lib.QuaternionSlerp(q1.buffer, q2.buffer, amount);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionCubicHermiteSpline from the raylib 6.0 API. */
export function QuaternionCubicHermiteSpline(
  q1: Quaternion,
  outTangent1: Quaternion,
  q2: Quaternion,
  inTangent2: Quaternion,
  t: float,
): Quaternion {
  const buf = lib.QuaternionCubicHermiteSpline(
    q1.buffer,
    outTangent1.buffer,
    q2.buffer,
    inTangent2.buffer,
    t,
  );
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionFromVector3ToVector3 from the raylib 6.0 API. */
export function QuaternionFromVector3ToVector3(
  from: Vector3,
  to: Vector3,
): Quaternion {
  const buf = lib.QuaternionFromVector3ToVector3(from.buffer, to.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionFromMatrix from the raylib 6.0 API. */
export function QuaternionFromMatrix(mat: Matrix): Quaternion {
  const buf = lib.QuaternionFromMatrix(mat.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionToMatrix from the raylib 6.0 API. */
export function QuaternionToMatrix(q: Quaternion): Matrix {
  const buf = lib.QuaternionToMatrix(q.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionFromAxisAngle from the raylib 6.0 API. */
export function QuaternionFromAxisAngle(
  axis: Vector3,
  angle: float,
): Quaternion {
  const buf = lib.QuaternionFromAxisAngle(axis.buffer, angle);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionToAxisAngle from the raylib 6.0 API. */
export function QuaternionToAxisAngle(
  q: Quaternion,
): { axis: Vector3; angle: float } {
  const axis = new Vector3(0, 0, 0);
  const angle = new Float32Array(1);
  lib.QuaternionToAxisAngle(
    q.buffer,
    axis.buffer,
    Deno.UnsafePointer.of(angle.buffer),
  );
  return { axis, angle: angle[0] };
}

/** QuaternionFromEuler from the raylib 6.0 API. */
export function QuaternionFromEuler(
  pitch: float,
  yaw: float,
  roll: float,
): Quaternion {
  const buf = lib.QuaternionFromEuler(pitch, yaw, roll);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionToEuler from the raylib 6.0 API. */
export function QuaternionToEuler(q: Quaternion): Vector3 {
  const buf = lib.QuaternionToEuler(q.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionTransform from the raylib 6.0 API. */
export function QuaternionTransform(q: Quaternion, mat: Matrix): Quaternion {
  const buf = lib.QuaternionTransform(q.buffer, mat.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

/** QuaternionEquals from the raylib 6.0 API. */
export function QuaternionEquals(p: Quaternion, q: Quaternion): boolean {
  return !!lib.QuaternionEquals(p.buffer, q.buffer);
}

/** MatrixCompose from the raylib 6.0 API. */
export function MatrixCompose(
  translation: Vector3,
  rotation: Quaternion,
  scale: Vector3,
): Matrix {
  const buf = lib.MatrixCompose(
    translation.buffer,
    rotation.buffer,
    scale.buffer,
  );
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** MatrixDecompose from the raylib 6.0 API. */
export function MatrixDecompose(
  mat: Matrix,
): { translation: Vector3; rotation: Quaternion; scale: Vector3 } {
  const translation = new Vector3(0, 0, 0);
  const rotation = new Quaternion(0, 0, 0, 1);
  const scale = new Vector3(0, 0, 0);
  lib.MatrixDecompose(
    mat.buffer,
    translation.buffer,
    rotation.buffer,
    scale.buffer,
  );
  return { translation, rotation, scale };
}
