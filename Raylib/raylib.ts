/**
 * Complete native raylib 6.0 API for Deno, including raymath, rcamera, rgestures, and rlgl.
 *
 * @module
 */
import {
  audioControlLib as AUDIO_CONTROL_DLL,
  lib as DLL,
} from "../Bindings/bindings.ts";
// Complete direct API: raylib, raymath, rcamera, rgestures, and rlgl.
export * from "../Bindings/rlgl.ts";
import {
  AudioStream,
  AutomationEvent,
  AutomationEventList,
  BoneInfo,
  BoundingBox,
  Camera2D,
  Camera3D,
  Color,
  FilePathList,
  float16,
  float3,
  Font,
  GlyphInfo,
  Image,
  Material,
  MaterialMap,
  Matrix,
  Mesh,
  Model,
  ModelAnimation,
  ModelSkeleton,
  Music,
  NPatchInfo,
  Ray,
  RayCollision,
  Rectangle,
  RenderTexture,
  RenderTexture as RenderTexture2D,
  Shader,
  Sound,
  Texture,
  Texture as Texture2D,
  Texture as TextureCubemap,
  Transform,
  Vector2,
  Vector3,
  Vector4,
  Vector4 as Quaternion,
  VrDeviceInfo,
  VrStereoConfig,
  Wave,
} from "../Bindings/Structs/structs.ts";

export {
  AudioStream,
  AutomationEvent,
  AutomationEventList,
  BoneInfo,
  BoundingBox,
  Camera2D,
  Camera3D,
  Color,
  FilePathList,
  float16,
  float3,
  Font,
  GlyphInfo,
  Image,
  Material,
  MaterialMap,
  Matrix,
  Mesh,
  Model,
  ModelAnimation,
  ModelSkeleton,
  Music,
  NPatchInfo,
  Quaternion,
  Ray,
  RayCollision,
  Rectangle,
  RenderTexture,
  RenderTexture2D,
  Shader,
  Sound,
  Texture,
  Texture2D,
  TextureCubemap,
  Transform,
  Vector2,
  Vector3,
  Vector4,
  VrDeviceInfo,
  VrStereoConfig,
  Wave,
};

/** float exported by Deno Raylib. */
export type float = number;
/** int exported by Deno Raylib. */
export type int = number;
/** bool exported by Deno Raylib. */
export type bool = boolean;
/** char exported by Deno Raylib. */
export type char = string;

/** Raw 1:1 Deno FFI symbols for advanced APIs that require pointer handling. */
export const native = DLL.symbols;
const lib = native;
const audioControl = AUDIO_CONTROL_DLL.symbols;
/** Camera type fallback, defaults to Camera3D */
export type Camera = Camera3D;

const encoder = new TextEncoder();

function cstr(text: string): Uint8Array<ArrayBuffer> {
  return encoder.encode(text + "\0") as Uint8Array<ArrayBuffer>;
}

function readCString(ptr: Deno.PointerValue): string {
  if (ptr === null) return "";
  return Deno.UnsafePointerView.getCString(ptr);
}

function copyPointerBytes(
  ptr: Deno.PointerValue,
  byteLength: number,
): Uint8Array {
  if (ptr === null || byteLength <= 0) return new Uint8Array();
  const view = new Deno.UnsafePointerView(ptr);
  const source = new Uint8Array(view.getArrayBuffer(byteLength));
  const copy = new Uint8Array(byteLength);
  copy.set(source);
  return copy;
}

function copyAndFreeBytes(
  ptr: Deno.PointerValue,
  byteLength: number,
): Uint8Array {
  const copy = copyPointerBytes(ptr, byteLength);
  if (ptr !== null) lib.MemFree(ptr);
  return copy;
}

function copyAndFreeCString(ptr: Deno.PointerValue): string {
  const text = readCString(ptr);
  if (ptr !== null) lib.MemFree(ptr);
  return text;
}

function readCStringArray(
  ptr: Deno.PointerValue,
  count: number,
): string[] {
  if (ptr === null || count <= 0) return [];
  const view = new Deno.UnsafePointerView(ptr);
  const strings: string[] = [];
  for (let i = 0; i < count; i++) {
    strings.push(readCString(view.getPointer(i * 8)));
  }
  return strings;
}

/** RAYLIB_VERSION_MAJOR from the raylib 6.0 API. */
export const RAYLIB_VERSION_MAJOR = 6;
/** RAYLIB_VERSION_MINOR from the raylib 6.0 API. */
export const RAYLIB_VERSION_MINOR = 0;
/** RAYLIB_VERSION_PATCH from the raylib 6.0 API. */
export const RAYLIB_VERSION_PATCH = 0;
/** RAYLIB_VERSION from the raylib 6.0 API. */
export const RAYLIB_VERSION = "6.0";

/** Whether or not this computer is little or big endian */
export const littleEndian: bool = (() => {
  // Stolen from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
})();

/** concatVector2 exported by Deno Raylib. */
export function concatVector2(vectors: Vector2[]): Float32Array {
  const vecs = new Float32Array(vectors.length * 2);
  for (let i = 0; i < vectors.length; i++) {
    vecs[i * 2] = vectors[i].x;
    vecs[i * 2 + 1] = vectors[i].y;
  }
  return vecs;
}

/** concatVector3 exported by Deno Raylib. */
export function concatVector3(vectors: Vector3[]): Float32Array {
  const vecs = new Float32Array(vectors.length * 3);
  for (let i = 0; i < vectors.length; i++) {
    vecs[i * 3] = vectors[i].x;
    vecs[i * 3 + 1] = vectors[i].y;
    vecs[i * 3 + 2] = vectors[i].z;
  }
  return vecs;
}

/** concatVector4 exported by Deno Raylib. */
export function concatVector4(vectors: Vector4[]): Float32Array {
  const vecs = new Float32Array(vectors.length * 4);
  for (let i = 0; i < vectors.length; i++) {
    vecs[i * 4] = vectors[i].x;
    vecs[i * 4 + 1] = vectors[i].y;
    vecs[i * 4 + 2] = vectors[i].z;
    vecs[i * 4 + 3] = vectors[i].w;
  }
  return vecs;
}

/** concatRectangle exported by Deno Raylib. */
export function concatRectangle(rectangles: Rectangle[]): Float32Array {
  const rects = new Float32Array(rectangles.length * 4);
  for (let i = 0; i < rectangles.length; i++) {
    rects[i * 4] = rectangles[i].x;
    rects[i * 4 + 1] = rectangles[i].y;
    rects[i * 4 + 2] = rectangles[i].width;
    rects[i * 4 + 3] = rectangles[i].height;
  }
  return rects;
}

/** concatColor exported by Deno Raylib. */
export function concatColor(colors: Color[]): Uint8Array {
  const cols = new Uint8Array(colors.length * 4);
  for (let i = 0; i < colors.length; i++) {
    cols[i * 4] = colors[i].r;
    cols[i * 4 + 1] = colors[i].g;
    cols[i * 4 + 2] = colors[i].b;
    cols[i * 4 + 3] = colors[i].a;
  }
  return cols;
}

// enums

/** System/Window config flags */
export enum ConfigFlags {
  /** VSYNC_HINT member. */
  VSYNC_HINT = 0x00000040, // Set to try enabling V-Sync on GPU
  /** FULLSCREEN_MODE member. */
  FULLSCREEN_MODE = 0x00000002, // Set to run program in fullscreen
  /** RESIZABLE member. */
  RESIZABLE = 0x00000004, // Set to allow resizable window
  /** UNDECORATED member. */
  UNDECORATED = 0x00000008, // Set to disable window decoration (frame and buttons)
  /** HIDDEN member. */
  HIDDEN = 0x00000080, // Set to hide window
  /** MINIMIZED member. */
  MINIMIZED = 0x00000200, // Set to minimize window (iconify)
  /** MAXIMIZED member. */
  MAXIMIZED = 0x00000400, // Set to maximize window (expanded to monitor)
  /** UNFOCUSED member. */
  UNFOCUSED = 0x00000800, // Set to window non focused
  /** TOPMOST member. */
  TOPMOST = 0x00001000, // Set to window always on top
  /** ALWAYS_RUN member. */
  ALWAYS_RUN = 0x00000100, // Set to allow windows running while minimized
  /** TRANSPARENT member. */
  TRANSPARENT = 0x00000010, // Set to allow transparent framebuffer
  /** HIGHDPI member. */
  HIGHDPI = 0x00002000, // Set to support HighDPI
  /** MOUSE_PASSTHROUGH member. */
  MOUSE_PASSTHROUGH = 0x00004000, // Set to support mouse passthrough, only supported when WINDOW_UNDECORATED
  /** BORDERLESS member. */
  BORDERLESS = 0x00008000, // Set to run program in borderless windowed mode
  /** MSAA_4X_HINT member. */
  MSAA_4X_HINT = 0x00000020, // Set to try enabling MSAA 4X
  /** INTERLACED_HINT member. */
  INTERLACED_HINT = 0x00010000, // Set to try enabling interlaced video format (for V3D)
}

/** Trace log level */
export enum TraceLogLevel {
  /** ALL member. */
  ALL = 0, // Display all logs
  TRACE, // Trace logging, intended for internal use only
  DEBUG, // Debug logging, used for internal debugging, it should be disabled on release builds
  INFO, // Info logging, used for program execution info
  WARNING, // Warning logging, used on recoverable failures
  ERROR, // Error logging, used on unrecoverable failures
  FATAL, // Fatal logging, used to abort program: exit(EXIT_FAILURE)
  NONE, // Disable logging
}

/** Keyboard keys (US keyboard layout) */
export enum KeyboardKey {
  /** NULL member. */
  NULL = 0, // Key: NULL, used for no key pressed
  // Alphanumeric keys
  /** APOSTROPHE member. */
  APOSTROPHE = 39, // Key: '
  /** COMMA member. */
  COMMA = 44, // Key: ,
  /** MINUS member. */
  MINUS = 45, // Key: -
  /** PERIOD member. */
  PERIOD = 46, // Key: .
  /** SLASH member. */
  SLASH = 47, // Key: /
  /** ZERO member. */
  ZERO = 48, // Key: 0
  /** ONE member. */
  ONE = 49, // Key: 1
  /** TWO member. */
  TWO = 50, // Key: 2
  /** THREE member. */
  THREE = 51, // Key: 3
  /** FOUR member. */
  FOUR = 52, // Key: 4
  /** FIVE member. */
  FIVE = 53, // Key: 5
  /** SIX member. */
  SIX = 54, // Key: 6
  /** SEVEN member. */
  SEVEN = 55, // Key: 7
  /** EIGHT member. */
  EIGHT = 56, // Key: 8
  /** NINE member. */
  NINE = 57, // Key: 9
  /** SEMICOLON member. */
  SEMICOLON = 59, // Key: ;
  /** EQUAL member. */
  EQUAL = 61, // Key: =
  /** A member. */
  A = 65, // Key: A | a
  /** B member. */
  B = 66, // Key: B | b
  /** C member. */
  C = 67, // Key: C | c
  /** D member. */
  D = 68, // Key: D | d
  /** E member. */
  E = 69, // Key: E | e
  /** F member. */
  F = 70, // Key: F | f
  /** G member. */
  G = 71, // Key: G | g
  /** H member. */
  H = 72, // Key: H | h
  /** I member. */
  I = 73, // Key: I | i
  /** J member. */
  J = 74, // Key: J | j
  /** K member. */
  K = 75, // Key: K | k
  /** L member. */
  L = 76, // Key: L | l
  /** M member. */
  M = 77, // Key: M | m
  /** N member. */
  N = 78, // Key: N | n
  /** O member. */
  O = 79, // Key: O | o
  /** P member. */
  P = 80, // Key: P | p
  /** Q member. */
  Q = 81, // Key: Q | q
  /** R member. */
  R = 82, // Key: R | r
  /** S member. */
  S = 83, // Key: S | s
  /** T member. */
  T = 84, // Key: T | t
  /** U member. */
  U = 85, // Key: U | u
  /** V member. */
  V = 86, // Key: V | v
  /** W member. */
  W = 87, // Key: W | w
  /** X member. */
  X = 88, // Key: X | x
  /** Y member. */
  Y = 89, // Key: Y | y
  /** Z member. */
  Z = 90, // Key: Z | z
  /** LEFT_BRACKET member. */
  LEFT_BRACKET = 91, // Key: [
  /** BACKSLASH member. */
  BACKSLASH = 92, // Key: '\'
  /** RIGHT_BRACKET member. */
  RIGHT_BRACKET = 93, // Key: ]
  /** GRAVE member. */
  GRAVE = 96, // Key: `
  // Function keys
  /** SPACE member. */
  SPACE = 32, // Key: Space
  /** ESCAPE member. */
  ESCAPE = 256, // Key: Esc
  /** ENTER member. */
  ENTER = 257, // Key: Enter
  /** TAB member. */
  TAB = 258, // Key: Tab
  /** BACKSPACE member. */
  BACKSPACE = 259, // Key: Backspace
  /** INSERT member. */
  INSERT = 260, // Key: Ins
  /** DELETE member. */
  DELETE = 261, // Key: Del
  /** RIGHT member. */
  RIGHT = 262, // Key: Cursor right
  /** LEFT member. */
  LEFT = 263, // Key: Cursor left
  /** DOWN member. */
  DOWN = 264, // Key: Cursor down
  /** UP member. */
  UP = 265, // Key: Cursor up
  /** PAGE_UP member. */
  PAGE_UP = 266, // Key: Page up
  /** PAGE_DOWN member. */
  PAGE_DOWN = 267, // Key: Page down
  /** HOME member. */
  HOME = 268, // Key: Home
  /** END member. */
  END = 269, // Key: End
  /** CAPS_LOCK member. */
  CAPS_LOCK = 280, // Key: Caps lock
  /** SCROLL_LOCK member. */
  SCROLL_LOCK = 281, // Key: Scroll down
  /** NUM_LOCK member. */
  NUM_LOCK = 282, // Key: Num lock
  /** PRINT_SCREEN member. */
  PRINT_SCREEN = 283, // Key: Print screen
  /** PAUSE member. */
  PAUSE = 284, // Key: Pause
  /** F1 member. */
  F1 = 290, // Key: F1
  /** F2 member. */
  F2 = 291, // Key: F2
  /** F3 member. */
  F3 = 292, // Key: F3
  /** F4 member. */
  F4 = 293, // Key: F4
  /** F5 member. */
  F5 = 294, // Key: F5
  /** F6 member. */
  F6 = 295, // Key: F6
  /** F7 member. */
  F7 = 296, // Key: F7
  /** F8 member. */
  F8 = 297, // Key: F8
  /** F9 member. */
  F9 = 298, // Key: F9
  /** F10 member. */
  F10 = 299, // Key: F10
  /** F11 member. */
  F11 = 300, // Key: F11
  /** F12 member. */
  F12 = 301, // Key: F12
  /** LEFT_SHIFT member. */
  LEFT_SHIFT = 340, // Key: Shift left
  /** LEFT_CONTROL member. */
  LEFT_CONTROL = 341, // Key: Control left
  /** LEFT_ALT member. */
  LEFT_ALT = 342, // Key: Alt left
  /** LEFT_SUPER member. */
  LEFT_SUPER = 343, // Key: Super left
  /** RIGHT_SHIFT member. */
  RIGHT_SHIFT = 344, // Key: Shift right
  /** RIGHT_CONTROL member. */
  RIGHT_CONTROL = 345, // Key: Control right
  /** RIGHT_ALT member. */
  RIGHT_ALT = 346, // Key: Alt right
  /** RIGHT_SUPER member. */
  RIGHT_SUPER = 347, // Key: Super right
  /** KB_MENU member. */
  KB_MENU = 348, // Key: KB menu
  // Keypad keys
  /** KP_0 member. */
  KP_0 = 320, // Key: Keypad 0
  /** KP_1 member. */
  KP_1 = 321, // Key: Keypad 1
  /** KP_2 member. */
  KP_2 = 322, // Key: Keypad 2
  /** KP_3 member. */
  KP_3 = 323, // Key: Keypad 3
  /** KP_4 member. */
  KP_4 = 324, // Key: Keypad 4
  /** KP_5 member. */
  KP_5 = 325, // Key: Keypad 5
  /** KP_6 member. */
  KP_6 = 326, // Key: Keypad 6
  /** KP_7 member. */
  KP_7 = 327, // Key: Keypad 7
  /** KP_8 member. */
  KP_8 = 328, // Key: Keypad 8
  /** KP_9 member. */
  KP_9 = 329, // Key: Keypad 9
  /** KP_DECIMAL member. */
  KP_DECIMAL = 330, // Key: Keypad .
  /** KP_DIVIDE member. */
  KP_DIVIDE = 331, // Key: Keypad /
  /** KP_MULTIPLY member. */
  KP_MULTIPLY = 332, // Key: Keypad *
  /** KP_SUBTRACT member. */
  KP_SUBTRACT = 333, // Key: Keypad -
  /** KP_ADD member. */
  KP_ADD = 334, // Key: Keypad +
  /** KP_ENTER member. */
  KP_ENTER = 335, // Key: Keypad Enter
  /** KP_EQUAL member. */
  KP_EQUAL = 336, // Key: Keypad =
  // Android key buttons
  /** BACK member. */
  BACK = 4, // Key: Android back button
  /** MENU member. */
  MENU = 5, // Key: Android menu button
  /** VOLUME_UP member. */
  VOLUME_UP = 24, // Key: Android volume up button
  /** VOLUME_DOWN member. */
  VOLUME_DOWN = 25, // Key: Android volume down button
}

/** Mouse buttons */
export enum MouseButton {
  /** LEFT member. */
  LEFT = 0, // Mouse button left
  /** RIGHT member. */
  RIGHT = 1, // Mouse button right
  /** MIDDLE member. */
  MIDDLE = 2, // Mouse button middle (pressed wheel)
  /** SIDE member. */
  SIDE = 3, // Mouse button side (advanced mouse device)
  /** EXTRA member. */
  EXTRA = 4, // Mouse button extra (advanced mouse device)
  /** FORWARD member. */
  FORWARD = 5, // Mouse button forward (advanced mouse device)
  /** BACK member. */
  BACK = 6, // Mouse button back (advanced mouse device)
}

/** Mouse cursor */
export enum MouseCursor {
  /** DEFAULT member. */
  DEFAULT = 0, // Default pointer shape
  /** ARROW member. */
  ARROW = 1, // Arrow shape
  /** IBEAM member. */
  IBEAM = 2, // Text writing cursor shape
  /** CROSSHAIR member. */
  CROSSHAIR = 3, // Cross shape
  /** POINTING_HAND member. */
  POINTING_HAND = 4, // Pointing hand cursor
  /** RESIZE_EW member. */
  RESIZE_EW = 5, // Horizontal resize/move arrow shape
  /** RESIZE_NS member. */
  RESIZE_NS = 6, // Vertical resize/move arrow shape
  /** RESIZE_NWSE member. */
  RESIZE_NWSE = 7, // Top-left to bottom-right diagonal resize/move arrow shape
  /** RESIZE_NESW member. */
  RESIZE_NESW = 8, // The top-right to bottom-left diagonal resize/move arrow shape
  /** RESIZE_ALL member. */
  RESIZE_ALL = 9, // The omnidirectional resize/move cursor shape
  /** NOT_ALLOWED member. */
  NOT_ALLOWED = 10, // The operation-not-allowed shape
}

/** Gamepad buttons */
export enum GamepadButton {
  /** UNKNOWN member. */
  UNKNOWN = 0, // Unknown button, just for error checking
  LEFT_FACE_UP, // Gamepad left DPAD up button
  LEFT_FACE_RIGHT, // Gamepad left DPAD right button
  LEFT_FACE_DOWN, // Gamepad left DPAD down button
  LEFT_FACE_LEFT, // Gamepad left DPAD left button
  RIGHT_FACE_UP, // Gamepad right button up (i.e. PS3: Triangle, Xbox: Y)
  RIGHT_FACE_RIGHT, // Gamepad right button right (i.e. PS3: Circle, Xbox: B)
  RIGHT_FACE_DOWN, // Gamepad right button down (i.e. PS3: Cross, Xbox: A)
  RIGHT_FACE_LEFT, // Gamepad right button left (i.e. PS3: Square, Xbox: X)
  LEFT_TRIGGER_1, // Gamepad top/back trigger left (first), it could be a trailing button
  LEFT_TRIGGER_2, // Gamepad top/back trigger left (second), it could be a trailing button
  RIGHT_TRIGGER_1, // Gamepad top/back trigger right (first), it could be a trailing button
  RIGHT_TRIGGER_2, // Gamepad top/back trigger right (second), it could be a trailing button
  MIDDLE_LEFT, // Gamepad center buttons, left one (i.e. PS3: Select)
  MIDDLE, // Gamepad center buttons, middle one (i.e. PS3: PS, Xbox: XBOX)
  MIDDLE_RIGHT, // Gamepad center buttons, right one (i.e. PS3: Start)
  LEFT_THUMB, // Gamepad joystick pressed button left
  RIGHT_THUMB, // Gamepad joystick pressed button right
}

/** Gamepad axes */
export enum GamepadAxis {
  /** LEFT_X member. */
  LEFT_X = 0, // Gamepad left stick X axis
  /** LEFT_Y member. */
  LEFT_Y = 1, // Gamepad left stick Y axis
  /** RIGHT_X member. */
  RIGHT_X = 2, // Gamepad right stick X axis
  /** RIGHT_Y member. */
  RIGHT_Y = 3, // Gamepad right stick Y axis
  /** LEFT_TRIGGER member. */
  LEFT_TRIGGER = 4, // Gamepad back trigger left, pressure level: [1..-1]
  /** RIGHT_TRIGGER member. */
  RIGHT_TRIGGER = 5, // Gamepad back trigger right, pressure level: [1..-1]
}

/** Material map index */
export enum MaterialMapIndex {
  /** ALBEDO member. */
  ALBEDO = 0, // Albedo material (same as:  DIFFUSE)
  METALNESS, // Metalness material (same as:   SPECULAR)
  NORMAL, // Normal material
  ROUGHNESS, // Roughness material
  OCCLUSION, // Ambient occlusion material
  EMISSION, // Emission material
  HEIGHT, // Heightmap material
  CUBEMAP, // Cubemap material (NOTE: Uses GL_TEXTURE_CUBE_MAP)
  IRRADIANCE, // Irradiance material (NOTE: Uses GL_TEXTURE_CUBE_MAP)
  PREFILTER, // Prefilter material (NOTE: Uses GL_TEXTURE_CUBE_MAP)
  BRDF, // Brdf material
}

/** Shader location index */
export enum ShaderLocationIndex {
  /** VERTEX_POSITION member. */
  VERTEX_POSITION = 0, // Shader location: vertex attribute: position
  VERTEX_TEXCOORD01, // Shader location: vertex attribute: texcoord01
  VERTEX_TEXCOORD02, // Shader location: vertex attribute: texcoord02
  VERTEX_NORMAL, // Shader location: vertex attribute: normal
  VERTEX_TANGENT, // Shader location: vertex attribute: tangent
  VERTEX_COLOR, // Shader location: vertex attribute: color
  MATRIX_MVP, // Shader location: matrix uniform: model-view-projection
  MATRIX_VIEW, // Shader location: matrix uniform: view (camera transform)
  MATRIX_PROJECTION, // Shader location: matrix uniform: projection
  MATRIX_MODEL, // Shader location: matrix uniform: model (transform)
  MATRIX_NORMAL, // Shader location: matrix uniform: normal
  VECTOR_VIEW, // Shader location: vector uniform: view
  COLOR_DIFFUSE, // Shader location: vector uniform: diffuse color
  COLOR_SPECULAR, // Shader location: vector uniform: specular color
  COLOR_AMBIENT, // Shader location: vector uniform: ambient color
  MAP_ALBEDO, // Shader location: sampler2d texture: albedo (same as: MAP_DIFFUSE)
  MAP_METALNESS, // Shader location: sampler2d texture: metalness (same as: MAP_SPECULAR)
  MAP_NORMAL, // Shader location: sampler2d texture: normal
  MAP_ROUGHNESS, // Shader location: sampler2d texture: roughness
  MAP_OCCLUSION, // Shader location: sampler2d texture: occlusion
  MAP_EMISSION, // Shader location: sampler2d texture: emission
  MAP_HEIGHT, // Shader location: sampler2d texture: height
  MAP_CUBEMAP, // Shader location: samplerCube texture: cubemap
  MAP_IRRADIANCE, // Shader location: samplerCube texture: irradiance
  MAP_PREFILTER, // Shader location: samplerCube texture: prefilter
  MAP_BRDF, // Shader location: sampler2d texture: brdf
  VERTEX_BONEIDS, // Shader location: vertex attribute: boneIds
  VERTEX_BONEWEIGHTS, // Shader location: vertex attribute: boneWeights
  BONE_MATRICES, // Shader location: array of matrices uniform: boneMatrices
  /** MATRIX_BONETRANSFORMS member. */
  MATRIX_BONETRANSFORMS = 28, // Shader location: array of matrices uniform: bone transforms
  VERTEX_INSTANCETRANSFORM, // Shader location: vertex attribute: instance transform
}

/** Shader uniform data type */
export enum ShaderUniformDataType {
  /** FLOAT member. */
  FLOAT = 0, // Shader uniform type: float
  VEC2, // Shader uniform type: vec2 (2 float)
  VEC3, // Shader uniform type: vec3 (3 float)
  VEC4, // Shader uniform type: vec4 (4 float)
  INT, // Shader uniform type: int
  IVEC2, // Shader uniform type: ivec2 (2 int)
  IVEC3, // Shader uniform type: ivec3 (3 int)
  IVEC4, // Shader uniform type: ivec4 (4 int)
  UINT, // Shader uniform type: unsigned int
  UIVEC2, // Shader uniform type: uivec2 (2 unsigned int)
  UIVEC3, // Shader uniform type: uivec3 (3 unsigned int)
  UIVEC4, // Shader uniform type: uivec4 (4 unsigned int)
  SAMPLER2D, // Shader uniform type: sampler2d
}

/** Shader attribute data types */
export enum ShaderAttributeDataType {
  /** FLOAT member. */
  FLOAT = 0, // Shader attribute type: float
  VEC2, // Shader attribute type: vec2 (2 float)
  VEC3, // Shader attribute type: vec3 (3 float)
  VEC4, // Shader attribute type: vec4 (4 float)
}

/** Pixel formats */
export enum PixelFormat {
  /** UNCOMPRESSED_GRAYSCALE member. */
  UNCOMPRESSED_GRAYSCALE = 1, // 8 bit per pixel (no alpha)
  UNCOMPRESSED_GRAY_ALPHA, // 8*2 bpp (2 channels)
  UNCOMPRESSED_R5G6B5, // 16 bpp
  UNCOMPRESSED_R8G8B8, // 24 bpp
  UNCOMPRESSED_R5G5B5A1, // 16 bpp (1 bit alpha)
  UNCOMPRESSED_R4G4B4A4, // 16 bpp (4 bit alpha)
  UNCOMPRESSED_R8G8B8A8, // 32 bpp
  UNCOMPRESSED_R32, // 32 bpp (1 channel - float)
  UNCOMPRESSED_R32G32B32, // 32*3 bpp (3 channels - float)
  UNCOMPRESSED_R32G32B32A32, // 32*4 bpp (4 channels - float)
  UNCOMPRESSED_R16, // 16 bpp (1 channel - half float)
  UNCOMPRESSED_R16G16B16, // 16*3 bpp (3 channels - half float)
  UNCOMPRESSED_R16G16B16A16, // 16*4 bpp (4 channels - half float)
  COMPRESSED_DXT1_RGB, // 4 bpp (no alpha)
  COMPRESSED_DXT1_RGBA, // 4 bpp (1 bit alpha)
  COMPRESSED_DXT3_RGBA, // 8 bpp
  COMPRESSED_DXT5_RGBA, // 8 bpp
  COMPRESSED_ETC1_RGB, // 4 bpp
  COMPRESSED_ETC2_RGB, // 4 bpp
  COMPRESSED_ETC2_EAC_RGBA, // 8 bpp
  COMPRESSED_PVRT_RGB, // 4 bpp
  COMPRESSED_PVRT_RGBA, // 4 bpp
  COMPRESSED_ASTC_4x4_RGBA, // 8 bpp
  COMPRESSED_ASTC_8x8_RGBA, // 2 bpp
}

/** Texture parameters: filter mode */
export enum TextureFilter {
  /** POINT member. */
  POINT = 0, // No filter, just pixel approximation
  BILINEAR, // Linear filtering
  TRILINEAR, // Trilinear filtering (linear with mipmaps)
  ANISOTROPIC_4X, // Anisotropic filtering 4x
  ANISOTROPIC_8X, // Anisotropic filtering 8x
  ANISOTROPIC_16X, // Anisotropic filtering 16x
}

/** Texture parameters: wrap mode */
export enum TextureWrap {
  /** REPEAT member. */
  REPEAT = 0, // Repeats texture in tiled mode
  CLAMP, // Clamps texture to edge pixel in tiled mode
  MIRROR_REPEAT, // Mirrors and repeats the texture in tiled mode
  MIRROR_CLAMP, // Mirrors and clamps to border the texture in tiled mode
}

/** Cubemap layouts */
export enum CubemapLayout {
  /** AUTO_DETECT member. */
  AUTO_DETECT = 0, // Automatically detect layout type
  LINE_VERTICAL, // Layout is defined by a vertical line with faces
  LINE_HORIZONTAL, // Layout is defined by a horizontal line with faces
  CROSS_THREE_BY_FOUR, // Layout is defined by a 3x4 cross with cubemap faces
  CROSS_FOUR_BY_THREE, // Layout is defined by a 4x3 cross with cubemap faces
}

/** Font type, defines generation method */
export enum FontType {
  /** DEFAULT member. */
  DEFAULT = 0, // Default font generation, anti-aliased
  BITMAP, // Bitmap font generation, no anti-aliasing
  SDF, // SDF font generation, requires external shader
}

/** Color blending modes (pre-defined) */
export enum BlendMode {
  /** ALPHA member. */
  ALPHA = 0, // Blend textures considering alpha (default)
  ADDITIVE, // Blend textures adding colors
  MULTIPLIED, // Blend textures multiplying colors
  ADD_COLORS, // Blend textures adding colors (alternative)
  SUBTRACT_COLORS, // Blend textures subtracting colors (alternative)
  ALPHA_PREMULTIPLY, // Blend premultiplied textures considering alpha
  CUSTOM, // Blend textures using custom src/dst factors (use rlSetBlendFactors())
  CUSTOM_SEPARATE, // Blend textures using custom rgb/alpha separate src/dst factors (use rlSetBlendFactorsSeparate())
}

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

/** Camera system modes */
export enum CameraMode {
  /** CUSTOM member. */
  CUSTOM = 0, // Camera custom, controlled by user (UpdateCamera() does nothing)
  FREE, // Camera free mode
  ORBITAL, // Camera orbital, around target, zoom supported
  FIRST_PERSON, // Camera first person
  THIRD_PERSON, // Camera third person
}

/** Camera projection */
export enum CameraProjection {
  /** PERSPECTIVE member. */
  PERSPECTIVE = 0, // Perspective projection
  ORTHOGRAPHIC, // Orthographic projection
}

/** N-patch layout */
export enum NPatchLayout {
  /** NINE_PATCH member. */
  NINE_PATCH = 0, // Npatch layout: 3x3 tiles
  THREE_PATCH_VERTICAL, // Npatch layout: 1x3 tiles
  THREE_PATCH_HORIZONTAL, // Npatch layout: 3x1 tiles
}

// struct types (imported)
// consts

/** LightGray exported by Deno Raylib. */
export const LightGray: Color = new Color(200, 200, 200, 255);
/** Gray exported by Deno Raylib. */
export const Gray: Color = new Color(130, 130, 130, 255);
/** DarkGray exported by Deno Raylib. */
export const DarkGray: Color = new Color(80, 80, 80, 255);

/** Yellow exported by Deno Raylib. */
export const Yellow: Color = new Color(253, 249, 0, 255);
/** Gold exported by Deno Raylib. */
export const Gold: Color = new Color(255, 203, 0, 255);
/** Orange exported by Deno Raylib. */
export const Orange: Color = new Color(255, 161, 0, 255);
/** Pink exported by Deno Raylib. */
export const Pink: Color = new Color(255, 109, 194, 255);
/** Red exported by Deno Raylib. */
export const Red: Color = new Color(230, 41, 55, 255);
/** Maroon exported by Deno Raylib. */
export const Maroon: Color = new Color(190, 33, 55, 255);

/** Green exported by Deno Raylib. */
export const Green: Color = new Color(0, 228, 48, 255);
/** Lime exported by Deno Raylib. */
export const Lime: Color = new Color(0, 158, 47, 255);
/** DarkGreen exported by Deno Raylib. */
export const DarkGreen: Color = new Color(0, 117, 44, 255);

/** SkyBlue exported by Deno Raylib. */
export const SkyBlue: Color = new Color(102, 191, 255, 255);
/** Blue exported by Deno Raylib. */
export const Blue: Color = new Color(0, 121, 241, 255);
/** DarkBlue exported by Deno Raylib. */
export const DarkBlue: Color = new Color(0, 82, 172, 255);

/** Purple exported by Deno Raylib. */
export const Purple: Color = new Color(200, 122, 255, 255);
/** Violet exported by Deno Raylib. */
export const Violet: Color = new Color(135, 60, 190, 255);
/** DarkPurple exported by Deno Raylib. */
export const DarkPurple: Color = new Color(112, 31, 126, 255);

/** Beige exported by Deno Raylib. */
export const Beige: Color = new Color(211, 176, 131, 255);
/** Brown exported by Deno Raylib. */
export const Brown: Color = new Color(127, 106, 79, 255);
/** DarkBrown exported by Deno Raylib. */
export const DarkBrown: Color = new Color(76, 63, 47, 255);

/** White exported by Deno Raylib. */
export const White: Color = new Color(255, 255, 255, 255);
/** Black exported by Deno Raylib. */
export const Black: Color = new Color(0, 0, 0, 255);
/** Blank exported by Deno Raylib. */
export const Blank: Color = new Color(0, 0, 0, 0);
/** Magenta exported by Deno Raylib. */
export const Magenta: Color = new Color(255, 0, 255, 255);
/** RayWhite exported by Deno Raylib. */
export const RayWhite: Color = new Color(245, 245, 245, 255);

// functions

/** Initialize window and OpenGL context */
export function InitWindow(width: int, height: int, title: string): void {
  lib.InitWindow(width, height, new TextEncoder().encode(title + "\0"));
}

/** Close window and unload OpenGL context */
export function CloseWindow(): void {
  lib.CloseWindow();
}

/** Check if application should close (KEY_ESCAPE pressed or windows close icon clicked) */
export function WindowShouldClose(): boolean {
  return !!lib.WindowShouldClose();
}

/** Check if window has been initialized successfully */
export function IsWindowReady(): boolean {
  return !!lib.IsWindowReady();
}

/** Check if window is currently fullscreen */
export function IsWindowFullscreen(): boolean {
  return !!lib.IsWindowFullscreen();
}

/** Check if window is currently hidden */
export function IsWindowHidden(): boolean {
  return !!lib.IsWindowHidden();
}

/** Check if window is currently minimized */
export function IsWindowMinimized(): boolean {
  return !!lib.IsWindowMinimized();
}

/** Check if window is currently maximized */
export function IsWindowMaximized(): boolean {
  return !!lib.IsWindowMaximized();
}

/** Check if window is currently focused */
export function IsWindowFocused(): boolean {
  return !!lib.IsWindowFocused();
}

/** Check if window has been resized last frame */
export function IsWindowResized(): boolean {
  return !!lib.IsWindowResized();
}

/** Check if one specific window flag is enabled */
export function IsWindowState(state: ConfigFlags): boolean {
  return !!lib.IsWindowState(state);
}

/** Set window configuration state using flags */
export function SetWindowState(state: ConfigFlags): void {
  lib.SetWindowState(state);
}

/** Clear window configuration state flags */
export function ClearWindowState(state: ConfigFlags): void {
  lib.ClearWindowState(state);
}

/** Toggle window state: fullscreen/windowed, resizes monitor to match window resolution */
export function ToggleFullscreen(): void {
  lib.ToggleFullscreen();
}

/** Toggle window state: borderless windowed, resizes window to match monitor resolution */
export function ToggleBorderlessWindowed(): void {
  lib.ToggleBorderlessWindowed();
}

/** MaximizedWindow exported by Deno Raylib. */
export function MaximizedWindow(): void {
  lib.MaximizeWindow();
}

/** Set window state: maximized, if resizable */
export function MaximizeWindow(): void {
  lib.MaximizeWindow();
}

/** MinimizedWindow exported by Deno Raylib. */
export function MinimizedWindow(): void {
  lib.MinimizeWindow();
}

/** Set window state: minimized, if resizable */
export function MinimizeWindow(): void {
  lib.MinimizeWindow();
}

/** Restore window from being minimized/maximized */
export function RestoreWindow(): void {
  lib.RestoreWindow();
}

/** Set icon for window (single image, RGBA 32bit) */
export function SetWindowIcon(image: Image): void {
  lib.SetWindowIcon(image.buffer);
}

/** Set icon for window (multiple images, RGBA 32bit) */
export function SetWindowIcons(images: Image[]): void {
  const count = images.length;

  const buf = new Uint8Array(Image.SIZE * count);

  for (let i = 0; i < count; i++) {
    buf.set(images[i].buffer, i * Image.SIZE);
  }

  lib.SetWindowIcons(
    buf,
    count,
  );
}

/** Set title for window */
export function SetWindowTitle(title: string): void {
  lib.SetWindowTitle(new TextEncoder().encode(title + "\0"));
}

/** Set window position on screen */
export function SetWindowPosition(x: int, y: int): void {
  lib.SetWindowPosition(x, y);
}

/** Set monitor for the current window */
export function SetWindowMonitor(monitor: int): void {
  lib.SetWindowMonitor(monitor);
}

/** Set window minimum dimensions (for FLAG_WINDOW_RESIZABLE) */
export function SetWindowMinSize(width: int, height: int): void {
  lib.SetWindowMinSize(width, height);
}

/** Set window maximum dimensions (for FLAG_WINDOW_RESIZABLE) */
export function SetWindowMaxSize(width: int, height: int): void {
  lib.SetWindowMaxSize(width, height);
}

/** Set window dimensions */
export function SetWindowSize(width: int, height: int): void {
  lib.SetWindowSize(width, height);
}

/** Set window opacity [0.0f..1.0f] */
export function SetWindowOpacity(opacity: float): void {
  lib.SetWindowOpacity(opacity);
}

/** Set window focused */
export function SetWindowFocused(): void {
  lib.SetWindowFocused();
}

/** Get native window handle */
export function GetWindowHandle(): Deno.PointerValue {
  return lib.GetWindowHandle();
}

/** Get current screen width */
export function GetScreenWidth(): int {
  return lib.GetScreenWidth();
}

/** Get current screen height */
export function GetScreenHeight(): int {
  return lib.GetScreenHeight();
}

/** Get current render width (it considers HiDPI) */
export function GetRenderWidth(): int {
  return lib.GetRenderWidth();
}

/** Get current render height (it considers HiDPI) */
export function GetRenderHeight(): int {
  return lib.GetRenderHeight();
}

/** Get number of connected monitors */
export function GetMonitorCount(): int {
  return lib.GetMonitorCount();
}

/** Get current monitor where window is placed */
export function GetCurrentMonitor(): int {
  return lib.GetCurrentMonitor();
}

/** Get specified monitor position */
export function GetMonitorPosition(monitor: int): Vector2 {
  const buf = lib.GetMonitorPosition(monitor);
  const f = new Float32Array(buf.buffer, buf.byteOffset, 2);
  return new Vector2(f[0], f[1]);
}

/** Get specified monitor width (current video mode used by monitor) */
export function GetMonitorWidth(monitor: int): int {
  return lib.GetMonitorWidth(monitor);
}

/** Get specified monitor height (current video mode used by monitor) */
export function GetMonitorHeight(monitor: int): int {
  return lib.GetMonitorHeight(monitor);
}

/** Get specified monitor physical width in millimetres */
export function GetMonitorPhysicalWidth(monitor: int): int {
  return lib.GetMonitorPhysicalWidth(monitor);
}

/** Get specified monitor physical height in millimetres */
export function GetMonitorPhysicalHeight(monitor: int): int {
  return lib.GetMonitorPhysicalHeight(monitor);
}

/** Get specified monitor refresh rate */
export function GetMonitorRefreshRate(monitor: int): int {
  return lib.GetMonitorRefreshRate(monitor);
}

/** Get window position XY on monitor */
export function GetWindowPosition(): Vector2 {
  const buf = lib.GetWindowPosition();
  const f = new Float32Array(buf.buffer, buf.byteOffset, 2);
  return new Vector2(f[0], f[1]);
}

/** Get window scale DPI factor */
export function GetWindowScaleDPI(): Vector2 {
  const buf = lib.GetWindowScaleDPI();
  const f = new Float32Array(buf.buffer, buf.byteOffset, 2);
  return new Vector2(f[0], f[1]);
}

/** Get the human-readable, UTF-8 encoded name of the specified monitor */
export function GetMonitorName(monitor: int): string {
  const ptr = lib.GetMonitorName(monitor);
  if (ptr === null) return "";
  return Deno.UnsafePointerView.getCString(ptr);
}

/** Set clipboard text content */
export function SetClipboardText(text: string): void {
  lib.SetClipboardText(new TextEncoder().encode(text + "\0"));
}

/** Get clipboard text content */
export function GetClipboardText(): string {
  const buf = lib.GetClipboardText();
  if (buf === null) return "";
  return Deno.UnsafePointerView.getCString(buf);
}

/** Get clipboard image content */
export function GetClipboardImage(): Image {
  const buf = lib.GetClipboardImage();
  return new Image(buf);
}

/** Enable waiting for events on EndDrawing(), no automatic event polling */
export function EnableEventWaiting(): void {
  lib.EnableEventWaiting();
}

/** Disable waiting for events on EndDrawing(), automatic events polling */
export function DisableEventWaiting(): void {
  lib.DisableEventWaiting();
}

/** Shows cursor */
export function ShowCursor(): void {
  lib.ShowCursor();
}

/** Hides cursor */
export function HideCursor(): void {
  lib.HideCursor();
}

/** Check if cursor is not visible */
export function IsCursorHidden(): boolean {
  return !!lib.IsCursorHidden();
}

/** Enables cursor (unlock cursor) */
export function EnableCursor(): void {
  lib.EnableCursor();
}

/** Disables cursor (lock cursor) */
export function DisableCursor(): void {
  lib.DisableCursor();
}

/** Check if cursor is on the screen */
export function IsCursorOnScreen(): boolean {
  return !!lib.IsCursorOnScreen();
}

/** Set background color (framebuffer clear color) */
export function ClearBackground(color: Color): void {
  lib.ClearBackground(color.buffer);
}

/** Setup canvas (framebuffer) to start drawing */
export function BeginDrawing(): void {
  lib.BeginDrawing();
}

/** End canvas drawing and swap buffers (double buffering) */
export function EndDrawing(): void {
  lib.EndDrawing();
}

/** Begin 2D mode with custom camera (2D) */
export function BeginMode2D(camera: Camera2D): void {
  lib.BeginMode2D(camera.buffer);
}

/** Ends 2D mode with custom camera */
export function EndMode2D(): void {
  lib.EndMode2D();
}

/** Begin 3D mode with custom camera (3D) */
export function BeginMode3D(camera: Camera3D): void {
  lib.BeginMode3D(camera.buffer);
}

/** Ends 3D mode and returns to default 2D orthographic mode */
export function EndMode3D(): void {
  lib.EndMode3D();
}

// rlgl state helpers (skybox)
/** DisableBackfaceCulling exported by Deno Raylib. */
export function DisableBackfaceCulling(): void {
  lib.rlDisableBackfaceCulling();
}

/** EnableBackfaceCulling exported by Deno Raylib. */
export function EnableBackfaceCulling(): void {
  lib.rlEnableBackfaceCulling();
}

/** DisableDepthMask exported by Deno Raylib. */
export function DisableDepthMask(): void {
  lib.rlDisableDepthMask();
}

/** EnableDepthMask exported by Deno Raylib. */
export function EnableDepthMask(): void {
  lib.rlEnableDepthMask();
}

/** Begin drawing to render texture */
export function BeginTextureMode(target: RenderTexture): void {
  lib.BeginTextureMode(target.buffer);
}

/** Ends drawing to render texture */
export function EndTextureMode(): void {
  lib.EndTextureMode();
}

/** Begin custom shader drawing */
export function BeginShaderMode(shader: Shader): void {
  lib.BeginShaderMode(shader.buffer);
}

/** End custom shader drawing (use default shader) */
export function EndShaderMode(): void {
  lib.EndShaderMode();
}

/** Begin blending mode (alpha, additive, multiplied, subtract, custom) */
export function BeginBlendMode(mode: BlendMode): void {
  lib.BeginBlendMode(mode);
}

/** End blending mode (reset to default: alpha blending) */
export function EndBlendMode(): void {
  lib.EndBlendMode();
}

/** Begin scissor mode (define screen area for following drawing) */
export function BeginScissorMode(
  x: int,
  y: int,
  width: int,
  height: int,
): void {
  lib.BeginScissorMode(x, y, width, height);
}

/** End scissor mode */
export function EndScissorMode(): void {
  lib.EndScissorMode();
}

/** Begin stereo rendering (requires VR simulator) */
export function BeginVrStereoMode(config: VrStereoConfig): void {
  lib.BeginVrStereoMode(config.buffer);
}

/** End stereo rendering (requires VR simulator) */
export function EndVrStereoMode(): void {
  lib.EndVrStereoMode();
}

/** Load VR stereo config for VR simulator device parameters */
export function LoadVrStereoConfig(device: VrDeviceInfo): VrStereoConfig {
  const buf = lib.LoadVrStereoConfig(device.buffer);
  return new VrStereoConfig(buf);
}

/** Unload VR stereo config */
export function UnloadVrStereoConfig(config: VrStereoConfig): void {
  lib.UnloadVrStereoConfig(config.buffer);
}

/** Load shader from files and bind default locations */
export function LoadShader(vShader: string, fShader: string): Shader {
  const vShaderBuf = new TextEncoder().encode(vShader + "\0");
  const fShaderBuf = new TextEncoder().encode(fShader + "\0");
  const buf = lib.LoadShader(vShaderBuf, fShaderBuf);
  return new Shader(buf);
}

/** Load shader from code strings and bind default locations */
export function LoadShaderFromMemory(vShader: string, fShader: string): Shader {
  const vShaderBuf = new TextEncoder().encode(vShader + "\0");
  const fShaderBuf = new TextEncoder().encode(fShader + "\0");
  const buf = lib.LoadShaderFromMemory(vShaderBuf, fShaderBuf);
  return new Shader(buf);
}

/** Check if a shader is valid (loaded on GPU) */
export function IsShaderValid(shader: Shader): boolean {
  return !!lib.IsShaderValid(shader.buffer);
}

/** Get shader uniform location */
export function GetShaderLocation(shader: Shader, name: string): int {
  const nameBuf = new TextEncoder().encode(name + "\0");
  return lib.GetShaderLocation(shader.buffer, nameBuf);
}

/** Get shader attribute location */
export function GetShaderLocationAttrib(shader: Shader, name: string): int {
  const nameBuf = new TextEncoder().encode(name + "\0");
  return lib.GetShaderLocationAttrib(shader.buffer, nameBuf);
}

/** Set shader uniform value */
export function SetShaderValue(
  shader: Shader,
  locIndex: int,
  value: Uint8Array<ArrayBufferLike>,
  uniformType: ShaderUniformDataType,
): void {
  lib.SetShaderValue(
    shader.buffer,
    locIndex,
    Deno.UnsafePointer.of(value as unknown as Uint8Array<ArrayBuffer>),
    uniformType,
  );
}

/** Set shader uniform value vector */
export function SetShaderValueV(
  shader: Shader,
  locIndex: int,
  value: Uint8Array<ArrayBufferLike>,
  uniformType: ShaderUniformDataType,
  count: int,
): void {
  lib.SetShaderValueV(
    shader.buffer,
    locIndex,
    Deno.UnsafePointer.of(value as unknown as Uint8Array<ArrayBuffer>),
    uniformType,
    count,
  );
}

/** Set shader uniform value (matrix 4x4) */
export function SetShaderValueMatrix(
  shader: Shader,
  locIndex: int,
  mat: Matrix,
): void {
  lib.SetShaderValueMatrix(
    shader.buffer,
    locIndex,
    mat.buffer,
  );
}

/** Set shader uniform value and bind the texture (sampler2d) */
export function SetShaderValueTexture(
  shader: Shader,
  locIndex: int,
  texture: Texture2D,
): void {
  lib.SetShaderValueTexture(
    shader.buffer,
    locIndex,
    texture.buffer,
  );
}

/** Unload shader from GPU memory (VRAM) */
export function UnloadShader(shader: Shader): void {
  lib.UnloadShader(shader.buffer);
}

/** Get a ray trace from screen position (i.e mouse) */
export function GetScreenToWorldRay(position: Vector2, camera: Camera): Ray {
  const buf = lib.GetScreenToWorldRay(position.buffer, camera.buffer);
  return Ray.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get a ray trace from screen position (i.e mouse) in a viewport */
export function GetScreenToWorldRayEx(
  position: Vector2,
  camera: Camera,
  width: int,
  height: int,
): Ray {
  const buf = lib.GetScreenToWorldRayEx(
    position.buffer,
    camera.buffer,
    width,
    height,
  );
  return Ray.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get the screen space position for a 3d world space position */
export function GetWorldToScreen(position: Vector3, camera: Camera): Vector2 {
  const buf = lib.GetWorldToScreen(position.buffer, camera.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get size position for a 3d world space position */
export function GetWorldToScreenEx(
  position: Vector3,
  camera: Camera,
  width: int,
  height: int,
): Vector2 {
  const buf = lib.GetWorldToScreenEx(
    position.buffer,
    camera.buffer,
    width,
    height,
  );
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get the screen space position for a 2d camera world space position */
export function GetWorldToScreen2D(
  position: Vector2,
  camera: Camera2D,
): Vector2 {
  const buf = lib.GetWorldToScreen2D(position.buffer, camera.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** GetSCreenToWorld2D exported by Deno Raylib. */
export function GetSCreenToWorld2D(
  position: Vector2,
  camera: Camera2D,
): Vector2 {
  const buf = lib.GetScreenToWorld2D(position.buffer, camera.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get the world space position for a 2d camera screen space position */
export function GetScreenToWorld2D(
  position: Vector2,
  camera: Camera2D,
): Vector2 {
  const buf = lib.GetScreenToWorld2D(position.buffer, camera.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get camera transform matrix (view matrix) */
export function GetCameraMatrix(camera: Camera): Matrix {
  const buf = lib.GetCameraMatrix(camera.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get camera 2d transform matrix */
export function GetCameraMatrix2D(camera: Camera2D): Matrix {
  const buf = lib.GetCameraMatrix2D(camera.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Set target FPS (maximum) */
export function SetTargetFPS(fps: int): void {
  lib.SetTargetFPS(fps);
}

/** Get time in seconds for last frame drawn (delta time) */
export function GetFrameTime(): float {
  return lib.GetFrameTime();
}

/** Get elapsed time in seconds since InitWindow() */
export function GetTime(): float {
  return lib.GetTime();
}

/** Get current FPS */
export function GetFPS(): int {
  return lib.GetFPS();
}

/** Swap back buffer with front buffer (screen drawing) */
export function SwapScreenBuffer(): void {
  lib.SwapScreenBuffer();
}

/** Register all input events */
export function PollInputEvents(): void {
  lib.PollInputEvents();
}

/** Wait for some time (halt program execution) */
export function WaitTime(seconds: float): void {
  lib.WaitTime(seconds);
}

/** Set the seed for the random number generator */
export function SetRandomSeed(seed: int): void {
  lib.SetRandomSeed(seed);
}

/** Get a random value between min and max (both included) */
export function GetRandomValue(min: int, max: int): int {
  return lib.GetRandomValue(min, max);
}

/** Load random values sequence, no values repeated */
export function LoadRandomSequence(
  count: int,
  min: int,
  max: int,
): int[] {
  const ptr = lib.LoadRandomSequence(count, min, max);
  if (ptr === null) return [];

  const view = new Deno.UnsafePointerView(ptr);
  const arr: int[] = [];

  for (let i = 0; i < count; i++) {
    arr.push(view.getInt32(i * 4));
  }

  lib.UnloadRandomSequence(ptr);

  return arr;
}

/** Unload random values sequence */
export function UnloadRandomSequence(
  sequence: Deno.PointerValue,
): void {
  if (sequence !== null) lib.UnloadRandomSequence(sequence);
}

/** Takes a screenshot of current screen (filename extension defines format) */
export function TakeScreenshot(fileName: string): void {
  const fileNameBuf = new TextEncoder().encode(fileName + "\0");
  lib.TakeScreenshot(fileNameBuf);
}

/** Setup init configuration flags (view FLAGS) */
export function SetConfigFlags(flags: ConfigFlags): void {
  lib.SetConfigFlags(flags);
}

/** Open URL with default system browser (if available) */
export function OpenURL(url: string): void {
  const urlBuf = new TextEncoder().encode(url + "\0");
  lib.OpenURL(urlBuf);
}

/** Set the current threshold (minimum) log level */
export function SetTraceLogLevel(logLevel: TraceLogLevel): void {
  lib.SetTraceLogLevel(logLevel);
}

/** Log a literal message. C-style variadic substitutions are not supported. */
export function TraceLog(logLevel: TraceLogLevel, text: string): void {
  lib.TraceLog(logLevel, cstr(text));
}

/** Return a literal through raylib's static text buffer. Variadic substitutions are not supported. */
export function TextFormat(text: string): string {
  return readCString(lib.TextFormat(cstr(text)));
}

/** TraceLogCallbackDef exported by Deno Raylib. */
export type TraceLogCallbackDef = {
  parameters: ["i32", "pointer", "pointer"];
  result: "void";
};

let traceLogCallback: Deno.UnsafeCallback<TraceLogCallbackDef> | undefined;

/** Set custom trace log */
export function SetTraceLogCallback(
  callback:
    | ((logLevel: int, text: string, args: Deno.PointerValue) => void)
    | null,
): Deno.UnsafeCallback<TraceLogCallbackDef> | undefined {
  const previous = traceLogCallback;

  if (callback === null) {
    lib.SetTraceLogCallback(null);
    traceLogCallback = undefined;
    previous?.close();
    return undefined;
  }

  const cb = new Deno.UnsafeCallback<TraceLogCallbackDef>(
    { parameters: ["i32", "pointer", "pointer"], result: "void" },
    (logLevel, text, args) => {
      callback(logLevel as int, readCString(text), args);
    },
  );

  traceLogCallback = cb;
  lib.SetTraceLogCallback(cb.pointer);
  previous?.close();
  return cb;
}

/** Internal memory allocator */
export function MemAlloc(size: int): Deno.PointerValue {
  return lib.MemAlloc(size);
}

/** Internal memory reallocator */
export function MemRealloc(
  ptr: Deno.PointerValue,
  size: int,
): Deno.PointerValue {
  return lib.MemRealloc(ptr, size);
}

/** Internal memory free */
export function MemFree(ptr: Deno.PointerValue): void {
  if (ptr !== null) lib.MemFree(ptr);
}

/** Load file data as byte array (read) */
export function LoadFileData(fileName: string): Uint8Array {
  const size = new Int32Array(1);
  const ptr = lib.LoadFileData(cstr(fileName), Deno.UnsafePointer.of(size));
  if (ptr === null) return new Uint8Array();
  const data = copyPointerBytes(ptr, size[0]);
  lib.UnloadFileData(ptr);
  return data;
}

/** Unload file data allocated by LoadFileData() */
export function UnloadFileData(data: Deno.PointerValue): void {
  if (data !== null) lib.UnloadFileData(data);
}

/** Save data to file from byte array (write), returns true on success */
export function SaveFileData(fileName: string, data: Uint8Array): boolean {
  return !!lib.SaveFileData(
    cstr(fileName),
    Deno.UnsafePointer.of(data),
    data.byteLength,
  );
}

/** Export data to code (.h), returns true on success */
export function ExportDataAsCode(
  data: Uint8Array<ArrayBuffer>,
  fileName: string,
): boolean {
  return !!lib.ExportDataAsCode(data, data.byteLength, cstr(fileName));
}

/** Load text data from file (read), returns a '\0' terminated string */
export function LoadFileText(fileName: string): string {
  const ptr = lib.LoadFileText(cstr(fileName));
  if (ptr === null) return "";
  const text = readCString(ptr);
  lib.UnloadFileText(ptr);
  return text;
}

/** Unload file text data allocated by LoadFileText() */
export function UnloadFileText(text: Deno.PointerValue): void {
  if (text !== null) lib.UnloadFileText(text);
}

/** Save text data to file (write), string must be '\0' terminated, returns true on success */
export function SaveFileText(fileName: string, text: string): boolean {
  return !!lib.SaveFileText(cstr(fileName), cstr(text));
}

/** Set custom file binary data loader */
export function SetLoadFileDataCallback(callback: Deno.PointerValue): void {
  lib.SetLoadFileDataCallback(callback);
}

/** Set custom file binary data saver */
export function SetSaveFileDataCallback(callback: Deno.PointerValue): void {
  lib.SetSaveFileDataCallback(callback);
}

/** Set custom file text data loader */
export function SetLoadFileTextCallback(callback: Deno.PointerValue): void {
  lib.SetLoadFileTextCallback(callback);
}

/** Set custom file text data saver */
export function SetSaveFileTextCallback(callback: Deno.PointerValue): void {
  lib.SetSaveFileTextCallback(callback);
}

/** Rename file (if exists) */
export function FileRename(fileName: string, fileRename: string): int {
  return lib.FileRename(cstr(fileName), cstr(fileRename));
}

/** Remove file (if exists) */
export function FileRemove(fileName: string): int {
  return lib.FileRemove(cstr(fileName));
}

/** Copy file from one path to another, dstPath created if it doesn't exist */
export function FileCopy(srcPath: string, dstPath: string): int {
  return lib.FileCopy(cstr(srcPath), cstr(dstPath));
}

/** Move file from one directory to another, dstPath created if it doesn't exist */
export function FileMove(srcPath: string, dstPath: string): int {
  return lib.FileMove(cstr(srcPath), cstr(dstPath));
}

/** Replace text in an existing file */
export function FileTextReplace(
  fileName: string,
  search: string,
  replacement: string,
): int {
  return lib.FileTextReplace(cstr(fileName), cstr(search), cstr(replacement));
}

/** Find text in existing file */
export function FileTextFindIndex(fileName: string, search: string): int {
  return lib.FileTextFindIndex(cstr(fileName), cstr(search));
}

/** Check if file exists */
export function FileExists(fileName: string): boolean {
  return !!lib.FileExists(cstr(fileName));
}

/** Check if a directory path exists */
export function DirectoryExists(dirPath: string): boolean {
  return !!lib.DirectoryExists(cstr(dirPath));
}

/** Check file extension (recommended include point: .png, .wav) */
export function IsFileExtension(fileName: string, ext: string): boolean {
  return !!lib.IsFileExtension(cstr(fileName), cstr(ext));
}

/** Get file length in bytes (NOTE: GetFileSize() conflicts with windows.h) */
export function GetFileLength(fileName: string): int {
  return lib.GetFileLength(cstr(fileName));
}

/** Get file modification time (last write time) */
export function GetFileModTime(fileName: string): number {
  return Number(lib.GetFileModTime(cstr(fileName)));
}

/** Get pointer to extension for a filename string (includes dot: '.png') */
export function GetFileExtension(fileName: string): string {
  return readCString(lib.GetFileExtension(cstr(fileName)));
}

/** Get pointer to filename for a path string */
export function GetFileName(filePath: string): string {
  return readCString(lib.GetFileName(cstr(filePath)));
}

/** Get filename string without extension (uses static string) */
export function GetFileNameWithoutExt(filePath: string): string {
  return readCString(lib.GetFileNameWithoutExt(cstr(filePath)));
}

/** Get full path for a given fileName with path (uses static string) */
export function GetDirectoryPath(filePath: string): string {
  return readCString(lib.GetDirectoryPath(cstr(filePath)));
}

/** Get previous directory path for a given path (uses static string) */
export function GetPrevDirectoryPath(dirPath: string): string {
  return readCString(lib.GetPrevDirectoryPath(cstr(dirPath)));
}

/** Get current working directory (uses static string) */
export function GetWorkingDirectory(): string {
  return readCString(lib.GetWorkingDirectory());
}

/** Get the directory of the running application (uses static string) */
export function GetApplicationDirectory(): string {
  return readCString(lib.GetApplicationDirectory());
}

/** Create directories (including full path requested), returns 0 on success */
export function MakeDirectory(dirPath: string): int {
  return lib.MakeDirectory(cstr(dirPath));
}

/** Change working directory, return true on success */
export function ChangeDirectory(dirPath: string): boolean {
  return !!lib.ChangeDirectory(cstr(dirPath));
}

/** Check if a given path is a file or a directory */
export function IsPathFile(path: string): boolean {
  return !!lib.IsPathFile(cstr(path));
}

/** Check if fileName is valid for the platform/OS */
export function IsFileNameValid(fileName: string): boolean {
  return !!lib.IsFileNameValid(cstr(fileName));
}

/** Load directory filepaths, files and directories, no subdirs scan */
export function LoadDirectoryFiles(dirPath: string): FilePathList {
  return new FilePathList(lib.LoadDirectoryFiles(cstr(dirPath)));
}

/** Load directory filepaths with extension filtering and subdir scan; some filters available: "*.*", "FILES*", "DIRS*" */
export function LoadDirectoryFilesEx(
  basePath: string,
  filter: string,
  scanSubdirs: boolean,
): FilePathList {
  return new FilePathList(
    lib.LoadDirectoryFilesEx(cstr(basePath), cstr(filter), scanSubdirs ? 1 : 0),
  );
}

/** Unload filepaths */
export function UnloadDirectoryFiles(files: FilePathList): void {
  lib.UnloadDirectoryFiles(files.buffer);
}

/** Get the file count in a directory */
export function GetDirectoryFileCount(dirPath: string): number {
  return lib.GetDirectoryFileCount(cstr(dirPath));
}

/** Get the file count in a directory with extension filtering and recursive directory scan. Use 'DIR' in the filter string to include directories in the result */
export function GetDirectoryFileCountEx(
  basePath: string,
  filter: string,
  scanSubdirs: boolean,
): number {
  return lib.GetDirectoryFileCountEx(
    cstr(basePath),
    cstr(filter),
    scanSubdirs ? 1 : 0,
  );
}

/** Compress data (DEFLATE algorithm), memory must be MemFree() */
export function CompressData(data: Uint8Array<ArrayBuffer>): Uint8Array {
  const size = new Int32Array(1);
  const ptr = lib.CompressData(
    data,
    data.byteLength,
    Deno.UnsafePointer.of(size.buffer),
  );
  return copyAndFreeBytes(ptr, size[0]);
}

/** Decompress data (DEFLATE algorithm), memory must be MemFree() */
export function DecompressData(compData: Uint8Array<ArrayBuffer>): Uint8Array {
  const size = new Int32Array(1);
  const ptr = lib.DecompressData(
    compData,
    compData.byteLength,
    Deno.UnsafePointer.of(size.buffer),
  );
  return copyAndFreeBytes(ptr, size[0]);
}

/** Encode data to Base64 string (includes NULL terminator), memory must be MemFree() */
export function EncodeDataBase64(data: Uint8Array<ArrayBuffer>): string {
  const size = new Int32Array(1);
  const ptr = lib.EncodeDataBase64(
    data,
    data.byteLength,
    Deno.UnsafePointer.of(size.buffer),
  );
  return copyAndFreeCString(ptr);
}

/** Decode Base64 string (expected NULL terminated), memory must be MemFree() */
export function DecodeDataBase64(text: string): Uint8Array {
  const size = new Int32Array(1);
  const ptr = lib.DecodeDataBase64(
    cstr(text),
    Deno.UnsafePointer.of(size.buffer),
  );
  return copyAndFreeBytes(ptr, size[0]);
}

/** Compute CRC32 hash code */
export function ComputeCRC32(data: Uint8Array<ArrayBuffer>): number {
  return lib.ComputeCRC32(data, data.byteLength);
}

/** Compute MD5 hash code, returns static int[4] (16 bytes) */
export function ComputeMD5(data: Uint8Array<ArrayBuffer>): Uint8Array {
  return copyPointerBytes(lib.ComputeMD5(data, data.byteLength), 16);
}

/** Compute SHA1 hash code, returns static int[5] (20 bytes) */
export function ComputeSHA1(data: Uint8Array<ArrayBuffer>): Uint8Array {
  return copyPointerBytes(lib.ComputeSHA1(data, data.byteLength), 20);
}

/** Compute SHA256 hash code, returns static int[8] (32 bytes) */
export function ComputeSHA256(data: Uint8Array<ArrayBuffer>): Uint8Array {
  return copyPointerBytes(lib.ComputeSHA256(data, data.byteLength), 32);
}

/** isFileDropped exported by Deno Raylib. */
export function isFileDropped(): boolean {
  return !!lib.IsFileDropped();
}

/** Check if a file has been dropped into window */
export function IsFileDropped(): boolean {
  return !!lib.IsFileDropped();
}

/** Load dropped filepaths */
export function LoadDroppedFiles(): string[] {
  const result = lib.LoadDroppedFiles();

  const view = new DataView(result.buffer);
  const length = view.getUint32(4, littleEndian);
  const pointer = Deno.UnsafePointer.create(
    view.getBigInt64(8, littleEndian),
  );

  const pointerView = new Deno.UnsafePointerView(pointer!);

  const list: string[] = [];
  for (let i = 0; i < length; i++) {
    const stringPointer = pointerView.getPointer(i * 8);
    const stringView = new Deno.UnsafePointerView(stringPointer!);
    list.push(stringView.getCString());
  }

  lib.UnloadDroppedFiles(result);

  return list;
}

/** Unload dropped filepaths */
export function UnloadDroppedFiles(files: FilePathList): void {
  lib.UnloadDroppedFiles(files.buffer);
}

/** Load automation events list from file, NULL for empty list, capacity = MAX_AUTOMATION_EVENTS */
export function LoadAutomationEventList(file: string): AutomationEventList {
  return new AutomationEventList(
    lib.LoadAutomationEventList(new TextEncoder().encode(file + "\0")),
  );
}

/** Unload automation events list from file */
export function UnloadAutomationEventList(
  eventList: AutomationEventList,
): void {
  lib.UnloadAutomationEventList(eventList.buffer);
}

/** Export automation events list as text file */
export function ExportAutomationEventList(
  eventList: AutomationEventList,
  file: string,
): void {
  lib.ExportAutomationEventList(
    eventList.buffer,
    new TextEncoder().encode(file + "\0"),
  );
}

/** Set automation event list to record to */
export function SetAutomationEventList(eventList: AutomationEventList): void {
  lib.SetAutomationEventList(eventList.buffer);
}

/** Set automation event internal base frame to start recording */
export function SetAutomationEventBaseFrame(frame: int): void {
  lib.SetAutomationEventBaseFrame(frame);
}

/** Start recording automation events (AutomationEventList must be set) */
export function StartAutomationEventRecording(): void {
  lib.StartAutomationEventRecording();
}

/** Stop recording automation events */
export function StopAutomationEventRecording(): void {
  lib.StopAutomationEventRecording();
}

/** Play a recorded automation event */
export function PlayAutomationEvent(event: AutomationEvent): void {
  lib.PlayAutomationEvent(event.buffer);
}

/** Check if a key has been pressed once */
export function IsKeyPressed(key: KeyboardKey): boolean {
  return !!lib.IsKeyPressed(key);
}

/** Check if a key has been pressed again */
export function IsKeyPressedRepeat(key: KeyboardKey): boolean {
  return !!lib.IsKeyPressedRepeat(key);
}

/** Check if a key is being pressed */
export function IsKeyDown(key: KeyboardKey): boolean {
  return !!lib.IsKeyDown(key);
}

/** Check if a key has been released once */
export function IsKeyReleased(key: KeyboardKey): boolean {
  return !!lib.IsKeyReleased(key);
}

/** Check if a key is NOT being pressed */
export function IsKeyUp(key: KeyboardKey): boolean {
  return !!lib.IsKeyUp(key);
}

/** Get key pressed (keycode), call it multiple times for keys queued, returns 0 when the queue is empty */
export function GetKeyPressed(): KeyboardKey {
  return lib.GetKeyPressed();
}

/** Get char pressed (unicode), call it multiple times for chars queued, returns 0 when the queue is empty */
export function GetCharPressed(): string {
  const char = lib.GetCharPressed(); // returns a number
  return String.fromCharCode(char);
}

/** Get name of a QWERTY key on the current keyboard layout (eg returns string 'q' for KEY_A on an AZERTY keyboard) */
export function GetKeyName(key: KeyboardKey): string {
  return readCString(lib.GetKeyName(key));
}

/** Set a custom key to exit program (default is ESC) */
export function SetExitKey(key: KeyboardKey): void {
  lib.SetExitKey(key);
}

/** Check if a gamepad is available */
export function IsGamepadAvailable(gamepad: int): boolean {
  return !!lib.IsGamepadAvailable(gamepad);
}

/** Get gamepad internal name id */
export function GetGamepadName(gamepad: int): string {
  const ptr = lib.GetGamepadName(gamepad);
  if (!ptr) return "";
  const view = new Deno.UnsafePointerView(ptr);
  return view.getCString();
}

/** Check if a gamepad button has been pressed once */
export function IsGamepadButtonPressed(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonPressed(gamepad, button);
}

/** Check if a gamepad button has been released once */
export function IsGamepadButtonReleased(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonReleased(gamepad, button);
}

/** Check if a gamepad button is NOT being pressed */
export function IsGamepadButtonUp(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonUp(gamepad, button);
}

/** Check if a gamepad button is being pressed */
export function IsGamepadButtonDown(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonDown(gamepad, button);
}

/** Get the last gamepad button pressed */
export function GetGamepadButtonPressed(): GamepadButton {
  return lib.GetGamepadButtonPressed();
}

/** Get axis count for a gamepad */
export function GetGamepadAxisCount(gamepad: int): int {
  return lib.GetGamepadAxisCount(gamepad);
}

/** Get movement value for a gamepad axis */
export function GetGamepadAxisMovement(gamepad: int, axis: GamepadAxis): float {
  return lib.GetGamepadAxisMovement(gamepad, axis);
}

/** Set internal gamepad mappings (SDL_GameControllerDB) */
export function SetGamepadMappings(mappings: string): void {
  lib.SetGamepadMappings(new TextEncoder().encode(mappings + "\0"));
}

/** Set gamepad vibration for both motors (duration in seconds) */
export function SetGamepadVibration(
  gamepad: int,
  leftVibration: float,
  rightVibration: float,
  duration: int,
): void {
  lib.SetGamepadVibration(gamepad, leftVibration, rightVibration, duration);
}

/** Check if a mouse button has been pressed once */
export function IsMouseButtonPressed(button: MouseButton): boolean {
  return !!lib.IsMouseButtonPressed(button);
}

/** Check if a mouse button is being pressed */
export function IsMouseButtonDown(button: MouseButton): boolean {
  return !!lib.IsMouseButtonDown(button);
}

/** Check if a mouse button has been released once */
export function IsMouseButtonReleased(button: MouseButton): boolean {
  return !!lib.IsMouseButtonReleased(button);
}

/** Check if a mouse button is NOT being pressed */
export function IsMouseButtonUp(button: MouseButton): boolean {
  return !!lib.IsMouseButtonUp(button);
}

/** Get mouse position X */
export function GetMouseX(): int {
  return lib.GetMouseX();
}

/** Get mouse position Y */
export function GetMouseY(): int {
  return lib.GetMouseY();
}

/** Get mouse position XY */
export function GetMousePosition(): Vector2 {
  const buffer = lib.GetMousePosition();
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

/** Get mouse delta between frames */
export function GetMouseDelta(): Vector2 {
  const buffer = lib.GetMouseDelta();
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

/** Set mouse position XY */
export function SetMousePosition(x: int, y: int): void {
  lib.SetMousePosition(x, y);
}

/** Set mouse offset */
export function SetMouseOffset(offsetX: int, offsetY: int): void {
  lib.SetMouseOffset(offsetX, offsetY);
}

/** Set mouse scaling */
export function SetMouseScale(scaleX: float, scaleY: float): void {
  lib.SetMouseScale(scaleX, scaleY);
}

/** Get mouse wheel movement for X or Y, whichever is larger */
export function GetMouseWheelMove(): float {
  return lib.GetMouseWheelMove();
}

/** Get mouse wheel movement for both X and Y */
export function GetMouseWheelMoveV(): Vector2 {
  const buffer = lib.GetMouseWheelMoveV();
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

/** Set mouse cursor */
export function SetMouseCursor(cursor: MouseCursor): void {
  lib.SetMouseCursor(cursor);
}

/** Get touch position X for touch point 0 (relative to screen size) */
export function GetTouchX(): int {
  return lib.GetTouchX();
}

/** Get touch position Y for touch point 0 (relative to screen size) */
export function GetTouchY(): int {
  return lib.GetTouchY();
}

/** Get touch position XY for a touch point index (relative to screen size) */
export function GetTouchPosition(index: int): Vector2 {
  const buffer = lib.GetTouchPosition(index);
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

/** Get touch point identifier for given index */
export function GetTouchPointId(index: int): int {
  return lib.GetTouchPointId(index);
}

/** Get number of touch points */
export function GetTouchPointCount(): int {
  return lib.GetTouchPointCount();
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

/** Update camera position for selected mode */
export function UpdateCamera(camera: Camera, mode: CameraMode): void {
  lib.UpdateCamera(camera.buffer, mode);
}

/** Update camera movement/rotation */
export function UpdateCameraPro(
  camera: Camera,
  movement: Vector3,
  rotation: Vector3,
  zoom: float,
): void {
  lib.UpdateCameraPro(
    camera.buffer,
    movement.buffer,
    rotation.buffer,
    zoom,
  );
}

/** Set texture and rectangle to be used on shapes drawing */
export function SetShapesTexture(texture: Texture2D, source: Rectangle): void {
  lib.SetShapesTexture(texture.buffer, source.buffer);
}

/** Get texture that is used for shapes drawing */
export function GetShapesTexture(): Texture2D {
  const buffer = lib.GetShapesTexture();
  return new Texture2D(buffer);
}

/** Get texture source rectangle that is used for shapes drawing */
export function GetShapesTextureRectangle(): Rectangle {
  const buffer = lib.GetShapesTextureRectangle();
  return Rectangle.fromBuffer(buffer.buffer, buffer.byteOffset);
}

/** Draw a pixel using geometry [Can be slow, use with care] */
export function DrawPixel(posX: int, posY: int, color: Color): void {
  lib.DrawPixel(posX, posY, color.buffer);
}

/** Draw a pixel using geometry (Vector version) [Can be slow, use with care] */
export function DrawPixelV(position: Vector2, color: Color): void {
  lib.DrawPixelV(position.buffer, color.buffer);
}

/** Draw a line */
export function DrawLine(
  posX: int,
  posY: int,
  endX: int,
  endY: int,
  color: Color,
): void {
  lib.DrawLine(posX, posY, endX, endY, color.buffer);
}

/** Draw a line (using gl lines) */
export function DrawLineV(
  startPos: Vector2,
  endPos: Vector2,
  color: Color,
): void {
  lib.DrawLineV(startPos.buffer, endPos.buffer, color.buffer);
}

/** Draw a line (using triangles/quads) */
export function DrawLineEx(
  startPos: Vector2,
  endPos: Vector2,
  thickness: float,
  color: Color,
): void {
  lib.DrawLineEx(startPos.buffer, endPos.buffer, thickness, color.buffer);
}

/** Draw lines sequence (using gl lines) */
export function DrawLineStrip(points: Vector2[], color: Color): void {
  const line_strip_buffer = concatVector2(points);
  lib.DrawLineStrip(
    line_strip_buffer as BufferSource,
    points.length,
    color.buffer,
  );
}

/** Draw line segment cubic-bezier in-out interpolation */
export function DrawLineBezier(
  startPos: Vector2,
  endPos: Vector2,
  thickness: float,
  color: Color,
): void {
  lib.DrawLineBezier(startPos.buffer, endPos.buffer, thickness, color.buffer);
}

/** Draw a dashed line */
export function DrawLineDashed(
  startPos: Vector2,
  endPos: Vector2,
  segments: int,
  spacing: int,
  color: Color,
): void {
  lib.DrawLineDashed(
    startPos.buffer,
    endPos.buffer,
    segments,
    spacing,
    color.buffer,
  );
}

/** Draw a color-filled circle */
export function DrawCircle(
  posX: int,
  posY: int,
  radius: int,
  color: Color,
): void {
  lib.DrawCircle(posX, posY, radius, color.buffer);
}

/** Draw a piece of a circle */
export function DrawCircleSector(
  center: Vector2,
  radius: int,
  startAngle: float,
  endAngle: float,
  segments: int,
  color: Color,
): void {
  lib.DrawCircleSector(
    center.buffer,
    radius,
    startAngle,
    endAngle,
    segments,
    color.buffer,
  );
}

/** Draw circle sector outline */
export function DrawCircleSectorLines(
  center: Vector2,
  radius: int,
  startAngle: float,
  endAngle: float,
  segments: int,
  color: Color,
): void {
  lib.DrawCircleSectorLines(
    center.buffer,
    radius,
    startAngle,
    endAngle,
    segments,
    color.buffer,
  );
}

/** Draw a gradient-filled circle */
export function DrawCircleGradient(
  centerX: int,
  centerY: int,
  radius: int,
  startColor: Color,
  endColor: Color,
): void {
  lib.DrawCircleGradient(
    new Vector2(centerX, centerY).buffer,
    radius,
    startColor.buffer,
    endColor.buffer,
  );
}

/** Draw a color-filled circle (Vector version) */
export function DrawCircleV(center: Vector2, radius: int, color: Color): void {
  lib.DrawCircleV(center.buffer, radius, color.buffer);
}

/** Draw circle outline */
export function DrawCircleLines(
  centerX: int,
  centerY: int,
  radius: int,
  color: Color,
): void {
  lib.DrawCircleLines(centerX, centerY, radius, color.buffer);
}

/** Draw circle outline (Vector version) */
export function DrawCircleLinesV(
  center: Vector2,
  radius: int,
  color: Color,
): void {
  lib.DrawCircleLinesV(center.buffer, radius, color.buffer);
}

/** Draw ellipse */
export function DrawEllipse(
  centerX: int,
  centerY: int,
  radiusX: int,
  radiusY: int,
  color: Color,
): void {
  lib.DrawEllipse(centerX, centerY, radiusX, radiusY, color.buffer);
}

/** Draw ellipse (Vector version) */
export function DrawEllipseV(
  center: Vector2,
  radiusX: float,
  radiusY: float,
  color: Color,
): void {
  lib.DrawEllipseV(center.buffer, radiusX, radiusY, color.buffer);
}

/** Draw ellipse outline */
export function DrawEllipseLines(
  centerX: int,
  centerY: int,
  radiusX: int,
  radiusY: int,
  color: Color,
): void {
  lib.DrawEllipseLines(centerX, centerY, radiusX, radiusY, color.buffer);
}

/** Draw ellipse outline (Vector version) */
export function DrawEllipseLinesV(
  center: Vector2,
  radiusX: float,
  radiusY: float,
  color: Color,
): void {
  lib.DrawEllipseLinesV(center.buffer, radiusX, radiusY, color.buffer);
}

/** Draw ring */
export function DrawRing(
  center: Vector2,
  innerRadius: int,
  outerRadius: int,
  startAngle: float,
  endAngle: float,
  segments: int,
  color: Color,
): void {
  lib.DrawRing(
    center.buffer,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    segments,
    color.buffer,
  );
}

/** Draw ring outline */
export function DrawRingLines(
  center: Vector2,
  innerRadius: int,
  outerRadius: int,
  startAngle: float,
  endAngle: float,
  segments: int,
  color: Color,
): void {
  lib.DrawRingLines(
    center.buffer,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    segments,
    color.buffer,
  );
}

/** Draw a color-filled rectangle */
export function DrawRectangle(
  posX: int,
  posY: int,
  width: int,
  height: int,
  color: Color,
): void {
  lib.DrawRectangle(posX, posY, width, height, color.buffer);
}

/** Draw a color-filled rectangle (Vector version) */
export function DrawRectangleV(
  position: Vector2,
  size: Vector2,
  color: Color,
): void {
  lib.DrawRectangleV(position.buffer, size.buffer, color.buffer);
}

/** Draw a color-filled rectangle */
export function DrawRectangleRec(
  rec: Rectangle,
  color: Color,
): void {
  lib.DrawRectangleRec(rec.buffer, color.buffer);
}

/** Draw a color-filled rectangle with pro parameters */
export function DrawRectanglePro(
  rec: Rectangle,
  origin: Vector2,
  rotation: float,
  color: Color,
): void {
  lib.DrawRectanglePro(rec.buffer, origin.buffer, rotation, color.buffer);
}

/** Draw a vertical-gradient-filled rectangle */
export function DrawRectangleGradientV(
  posX: int,
  posY: int,
  width: int,
  height: int,
  color1: Color,
  color2: Color,
): void {
  lib.DrawRectangleGradientV(
    posX,
    posY,
    width,
    height,
    color1.buffer,
    color2.buffer,
  );
}

/** Draw a horizontal-gradient-filled rectangle */
export function DrawRectangleGradientH(
  posX: int,
  posY: int,
  width: int,
  height: int,
  color1: Color,
  color2: Color,
): void {
  lib.DrawRectangleGradientH(
    posX,
    posY,
    width,
    height,
    color1.buffer,
    color2.buffer,
  );
}

/** Draw a gradient-filled rectangle with custom vertex colors */
export function DrawRectangleGradientEx(
  rec: Rectangle,
  col1: Color,
  col2: Color,
  col3: Color,
  col4: Color,
): void {
  lib.DrawRectangleGradientEx(
    rec.buffer,
    col1.buffer,
    col2.buffer,
    col3.buffer,
    col4.buffer,
  );
}

/** Draw rectangle outline */
export function DrawRectangleLines(
  posX: int,
  posY: int,
  width: int,
  height: int,
  color: Color,
): void {
  lib.DrawRectangleLines(posX, posY, width, height, color.buffer);
}

/** Draw rectangle outline with extended parameters */
export function DrawRectangleLinesEx(
  rec: Rectangle,
  lineThick: int,
  color: Color,
): void {
  lib.DrawRectangleLinesEx(rec.buffer, lineThick, color.buffer);
}

/** Draw rectangle with rounded edges */
export function DrawRectangleRounded(
  rec: Rectangle,
  radius: float,
  segments: int,
  color: Color,
): void {
  lib.DrawRectangleRounded(rec.buffer, radius, segments, color.buffer);
}

/** Draw rectangle lines with rounded edges */
export function DrawRectangleRoundedLines(
  rec: Rectangle,
  radius: float,
  segments: int,
  color: Color,
): void {
  lib.DrawRectangleRoundedLines(rec.buffer, radius, segments, color.buffer);
}

/** Draw rectangle with rounded edges outline */
export function DrawRectangleRoundedLinesEx(
  rec: Rectangle,
  radius: float,
  segments: int,
  lineThick: int,
  color: Color,
): void {
  lib.DrawRectangleRoundedLinesEx(
    rec.buffer,
    radius,
    segments,
    lineThick,
    color.buffer,
  );
}

/** Draw a color-filled triangle (vertex in counter-clockwise order!) */
export function DrawTriangle(
  v1: Vector2,
  v2: Vector2,
  v3: Vector2,
  color: Color,
): void {
  const cross = (v2.x - v1.x) * (v3.y - v1.y) -
    (v2.y - v1.y) * (v3.x - v1.x);

  if (cross > 0) {
    lib.DrawTriangle(v1.buffer, v3.buffer, v2.buffer, color.buffer);
  } else {
    lib.DrawTriangle(v1.buffer, v2.buffer, v3.buffer, color.buffer);
  }
}

/** Draw triangle outline (vertex in counter-clockwise order!) */
export function DrawTriangleLines(
  v1: Vector2,
  v2: Vector2,
  v3: Vector2,
  color: Color,
): void {
  const cross = (v2.x - v1.x) * (v3.y - v1.y) -
    (v2.y - v1.y) * (v3.x - v1.x);

  if (cross > 0) {
    lib.DrawTriangleLines(v1.buffer, v3.buffer, v2.buffer, color.buffer);
  } else {
    lib.DrawTriangleLines(v1.buffer, v2.buffer, v3.buffer, color.buffer);
  }
}

/** Draw a triangle fan defined by points (first vertex is the center) */
export function DrawTriangleFan(
  points: Vector2[],
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = points_buffer;
  lib.DrawTriangleFan(points_ptr, points.length, color.buffer);
}

/** Draw a triangle strip defined by points */
export function DrawTriangleStrip(
  points: Vector2[],
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = points_buffer;
  lib.DrawTriangleStrip(points_ptr, points.length, color.buffer);
}

/** Draw a regular polygon (Vector version) */
export function DrawPoly(
  center: Vector2,
  sides: int,
  radius: float,
  rotation: float,
  color: Color,
): void {
  lib.DrawPoly(center.buffer, sides, radius, rotation, color.buffer);
}

/** Draw a polygon outline of n sides */
export function DrawPolyLines(
  center: Vector2,
  sides: int,
  radius: float,
  rotation: float,
  color: Color,
): void {
  lib.DrawPolyLines(center.buffer, sides, radius, rotation, color.buffer);
}

/** Draw a polygon outline of n sides with extended parameters */
export function DrawPolyLinesEx(
  center: Vector2,
  sides: int,
  radius: float,
  rotation: float,
  lineThick: int,
  color: Color,
): void {
  lib.DrawPolyLinesEx(
    center.buffer,
    sides,
    radius,
    rotation,
    lineThick,
    color.buffer,
  );
}

/** Draw spline: Linear, minimum 2 points */
export function DrawSplineLinear(
  points: Vector2[],
  thickness: int,
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = points_buffer;
  lib.DrawSplineLinear(points_ptr, points.length, thickness, color.buffer);
}

/** Draw spline: B-Spline, minimum 4 points */
export function DrawSplineBasis(
  points: Vector2[],
  thickness: int,
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = points_buffer;
  lib.DrawSplineBasis(points_ptr, points.length, thickness, color.buffer);
}

/** Draw spline: Catmull-Rom, minimum 4 points */
export function DrawSplineCatmullRom(
  points: Vector2[],
  thickness: int,
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = points_buffer;
  lib.DrawSplineCatmullRom(points_ptr, points.length, thickness, color.buffer);
}

/** Draw spline: Quadratic Bezier, minimum 3 points (1 control point): [p1, c2, p3, c4...] */
export function DrawSplineBezierQuadratic(
  points: Vector2[],
  thickness: int,
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = points_buffer;
  lib.DrawSplineBezierQuadratic(
    points_ptr,
    points.length,
    thickness,
    color.buffer,
  );
}

/** Draw spline: Cubic Bezier, minimum 4 points (2 control points): [p1, c2, c3, p4, c5, c6...] */
export function DrawSplineBezierCubic(
  points: Vector2[],
  thickness: int,
  color: Color,
): void {
  const points_buffer = new Float32Array(points.length * 2);
  for (let i = 0; i < points.length; i++) {
    points_buffer[i * 2] = points[i].x;
    points_buffer[i * 2 + 1] = points[i].y;
  }
  const points_ptr = points_buffer;
  lib.DrawSplineBezierCubic(points_ptr, points.length, thickness, color.buffer);
}

/** Draw spline segment: Linear, 2 points */
export function DrawSplineSegmentLinear(
  pos1: Vector2,
  pos2: Vector2,
  thickness: int,
  color: Color,
): void {
  lib.DrawSplineSegmentLinear(
    pos1.buffer,
    pos2.buffer,
    thickness,
    color.buffer,
  );
}

/** Draw spline segment: B-Spline, 4 points */
export function DrawSplineSegmentBasis(
  pos1: Vector2,
  pos2: Vector2,
  pos3: Vector2,
  pos4: Vector2,
  thickness: int,
  color: Color,
): void {
  lib.DrawSplineSegmentBasis(
    pos1.buffer,
    pos2.buffer,
    pos3.buffer,
    pos4.buffer,
    thickness,
    color.buffer,
  );
}

/** Draw spline segment: Catmull-Rom, 4 points */
export function DrawSplineSegmentCatmullRom(
  pos1: Vector2,
  pos2: Vector2,
  pos3: Vector2,
  pos4: Vector2,
  thickness: int,
  color: Color,
): void {
  lib.DrawSplineSegmentCatmullRom(
    pos1.buffer,
    pos2.buffer,
    pos3.buffer,
    pos4.buffer,
    thickness,
    color.buffer,
  );
}

/** Draw spline segment: Quadratic Bezier, 2 points, 1 control point */
export function DrawSplineSegmentBezierQuadratic(
  pos1: Vector2,
  pos2: Vector2,
  pos3: Vector2,
  thickness: int,
  color: Color,
): void {
  lib.DrawSplineSegmentBezierQuadratic(
    pos1.buffer,
    pos2.buffer,
    pos3.buffer,
    thickness,
    color.buffer,
  );
}

/** Draw spline segment: Cubic Bezier, 2 points, 2 control points */
export function DrawSplineSegmentBezierCubic(
  pos1: Vector2,
  pos2: Vector2,
  pos3: Vector2,
  pos4: Vector2,
  thickness: int,
  color: Color,
): void {
  lib.DrawSplineSegmentBezierCubic(
    pos1.buffer,
    pos2.buffer,
    pos3.buffer,
    pos4.buffer,
    thickness,
    color.buffer,
  );
}

/** Get (evaluate) spline point: Linear */
export function GetSplinePointLinear(
  startPos: Vector2,
  endPos: Vector2,
  t: float,
): Vector2 {
  const buf = lib.GetSplinePointLinear(
    startPos.buffer,
    endPos.buffer,
    t,
  );
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  return new Vector2(x, y);
}

/** Get (evaluate) spline point: B-Spline */
export function GetSplinePointBasis(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  p4: Vector2,
  t: float,
): Vector2 {
  const buf = lib.GetSplinePointBasis(
    p1.buffer,
    p2.buffer,
    p3.buffer,
    p4.buffer,
    t,
  );
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  return new Vector2(x, y);
}

/** Get (evaluate) spline point: Catmull-Rom */
export function GetSplinePointCatmullRom(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  p4: Vector2,
  t: float,
): Vector2 {
  const buf = lib.GetSplinePointCatmullRom(
    p1.buffer,
    p2.buffer,
    p3.buffer,
    p4.buffer,
    t,
  );
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  return new Vector2(x, y);
}

/** Get (evaluate) spline point: Quadratic Bezier */
export function GetSplinePointBezierQuad(
  p1: Vector2,
  c2: Vector2,
  p3: Vector2,
  t: float,
): Vector2 {
  const buf = lib.GetSplinePointBezierQuad(
    p1.buffer,
    c2.buffer,
    p3.buffer,
    t,
  );
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  return new Vector2(x, y);
}

/** Get (evaluate) spline point: Cubic Bezier */
export function GetSplinePointBezierCubic(
  p1: Vector2,
  c2: Vector2,
  c3: Vector2,
  p4: Vector2,
  t: float,
): Vector2 {
  const buf = lib.GetSplinePointBezierCubic(
    p1.buffer,
    c2.buffer,
    c3.buffer,
    p4.buffer,
    t,
  );
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  return new Vector2(x, y);
}

/** Check collision between two rectangles */
export function CheckCollisionRecs(rec1: Rectangle, rec2: Rectangle): boolean {
  return !!lib.CheckCollisionRecs(rec1.buffer, rec2.buffer);
}

/** Check collision between two circles */
export function CheckCollisionCircles(
  center1: Vector2,
  radius1: float,
  center2: Vector2,
  radius2: float,
): boolean {
  return !!lib.CheckCollisionCircles(
    center1.buffer,
    radius1,
    center2.buffer,
    radius2,
  );
}

/** Check collision between circle and rectangle */
export function CheckCollisionCircleRec(
  center: Vector2,
  radius: float,
  rec: Rectangle,
): boolean {
  return !!lib.CheckCollisionCircleRec(
    center.buffer,
    radius,
    rec.buffer,
  );
}

/** Check if circle collides with a line created betweeen two points [p1] and [p2] */
export function CheckCollisionCircleLine(
  center: Vector2,
  radius: float,
  p1: Vector2,
  p2: Vector2,
): boolean {
  return !!lib.CheckCollisionCircleLine(
    center.buffer,
    radius,
    p1.buffer,
    p2.buffer,
  );
}

/** Check if point is inside rectangle */
export function CheckCollisionPointRec(
  point: Vector2,
  rec: Rectangle,
): boolean {
  return !!lib.CheckCollisionPointRec(point.buffer, rec.buffer);
}

/** Check if point is inside circle */
export function CheckCollisionPointCircle(
  point: Vector2,
  center: Vector2,
  radius: float,
): boolean {
  return !!lib.CheckCollisionPointCircle(
    point.buffer,
    center.buffer,
    radius,
  );
}

/** Check if point is inside a triangle */
export function CheckCollisionPointTriangle(
  point: Vector2,
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
): boolean {
  return !!lib.CheckCollisionPointTriangle(
    point.buffer,
    p1.buffer,
    p2.buffer,
    p3.buffer,
  );
}

/** Check if point belongs to line created between two points [p1] and [p2] with defined margin in pixels [threshold] */
export function CheckCollisionPointLine(
  point: Vector2,
  p1: Vector2,
  p2: Vector2,
  threshold: int,
): boolean {
  return !!lib.CheckCollisionPointLine(
    point.buffer,
    p1.buffer,
    p2.buffer,
    threshold,
  );
}

/** Check if point is within a polygon described by array of vertices */
export function CheckCollisionPointPoly(
  point: Vector2,
  points: Vector2[],
): boolean {
  const count = points.length;
  if (count === 0) return false;

  const V2_Buffer = concatVector2(points);

  return !!lib.CheckCollisionPointPoly(
    point.buffer,
    V2_Buffer as BufferSource,
    count,
  );
}

/** Check the collision between two lines defined by two points each, returns collision point by reference */
export function CheckCollisionLines(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  p4: Vector2,
  collisionPoint: Vector2,
): boolean {
  return !!lib.CheckCollisionLines(
    p1.buffer,
    p2.buffer,
    p3.buffer,
    p4.buffer,
    collisionPoint.buffer,
  );
}

/** Get collision rectangle for two rectangles collision */
export function GetCollisionRec(rec1: Rectangle, rec2: Rectangle): Rectangle {
  const buf = lib.GetCollisionRec(rec1.buffer, rec2.buffer);
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  const width = view.getFloat32(8, littleEndian);
  const height = view.getFloat32(12, littleEndian);
  return new Rectangle(x, y, width, height);
}

/** Load image from file into CPU memory (RAM) */
export function LoadImage(file: string): Image {
  return new Image(lib.LoadImage(new TextEncoder().encode(file + "\0")));
}

/** Load image from RAW file data */
export function LoadImageRaw(
  file: string,
  width: int,
  height: int,
  format: int,
  headerSize: int,
): Image {
  return new Image(
    lib.LoadImageRaw(
      new TextEncoder().encode(file + "\0"),
      width,
      height,
      format,
      headerSize,
    ),
  );
}

/** Load image sequence from file (frames appended to image.data) */
export function LoadImageAnim(file: string): { image: Image; frames: number } {
  const framesBuf = new Int32Array(1);

  const image = new Image(
    lib.LoadImageAnim(
      new TextEncoder().encode(file + "\0"),
      Deno.UnsafePointer.of(framesBuf.buffer),
    ),
  );

  return {
    image,
    frames: framesBuf[0],
  };
}

/** Load image sequence from memory buffer */
export function LoadImageAnimFromMemory(
  fileType: string,
  fileData: Uint8Array<ArrayBuffer>,
): { image: Image; frames: number } {
  const framesBuf = new Int32Array(1);

  const image = new Image(
    lib.LoadImageAnimFromMemory(
      new TextEncoder().encode(fileType + "\0"),
      fileData,
      fileData.byteLength,
      Deno.UnsafePointer.of(framesBuf.buffer),
    ),
  );

  return {
    image,
    frames: framesBuf[0],
  };
}

/** Load image from memory buffer, fileType refers to extension: i.e. '.png' */
export function LoadImageFromMemory(
  fileType: string,
  fileData: Uint8Array<ArrayBuffer>,
): Image {
  return new Image(
    lib.LoadImageFromMemory(
      new TextEncoder().encode(fileType + "\0"),
      fileData,
      fileData.byteLength,
    ),
  );
}

/** Load image from GPU texture data */
export function LoadImageFromTexture(texture: Texture2D): Image {
  return new Image(lib.LoadImageFromTexture(texture.buffer));
}

/** Load image from screen buffer and (screenshot) */
export function LoadImageFromScreen(): Image {
  return new Image(lib.LoadImageFromScreen());
}

/** Check if an image is valid (data and parameters) */
export function IsImageValid(image: Image): boolean {
  return !!lib.IsImageValid(image.buffer);
}

/** Unload image from CPU memory (RAM) */
export function UnloadImage(image: Image): void {
  lib.UnloadImage(image.buffer);
}

/** Export image data to file, returns true on success */
export function ExportImage(image: Image, fileName: string): boolean {
  return !!lib.ExportImage(image.buffer, cstr(fileName));
}

/** Export image to memory buffer, memory must be MemFree() */
export function ExportImageToMemory(
  image: Image,
  fileType: string,
): { data: Uint8Array; dataSize: number } {
  const sizeBuf = new Int32Array(1);

  const ptr = lib.ExportImageToMemory(
    image.buffer,
    new TextEncoder().encode(fileType + "\0"),
    Deno.UnsafePointer.of(sizeBuf.buffer),
  );

  if (ptr === null) {
    throw new Error("ExportImageToMemory failed");
  }

  const size = sizeBuf[0];
  const view = new Deno.UnsafePointerView(ptr);
  const buffer = view.getArrayBuffer(size);
  const data = new Uint8Array(size);
  data.set(new Uint8Array(buffer));
  lib.MemFree(ptr);

  return {
    data,
    dataSize: size,
  };
}

/** Export image as code file defining an array of bytes, returns true on success */
export function ExportImageAsCode(image: Image, file: string): boolean {
  return !!lib.ExportImageAsCode(
    image.buffer,
    new TextEncoder().encode(file + "\0"),
  );
}

/** Generate image: plain color */
export function GenImageColor(
  width: int,
  height: int,
  color: Color,
): Image {
  return new Image(
    lib.GenImageColor(
      width,
      height,
      color.buffer,
    ),
  );
}

/** Generate image: linear gradient, direction in degrees [0..360], 0=Vertical gradient */
export function GenImageGradientLinear(
  width: int,
  height: int,
  direction: int,
  start: Color,
  end: Color,
): Image {
  return new Image(
    lib.GenImageGradientLinear(
      width,
      height,
      direction,
      start.buffer,
      end.buffer,
    ),
  );
}

/** Generate image: radial gradient */
export function GenImageGradientRadial(
  width: int,
  height: int,
  density: float,
  inner: Color,
  outer: Color,
): Image {
  return new Image(
    lib.GenImageGradientRadial(
      width,
      height,
      density,
      inner.buffer,
      outer.buffer,
    ),
  );
}

/** Generate image: square gradient */
export function GenImageGradientSquare(
  width: int,
  height: int,
  density: float,
  inner: Color,
  outer: Color,
): Image {
  return new Image(
    lib.GenImageGradientSquare(
      width,
      height,
      density,
      inner.buffer,
      outer.buffer,
    ),
  );
}

/** Generate image: checked */
export function GenImageChecked(
  width: int,
  height: int,
  checksX: int,
  checksY: int,
  col1: Color,
  col2: Color,
): Image {
  return new Image(
    lib.GenImageChecked(
      width,
      height,
      checksX,
      checksY,
      col1.buffer,
      col2.buffer,
    ),
  );
}

/** Generate image: white noise */
export function GenImageWhiteNoise(
  width: int,
  height: int,
  factor: float,
): Image {
  return new Image(
    lib.GenImageWhiteNoise(
      width,
      height,
      factor,
    ),
  );
}

/** Generate image: perlin noise */
export function GenImagePerlinNoise(
  width: int,
  height: int,
  offsetX: int,
  offsetY: int,
  scale: float,
): Image {
  return new Image(
    lib.GenImagePerlinNoise(
      width,
      height,
      offsetX,
      offsetY,
      scale,
    ),
  );
}

/** Generate image: cellular algorithm, bigger tileSize means bigger cells */
export function GenImageCellular(
  width: int,
  height: int,
  tileSize: int,
): Image {
  return new Image(
    lib.GenImageCellular(
      width,
      height,
      tileSize,
    ),
  );
}

/** Generate image: grayscale image from text data */
export function GenImageText(
  width: int,
  height: int,
  text: string,
): Image {
  return new Image(
    lib.GenImageText(
      width,
      height,
      new TextEncoder().encode(text + "\0").buffer,
    ),
  );
}

/** Create an image duplicate (useful for transformations) */
export function ImageCopy(
  image: Image,
): Image {
  return new Image(
    lib.ImageCopy(
      image.buffer,
    ),
  );
}

/** Create an image from another image piece */
export function ImageFromImage(
  image: Image,
  rec: Rectangle,
): Image {
  return new Image(
    lib.ImageFromImage(
      image.buffer,
      rec.buffer,
    ),
  );
}

/** Create an image from a selected channel of another image (GRAYSCALE) */
export function ImageFromChannel(
  image: Image,
  selectedChannel: int,
): Image {
  return new Image(
    lib.ImageFromChannel(
      image.buffer,
      selectedChannel,
    ),
  );
}

/** Create an image from text (default font) */
export function ImageText(
  text: string,
  fontSize: int,
  color: Color,
): Image {
  return new Image(
    lib.ImageText(
      new TextEncoder().encode(text + "\0").buffer,
      fontSize,
      color.buffer,
    ),
  );
}

/** Create an image from text (custom sprite font) */
export function ImageTextEx(
  font: Font,
  text: string,
  fontSize: float,
  spacing: float,
  tint: Color,
): Image {
  return new Image(
    lib.ImageTextEx(
      font.buffer,
      new TextEncoder().encode(text + "\0").buffer,
      fontSize,
      spacing,
      tint.buffer,
    ),
  );
}

/** Convert image data to desired format */
export function ImageFormat(
  image: Image,
  newFormat: int,
): void {
  lib.ImageFormat(
    image.buffer,
    newFormat,
  );
}

/** Convert image to POT (power-of-two) */
export function ImageToPOT(
  image: Image,
  fill: Color,
): void {
  lib.ImageToPOT(
    image.buffer,
    fill.buffer,
  );
}

/** Crop an image to a defined rectangle */
export function ImageCrop(
  image: Image,
  crop: Rectangle,
): void {
  lib.ImageCrop(
    image.buffer,
    crop.buffer,
  );
}

/** Crop image depending on alpha value */
export function ImageAlphaCrop(
  image: Image,
  threshold: float,
): void {
  lib.ImageAlphaCrop(
    image.buffer,
    threshold,
  );
}

/** Clear alpha channel to desired color */
export function ImageAlphaClear(
  image: Image,
  color: Color,
  threshold: float,
): void {
  lib.ImageAlphaClear(
    image.buffer,
    color.buffer,
    threshold,
  );
}

/** Apply alpha mask to image */
export function ImageAlphaMask(
  image: Image,
  alphaMask: Image,
): void {
  lib.ImageAlphaMask(
    image.buffer,
    alphaMask.buffer,
  );
}

/** Premultiply alpha channel */
export function ImageAlphaPremultiply(
  image: Image,
): void {
  lib.ImageAlphaPremultiply(
    image.buffer,
  );
}

/** Apply Gaussian blur using a box blur approximation */
export function ImageBlurGaussian(
  image: Image,
  blurSize: int,
): void {
  lib.ImageBlurGaussian(
    image.buffer,
    blurSize,
  );
}

/** Apply custom square convolution kernel to image */
export function ImageKernelConvolution(
  image: Image,
  kernel: Float32Array,
  kernelSize: int,
): void {
  lib.ImageKernelConvolution(
    image.buffer,
    Deno.UnsafePointer.of(kernel.buffer as ArrayBuffer),
    kernelSize,
  );
}

/** Resize image (Bicubic scaling algorithm) */
export function ImageResize(
  image: Image,
  newWidth: int,
  newHeight: int,
): void {
  lib.ImageResize(
    image.buffer,
    newWidth,
    newHeight,
  );
}

/** Resize image (Nearest-Neighbor scaling algorithm) */
export function ImageResizeNN(
  image: Image,
  newWidth: int,
  newHeight: int,
): void {
  lib.ImageResizeNN(
    image.buffer,
    newWidth,
    newHeight,
  );
}

/** Resize canvas and fill with color */
export function ImageResizeCanvas(
  image: Image,
  newWidth: int,
  newHeight: int,
  offsetX: int,
  offsetY: int,
  fill: Color,
): void {
  lib.ImageResizeCanvas(
    image.buffer,
    newWidth,
    newHeight,
    offsetX,
    offsetY,
    fill.buffer,
  );
}

/** Compute all mipmap levels for a provided image */
export function ImageMipmaps(
  image: Image,
): void {
  lib.ImageMipmaps(
    image.buffer,
  );
}

/** Dither image data to 16bpp or lower (Floyd-Steinberg dithering) */
export function ImageDither(
  image: Image,
  rBpp: int,
  gBpp: int,
  bBpp: int,
  aBpp: int,
): void {
  lib.ImageDither(
    image.buffer,
    rBpp,
    gBpp,
    bBpp,
    aBpp,
  );
}

/** Flip image vertically */
export function ImageFlipVertical(
  image: Image,
): void {
  lib.ImageFlipVertical(
    image.buffer,
  );
}

/** Flip image horizontally */
export function ImageFlipHorizontal(
  image: Image,
): void {
  lib.ImageFlipHorizontal(
    image.buffer,
  );
}

/** Rotate image by input angle in degrees (-359 to 359) */
export function ImageRotate(
  image: Image,
  degrees: int,
): void {
  lib.ImageRotate(
    image.buffer,
    degrees,
  );
}

/** Rotate image clockwise 90deg */
export function ImageRotateCW(
  image: Image,
): void {
  lib.ImageRotateCW(
    image.buffer,
  );
}

/** Rotate image counter-clockwise 90deg */
export function ImageRotateCCW(
  image: Image,
): void {
  lib.ImageRotateCCW(
    image.buffer,
  );
}

/** Modify image color: tint */
export function ImageColorTint(
  image: Image,
  color: Color,
): void {
  lib.ImageColorTint(
    image.buffer,
    color.buffer,
  );
}

/** Modify image color: invert */
export function ImageColorInvert(
  image: Image,
): void {
  lib.ImageColorInvert(
    image.buffer,
  );
}

// Image color modification functions (in-place)

/** Modify image color: grayscale */
export function ImageColorGrayscale(
  image: Image,
): void {
  lib.ImageColorGrayscale(
    image.buffer,
  );
}

/** Modify image color: contrast (-100 to 100) */
export function ImageColorContrast(
  image: Image,
  contrast: float,
): void {
  lib.ImageColorContrast(
    image.buffer,
    contrast,
  );
}

/** Modify image color: brightness (-255 to 255) */
export function ImageColorBrightness(
  image: Image,
  brightness: int,
): void {
  lib.ImageColorBrightness(
    image.buffer,
    brightness,
  );
}

/** Modify image color: replace color */
export function ImageColorReplace(
  image: Image,
  color: Color,
  replace: Color,
): void {
  lib.ImageColorReplace(
    image.buffer,
    color.buffer,
    replace.buffer,
  );
}

/** Load color data from image as a Color array (RGBA - 32bit) */
export function LoadImageColors(
  image: Image,
): Uint8Array<ArrayBuffer> {
  const ptr = lib.LoadImageColors(image.buffer);
  if (ptr === null) throw new Error("LoadImageColors failed");

  const size = image.width * image.height * 4;
  const view = new Deno.UnsafePointerView(ptr);
  return new Uint8Array(view.getArrayBuffer(size));
}

/** Load colors palette from image as a Color array (RGBA - 32bit) */
export function LoadImagePalette(
  image: Image,
  maxPaletteSize: int,
): { colors: Uint8Array<ArrayBuffer>; colorCount: int } {
  const countBuf = new Int32Array(1);

  const ptr = lib.LoadImagePalette(
    image.buffer,
    maxPaletteSize,
    Deno.UnsafePointer.of(countBuf.buffer),
  );

  if (ptr === null) throw new Error("LoadImagePalette failed");

  const colorCount = countBuf[0];
  const size = colorCount * 4;
  const view = new Deno.UnsafePointerView(ptr);
  const colors = new Uint8Array(view.getArrayBuffer(size));

  return {
    colors,
    colorCount,
  };
}

/** Unload color data loaded with LoadImageColors() */
export function UnloadImageColors(
  colors: Uint8Array<ArrayBuffer>,
): void {
  lib.UnloadImageColors(colors);
}

/** Unload colors palette loaded with LoadImagePalette() */
export function UnloadImagePalette(
  colors: Uint8Array<ArrayBuffer>,
): void {
  lib.UnloadImagePalette(colors);
}

/** Get image alpha border rectangle */
export function GetImageAlphaBorder(
  image: Image,
  threshold: float,
): Rectangle {
  const buf = lib.GetImageAlphaBorder(
    image.buffer,
    threshold,
  );

  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, true);
  const y = view.getFloat32(4, true);
  const width = view.getFloat32(8, true);
  const height = view.getFloat32(12, true);

  return new Rectangle(x, y, width, height);
}

/** Get image pixel color at (x, y) position */
export function GetImageColor(
  image: Image,
  x: int,
  y: int,
): Color {
  const buf = lib.GetImageColor(
    image.buffer,
    x,
    y,
  );

  const view = new DataView(buf.buffer);
  const r = view.getUint8(0);
  const g = view.getUint8(1);
  const b = view.getUint8(2);
  const a = view.getUint8(3);

  return new Color(r, g, b, a);
}

/** Clear image background with given color */
export function ImageClearBackground(
  dst: Image,
  color: Color,
): void {
  lib.ImageClearBackground(
    dst.buffer,
    color.buffer,
  );
}

/** Draw pixel within an image */
export function ImageDrawPixel(
  dst: Image,
  posX: int,
  posY: int,
  color: Color,
): void {
  lib.ImageDrawPixel(
    dst.buffer,
    posX,
    posY,
    color.buffer,
  );
}

/** Draw pixel within an image (Vector version) */
export function ImageDrawPixelV(
  dst: Image,
  position: Vector2,
  color: Color,
): void {
  lib.ImageDrawPixelV(
    dst.buffer,
    position.buffer,
    color.buffer,
  );
}

/** Draw line within an image */
export function ImageDrawLine(
  dst: Image,
  startPosX: int,
  startPosY: int,
  endPosX: int,
  endPosY: int,
  color: Color,
): void {
  lib.ImageDrawLine(
    dst.buffer,
    startPosX,
    startPosY,
    endPosX,
    endPosY,
    color.buffer,
  );
}

/** Draw line within an image (Vector version) */
export function ImageDrawLineV(
  dst: Image,
  start: Vector2,
  end: Vector2,
  color: Color,
): void {
  lib.ImageDrawLineV(
    dst.buffer,
    start.buffer,
    end.buffer,
    color.buffer,
  );
}

/** Draw a line defining thickness within an image */
export function ImageDrawLineEx(
  dst: Image,
  start: Vector2,
  end: Vector2,
  thick: int,
  color: Color,
): void {
  lib.ImageDrawLineEx(
    dst.buffer,
    start.buffer,
    end.buffer,
    thick,
    color.buffer,
  );
}

/** Draw a filled circle within an image */
export function ImageDrawCircle(
  dst: Image,
  centerX: int,
  centerY: int,
  radius: int,
  color: Color,
): void {
  lib.ImageDrawCircle(
    dst.buffer,
    centerX,
    centerY,
    radius,
    color.buffer,
  );
}

/** Draw a filled circle within an image (Vector version) */
export function ImageDrawCircleV(
  dst: Image,
  center: Vector2,
  radius: int,
  color: Color,
): void {
  lib.ImageDrawCircleV(
    dst.buffer,
    center.buffer,
    radius,
    color.buffer,
  );
}

/** Draw circle outline within an image */
export function ImageDrawCircleLines(
  dst: Image,
  centerX: int,
  centerY: int,
  radius: int,
  color: Color,
): void {
  lib.ImageDrawCircleLines(
    dst.buffer,
    centerX,
    centerY,
    radius,
    color.buffer,
  );
}

/** Draw circle outline within an image (Vector version) */
export function ImageDrawCircleLinesV(
  dst: Image,
  center: Vector2,
  radius: int,
  color: Color,
): void {
  lib.ImageDrawCircleLinesV(
    dst.buffer,
    center.buffer,
    radius,
    color.buffer,
  );
}

/** Draw rectangle within an image */
export function ImageDrawRectangle(
  dst: Image,
  posX: int,
  posY: int,
  width: int,
  height: int,
  color: Color,
): void {
  lib.ImageDrawRectangle(
    dst.buffer,
    posX,
    posY,
    width,
    height,
    color.buffer,
  );
}

/** Draw rectangle within an image (Vector version) */
export function ImageDrawRectangleV(
  dst: Image,
  position: Vector2,
  size: Vector2,
  color: Color,
): void {
  lib.ImageDrawRectangleV(
    dst.buffer,
    position.buffer,
    size.buffer,
    color.buffer,
  );
}

/** Draw rectangle within an image */
export function ImageDrawRectangleRec(
  dst: Image,
  rec: Rectangle,
  color: Color,
): void {
  lib.ImageDrawRectangleRec(
    dst.buffer,
    rec.buffer,
    color.buffer,
  );
}

/** Draw rectangle lines within an image */
export function ImageDrawRectangleLines(
  dst: Image,
  rec: Rectangle,
  thick: int,
  color: Color,
): void {
  lib.ImageDrawRectangleLines(
    dst.buffer,
    rec.buffer,
    thick,
    color.buffer,
  );
}

/** Draw triangle within an image */
export function ImageDrawTriangle(
  dst: Image,
  v1: Vector2,
  v2: Vector2,
  v3: Vector2,
  color: Color,
): void {
  lib.ImageDrawTriangle(
    dst.buffer,
    v1.buffer,
    v2.buffer,
    v3.buffer,
    color.buffer,
  );
}

/** Draw triangle with interpolated colors within an image */
export function ImageDrawTriangleEx(
  dst: Image,
  v1: Vector2,
  v2: Vector2,
  v3: Vector2,
  c1: Color,
  c2: Color,
  c3: Color,
): void {
  lib.ImageDrawTriangleEx(
    dst.buffer,
    v1.buffer,
    v2.buffer,
    v3.buffer,
    c1.buffer,
    c2.buffer,
    c3.buffer,
  );
}

// Image drawing functions (in-place, Image*)

/** Draw triangle outline within an image */
export function ImageDrawTriangleLines(
  dst: Image,
  v1: Vector2,
  v2: Vector2,
  v3: Vector2,
  color: Color,
): void {
  lib.ImageDrawTriangleLines(
    dst.buffer,
    v1.buffer,
    v2.buffer,
    v3.buffer,
    color.buffer,
  );
}

/** Draw a triangle fan defined by points within an image (first vertex is the center) */
export function ImageDrawTriangleFan(
  dst: Image,
  points: Vector2[],
  pointCount: int,
  color: Color,
): void {
  const V2_Buffer = concatVector2(points);

  lib.ImageDrawTriangleFan(
    dst.buffer,
    V2_Buffer as BufferSource,
    pointCount,
    color.buffer,
  );
}

/** Draw a triangle strip defined by points within an image */
export function ImageDrawTriangleStrip(
  dst: Image,
  points: Vector2[],
  pointCount: int,
  color: Color,
): void {
  const V2_Buffer = concatVector2(points);

  lib.ImageDrawTriangleStrip(
    dst.buffer,
    V2_Buffer as BufferSource,
    pointCount,
    color.buffer,
  );
}

/** Draw a source image within a destination image (tint applied to source) */
export function ImageDraw(
  dst: Image,
  src: Image,
  srcRec: Rectangle,
  dstRec: Rectangle,
  tint: Color,
): void {
  lib.ImageDraw(
    dst.buffer,
    src.buffer,
    srcRec.buffer,
    dstRec.buffer,
    tint.buffer,
  );
}

/** Draw text (using default font) within an image (destination) */
export function ImageDrawText(
  dst: Image,
  text: string,
  posX: int,
  posY: int,
  fontSize: int,
  color: Color,
): void {
  lib.ImageDrawText(
    dst.buffer,
    new TextEncoder().encode(text + "\0").buffer,
    posX,
    posY,
    fontSize,
    color.buffer,
  );
}

/** Draw text (custom sprite font) within an image (destination) */
export function ImageDrawTextEx(
  dst: Image,
  font: Font,
  text: string,
  position: Vector2,
  fontSize: float,
  spacing: float,
  tint: Color,
): void {
  lib.ImageDrawTextEx(
    dst.buffer,
    font.buffer,
    new TextEncoder().encode(text + "\0").buffer,
    position.buffer,
    fontSize,
    spacing,
    tint.buffer,
  );
}

/** Load texture from file into GPU memory (VRAM) */
export function LoadTexture(file: string): Texture2D {
  return new Texture2D(
    lib.LoadTexture(new TextEncoder().encode(file + "\0").buffer),
  );
}

/** Load texture from image data */
export function LoadTextureFromImage(image: Image): Texture2D {
  return new Texture2D(lib.LoadTextureFromImage(image.buffer));
}

/** Load cubemap from image, multiple image cubemap layouts supported */
export function LoadTextureCubemap(image: Image, layout: int): Texture2D {
  return new Texture2D(lib.LoadTextureCubemap(image.buffer, layout));
}

/** Load texture for rendering (framebuffer) */
export function LoadRenderTexture(width: int, height: int): RenderTexture {
  return new RenderTexture(lib.LoadRenderTexture(width, height));
}

/** Check if a texture is valid (loaded in GPU) */
export function IsTextureValid(texture: Texture2D): boolean {
  return !!lib.IsTextureValid(texture.buffer);
}

/** Unload texture from GPU memory (VRAM) */
export function UnloadTexture(texture: Texture2D): void {
  lib.UnloadTexture(texture.buffer);
}

/** Check if a render texture is valid (loaded in GPU) */
export function IsRenderTextureValid(texture: RenderTexture): boolean {
  return !!lib.IsRenderTextureValid(texture.buffer);
}

/** Unload render texture from GPU memory (VRAM) */
export function UnloadRenderTexture(texture: RenderTexture): void {
  lib.UnloadRenderTexture(texture.buffer);
}

/** Update GPU texture with new data (pixels should be able to fill texture) */
export function UpdateTexture(texture: Texture2D, pixels: Uint8Array): void {
  lib.UpdateTexture(
    texture.buffer,
    Deno.UnsafePointer.of(pixels.buffer as BufferSource),
  );
}

/** Update GPU texture rectangle with new data (pixels and rec should fit in texture) */
export function UpdateTextureRec(
  texture: Texture2D,
  rec: Rectangle,
  pixels: Uint8Array,
): void {
  lib.UpdateTextureRec(
    texture.buffer,
    rec.buffer,
    Deno.UnsafePointer.of(pixels.buffer as BufferSource),
  );
}

/** Generate GPU mipmaps for a texture */
export function GenTextureMipmaps(texture: Texture2D): void {
  lib.GenTextureMipmaps(texture.buffer);
}

/** Set texture scaling filter mode */
export function SetTextureFilter(
  texture: Texture2D,
  filter: TextureFilter,
): void {
  lib.SetTextureFilter(texture.buffer, filter);
}

/** Set texture wrapping mode */
export function SetTextureWrap(texture: Texture2D, wrap: TextureWrap): void {
  lib.SetTextureWrap(texture.buffer, wrap);
}

// Texture drawing functions

/** Draw a Texture2D */
export function DrawTexture(
  texture: Texture2D,
  posX: int,
  posY: int,
  tint: Color,
): void {
  lib.DrawTexture(
    texture.buffer,
    posX,
    posY,
    tint.buffer,
  );
}

/** Draw a Texture2D with position defined as Vector2 */
export function DrawTextureV(
  texture: Texture2D,
  position: Vector2,
  tint: Color,
): void {
  lib.DrawTextureV(
    texture.buffer,
    position.buffer,
    tint.buffer,
  );
}

/** Draw a Texture2D with extended parameters */
export function DrawTextureEx(
  texture: Texture2D,
  position: Vector2,
  rotation: float,
  scale: float,
  tint: Color,
): void {
  lib.DrawTextureEx(
    texture.buffer,
    position.buffer,
    rotation,
    scale,
    tint.buffer,
  );
}

/** Draw a part of a texture defined by a rectangle */
export function DrawTextureRec(
  texture: Texture2D,
  source: Rectangle,
  position: Vector2,
  tint: Color,
): void {
  lib.DrawTextureRec(
    texture.buffer,
    source.buffer,
    position.buffer,
    tint.buffer,
  );
}

/** Draw a part of a texture defined by a rectangle with 'pro' parameters */
export function DrawTexturePro(
  texture: Texture2D,
  source: Rectangle,
  dest: Rectangle,
  origin: Vector2,
  rotation: float,
  tint: Color,
): void {
  lib.DrawTexturePro(
    texture.buffer,
    source.buffer,
    dest.buffer,
    origin.buffer,
    rotation,
    tint.buffer,
  );
}

/** Draws a texture (or part of it) that stretches or shrinks nicely */
export function DrawTextureNPatch(
  texture: Texture2D,
  nPatchInfo: NPatchInfo,
  dest: Rectangle,
  origin: Vector2,
  rotation: float,
  tint: Color,
): void {
  lib.DrawTextureNPatch(
    texture.buffer,
    nPatchInfo.buffer,
    dest.buffer,
    origin.buffer,
    rotation,
    tint.buffer,
  );
}

/** Check if two colors are equal */
export function ColorIsEqual(col1: Color, col2: Color): boolean {
  return !!lib.ColorIsEqual(col1.buffer, col2.buffer);
}

/** Get color with alpha applied, alpha goes from 0.0f to 1.0f */
export function Fade(
  color: Color,
  alpha: float,
): Color {
  const buf = lib.Fade(color.buffer, alpha);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get hexadecimal value for a Color (0xRRGGBBAA) */
export function ColorToInt(color: Color): int {
  return lib.ColorToInt(color.buffer);
}

/** Get Color normalized as float [0..1] */
export function ColorNormalize(color: Color): Vector4 {
  const buf = lib.ColorNormalize(color.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get Color from normalized values [0..1] */
export function ColorFromNormalized(normalized: Vector4): Color {
  const buf = lib.ColorFromNormalized(normalized.buffer);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get HSV values for a Color, hue [0..360], saturation/value [0..1] */
export function ColorToHSV(color: Color): Vector3 {
  const buf = lib.ColorToHSV(color.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get a Color from HSV values, hue [0..360], saturation/value [0..1] */
export function ColorFromHSV(
  hue: float,
  saturation: float,
  value: float,
): Color {
  const buf = lib.ColorFromHSV(hue, saturation, value);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get color multiplied with another color */
export function ColorTint(color: Color, tint: Color): Color {
  const buf = lib.ColorTint(color.buffer, tint.buffer);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get color with brightness correction, brightness factor goes from -1.0f to 1.0f */
export function ColorBrightness(color: Color, factor: float): Color {
  const buf = lib.ColorBrightness(color.buffer, factor);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get color with contrast correction, contrast values between -1.0f and 1.0f */
export function ColorContrast(color: Color, contrast: float): Color {
  const buf = lib.ColorContrast(color.buffer, contrast);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get color with alpha applied, alpha goes from 0.0f to 1.0f */
export function ColorAlpha(color: Color, alpha: float): Color {
  const buf = lib.ColorAlpha(color.buffer, alpha);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get src alpha-blended into dst color with tint */
export function ColorAlphaBlend(
  dst: Color,
  src: Color,
  tint: Color,
): Color {
  const buf = lib.ColorAlphaBlend(dst.buffer, src.buffer, tint.buffer);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get color lerp interpolation between two colors, factor [0.0f..1.0f] */
export function ColorLerp(color1: Color, color2: Color, amount: float): Color {
  const buf = lib.ColorLerp(color1.buffer, color2.buffer, amount);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get Color structure from hexadecimal value */
export function GetColor(hex: int): Color {
  const buf = lib.GetColor(hex);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get Color from a source pixel pointer of certain format */
export function GetPixelColor(srcPtr: Uint8Array, format: PixelFormat): Color {
  const buf = lib.GetPixelColor(
    Deno.UnsafePointer.of(srcPtr.buffer as BufferSource),
    format,
  );
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Set color formatted into destination pixel pointer */
export function SetPixelColor(
  dstPtr: Uint8Array,
  color: Color,
  format: PixelFormat,
): void {
  lib.SetPixelColor(
    Deno.UnsafePointer.of(dstPtr.buffer as BufferSource),
    color.buffer,
    format,
  );
}

/** Get pixel data size in bytes for certain format */
export function GetPixelDataSize(
  width: int,
  height: int,
  format: PixelFormat,
): int {
  return lib.GetPixelDataSize(width, height, format);
}

/** Get the default Font */
export function GetFontDefault(): Font {
  return new Font(lib.GetFontDefault());
}

/** Load font from file into GPU memory (VRAM) */
export function LoadFont(file: string): Font {
  return new Font(
    lib.LoadFont(new TextEncoder().encode(file + "\0")),
  );
}

/** Load font from file with extended parameters, use NULL for codepoints and 0 for codepointCount to load the default character set, font size is provided in pixels height */
export function LoadFontEx(
  file: string,
  fontSize: int,
  codepoints: Int32Array | null,
  codepointCount: int,
): Font {
  const cpPtr = codepoints
    ? Deno.UnsafePointer.of(codepoints.buffer as BufferSource)
    : null;

  return new Font(
    lib.LoadFontEx(
      new TextEncoder().encode(file + "\0"),
      fontSize,
      cpPtr,
      codepointCount,
    ),
  );
}

/** Load font from Image (XNA style) */
export function LoadFontFromImage(
  image: Image,
  key: Color,
  firstChar: int,
): Font {
  return new Font(
    lib.LoadFontFromImage(image.buffer, key.buffer, firstChar),
  );
}

/** Load font from memory buffer, fileType refers to extension: i.e. '.ttf' */
export function LoadFontFromMemory(
  fileType: string,
  fileData: Uint8Array,
  fontSize: int,
  codepoints: Int32Array | null,
  codepointCount: int,
): Font {
  const codepointsPtr = codepoints
    ? Deno.UnsafePointer.of(codepoints.buffer as BufferSource)
    : null;

  return new Font(
    lib.LoadFontFromMemory(
      new TextEncoder().encode(fileType + "\0"),
      fileData as BufferSource,
      fileData.byteLength,
      fontSize,
      codepointsPtr,
      codepointCount,
    ),
  );
}

/** Check if a font is valid (font data loaded, WARNING: GPU texture not checked) */
export function IsFontValid(font: Font): boolean {
  return !!lib.IsFontValid(font.buffer);
}

/** Load font data for further use */
export function LoadFontData(
  fileData: Uint8Array,
  fontSize: number,
  codepoints: Int32Array | null,
  codepointCount: number,
  type: number,
): { glyphs: GlyphInfo[]; ptr: Deno.UnsafePointer; count: int } {
  const codepointsPtr = codepoints
    ? Deno.UnsafePointer.of(codepoints.buffer as BufferSource)
    : null;
  const glyphCount = new Int32Array([codepointCount]);
  const ptr = lib.LoadFontData(
    fileData as BufferSource,
    fileData.byteLength,
    fontSize,
    codepointsPtr,
    codepointCount,
    type,
    Deno.UnsafePointer.of(glyphCount.buffer),
  );

  if (ptr === null) {
    throw new Error("LoadFontData returned NULL");
  }

  const total = GlyphInfo.SIZE * glyphCount[0];

  const backing = new Deno.UnsafePointerView(ptr).getArrayBuffer(total);

  const glyphs = new Array<GlyphInfo>(glyphCount[0]);
  for (let i = 0; i < glyphCount[0]; i++) {
    glyphs[i] = new GlyphInfo(
      new Uint8Array(backing, i * GlyphInfo.SIZE, GlyphInfo.SIZE) as Uint8Array<
        ArrayBuffer
      >,
    );
  }

  return { glyphs, ptr, count: glyphCount[0] };
}

/** Generate image font atlas using chars info */
export function GenImageFontAtlas(
  glyphs: GlyphInfo[],
  glyphRecsOut: BigUint64Array,
  glyphCount: int,
  fontSize: int,
  padding: int,
  packMethod: int,
): Image {
  const glyphBuf = new Uint8Array(glyphs.length * GlyphInfo.SIZE);

  for (let i = 0; i < glyphs.length; i++) {
    glyphBuf.set(glyphs[i].buffer, i * GlyphInfo.SIZE);
  }

  const glyphRecsPtr = Deno.UnsafePointer.of(
    glyphRecsOut.buffer as BufferSource,
  );

  return new Image(
    lib.GenImageFontAtlas(
      glyphBuf,
      glyphRecsPtr,
      glyphCount,
      fontSize,
      padding,
      packMethod,
    ),
  );
}

/** Unload font chars info data (RAM) */
export function UnloadFontData(
  glyphs: GlyphInfo[] | Deno.PointerValue | {
    ptr: Deno.PointerValue;
    count?: int;
  },
  glyphCount: int,
): void {
  const ptr = Array.isArray(glyphs)
    ? Deno.UnsafePointer.of(glyphs[0].buffer)
    : "ptr" in Object(glyphs)
    ? (glyphs as { ptr: Deno.PointerValue }).ptr
    : glyphs as Deno.PointerValue;

  if (ptr === null) return;
  lib.UnloadFontData(ptr, glyphCount);
}

/** Unload font from GPU memory (VRAM) */
export function UnloadFont(font: Font): void {
  lib.UnloadFont(font.buffer);
}

/** Export font as code file, returns true on success */
export function ExportFontAsCode(
  font: Font,
  fileName: string,
): boolean {
  return !!lib.ExportFontAsCode(
    font.buffer,
    new TextEncoder().encode(fileName + "\0"),
  );
}

/** Draw current FPS */
export function DrawFPS(posX: int, posY: int): void {
  lib.DrawFPS(posX, posY);
}

/** Draw text (using default font) */
export function DrawText(
  text: string,
  posX: int,
  posY: int,
  fontSize: int,
  color: Color,
): void {
  lib.DrawText(
    new TextEncoder().encode(text + "\0"),
    posX,
    posY,
    fontSize,
    color.buffer,
  );
}

/** Draw text using font and additional parameters */
export function DrawTextEx(
  font: Font,
  text: string,
  position: Vector2,
  fontSize: int,
  spacing: int,
  tint: Color,
): void {
  lib.DrawTextEx(
    font.buffer,
    new TextEncoder().encode(text + "\0").buffer,
    position.buffer,
    fontSize,
    spacing,
    tint.buffer,
  );
}

/** Draw text using Font and pro parameters (rotation) */
export function DrawTextPro(
  font: Font,
  text: string,
  position: Vector2,
  origin: Vector2,
  rotation: int,
  fontSize: int,
  spacing: int,
  tint: Color,
): void {
  lib.DrawTextPro(
    font.buffer,
    new TextEncoder().encode(text + "\0").buffer,
    position.buffer,
    origin.buffer,
    rotation,
    fontSize,
    spacing,
    tint.buffer,
  );
}

/** Draw one character (codepoint) */
export function DrawTextCodepoint(
  font: Font,
  codepoint: int,
  position: Vector2,
  fontSize: int,
  tint: Color,
): void {
  lib.DrawTextCodepoint(
    font.buffer,
    codepoint,
    position.buffer,
    fontSize,
    tint.buffer,
  );
}

/** Draw multiple character (codepoint) */
export function DrawTextCodepoints(
  font: Font,
  codepoints: Int32Array,
  codepointCount: int,
  position: Vector2,
  fontSize: int,
  spacing: int,
  tint: Color,
): void {
  lib.DrawTextCodepoints(
    font.buffer,
    Deno.UnsafePointer.of(codepoints.buffer as BufferSource),
    codepointCount,
    position.buffer,
    fontSize,
    spacing,
    tint.buffer,
  );
}

/** Set vertical line spacing when drawing with line-breaks */
export function SetTextLineSpacing(spacing: int): void {
  lib.SetTextLineSpacing(spacing);
}

/** Measure string width for default font */
export function MeasureText(text: string, fontSize: int): int {
  return lib.MeasureText(
    new TextEncoder().encode(text + "\0").buffer,
    fontSize,
  );
}

/** Measure string size for Font */
export function MeasureTextEx(
  font: Font,
  text: string,
  fontSize: float,
  spacing: float,
): Vector2 {
  const buf = lib.MeasureTextEx(
    font.buffer,
    new TextEncoder().encode(text + "\0").buffer,
    fontSize,
    spacing,
  );
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Get glyph index position in font for a codepoint (unicode character), fallback to '?' if not found */
export function GetGlyphIndex(font: Font, codepoint: int): int {
  return lib.GetGlyphIndex(font.buffer, codepoint);
}

/** Get glyph font info data for a codepoint (unicode character), fallback to '?' if not found */
export function GetGlyphInfo(font: Font, codepoint: int): GlyphInfo {
  const buf = lib.GetGlyphInfo(font.buffer, codepoint);
  return new GlyphInfo(buf);
}

/** Get glyph rectangle in font atlas for a codepoint (unicode character), fallback to '?' if not found */
export function GetGlyphAtlasRec(font: Font, codepoint: int): Rectangle {
  const buf = lib.GetGlyphAtlasRec(font.buffer, codepoint);
  return Rectangle.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Measure string size for an existing array of codepoints for Font */
export function MeasureTextCodepoints(
  font: Font,
  codepoints: Int32Array,
  length: int,
  fontSize: float,
  spacing: float,
): Vector2 {
  const buf = lib.MeasureTextCodepoints(
    font.buffer,
    Deno.UnsafePointer.of(codepoints.buffer as BufferSource),
    length,
    fontSize,
    spacing,
  );
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Load UTF-8 text encoded from codepoints array */
export function LoadUTF8(
  codepoints: Int32Array,
  length = codepoints.length,
): string {
  const ptr = lib.LoadUTF8(
    Deno.UnsafePointer.of(codepoints.buffer as BufferSource),
    length,
  );
  const text = readCString(ptr);
  if (ptr !== null) lib.UnloadUTF8(ptr);
  return text;
}

/** Unload UTF-8 text encoded from codepoints array */
export function UnloadUTF8(text: Deno.PointerValue): void {
  if (text !== null) lib.UnloadUTF8(text);
}

/** Load all codepoints from a UTF-8 text string, codepoints count returned by parameter */
export function LoadCodepoints(text: string): Int32Array {
  const count = new Int32Array(1);
  const ptr = lib.LoadCodepoints(
    cstr(text),
    Deno.UnsafePointer.of(count.buffer),
  );
  if (ptr === null || count[0] <= 0) return new Int32Array();
  const view = new Deno.UnsafePointerView(ptr);
  const copy = new Int32Array(view.getArrayBuffer(count[0] * 4).slice(0));
  lib.UnloadCodepoints(ptr);
  return copy;
}

/** Unload codepoints data from memory */
export function UnloadCodepoints(codepoints: Deno.PointerValue): void {
  if (codepoints !== null) lib.UnloadCodepoints(codepoints);
}

/** Get total number of codepoints in a UTF-8 encoded string */
export function GetCodepointCount(text: string): int {
  return lib.GetCodepointCount(cstr(text));
}

/** Get next codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure */
export function GetCodepoint(text: string): { codepoint: int; size: int } {
  const size = new Int32Array(1);
  const codepoint = lib.GetCodepoint(
    cstr(text),
    Deno.UnsafePointer.of(size.buffer),
  );
  return { codepoint, size: size[0] };
}

/** Get next codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure */
export function GetCodepointNext(text: string): { codepoint: int; size: int } {
  const size = new Int32Array(1);
  const codepoint = lib.GetCodepointNext(
    cstr(text),
    Deno.UnsafePointer.of(size.buffer),
  );
  return { codepoint, size: size[0] };
}

/** Get previous codepoint in a UTF-8 encoded string, 0x3f('?') is returned on failure */
export function GetCodepointPrevious(
  text: string,
): { codepoint: int; size: int } {
  const size = new Int32Array(1);
  const codepoint = lib.GetCodepointPrevious(
    cstr(text),
    Deno.UnsafePointer.of(size.buffer),
  );
  return { codepoint, size: size[0] };
}

/** Encode one codepoint into UTF-8 byte array (array length returned as parameter) */
export function CodepointToUTF8(codepoint: int): { text: string; size: int } {
  const size = new Int32Array(1);
  const ptr = lib.CodepointToUTF8(
    codepoint,
    Deno.UnsafePointer.of(size.buffer),
  );
  return { text: readCString(ptr), size: size[0] };
}

/** Load text as separate lines ('\n') */
export function LoadTextLines(text: string): string[] {
  const count = new Int32Array(1);
  const ptr = lib.LoadTextLines(
    cstr(text),
    Deno.UnsafePointer.of(count.buffer),
  );
  const lines = readCStringArray(ptr, count[0]);
  lib.UnloadTextLines(ptr, count[0]);
  return lines;
}

/** Unload text lines */
export function UnloadTextLines(
  text: Deno.PointerValue,
  lineCount: int,
): void {
  if (text !== null) lib.UnloadTextLines(text, lineCount);
}

/** Copy one string to another, returns bytes copied */
export function TextCopy(src: string): { text: string; bytesCopied: int } {
  const dst = new Uint8Array(cstr(src).byteLength);
  const bytesCopied = lib.TextCopy(dst, cstr(src));
  return { text: readCString(Deno.UnsafePointer.of(dst)), bytesCopied };
}

/** Check if two text string are equal */
export function TextIsEqual(text1: string, text2: string): boolean {
  return !!lib.TextIsEqual(cstr(text1), cstr(text2));
}

/** Get text length, checks for '\0' ending */
export function TextLength(text: string): number {
  return lib.TextLength(cstr(text));
}

/** Get a piece of a text string */
export function TextSubtext(text: string, position: int, length: int): string {
  return readCString(lib.TextSubtext(cstr(text), position, length));
}

/** Remove text spaces, concat words */
export function TextRemoveSpaces(text: string): string {
  return readCString(lib.TextRemoveSpaces(cstr(text)));
}

/** Get text between two strings */
export function GetTextBetween(
  text: string,
  begin: string,
  end: string,
): string {
  return readCString(lib.GetTextBetween(cstr(text), cstr(begin), cstr(end)));
}

/** Replace text string with new string */
export function TextReplace(
  text: string,
  search: string,
  replacement: string,
): string {
  return readCString(
    lib.TextReplace(cstr(text), cstr(search), cstr(replacement)),
  );
}

/** Replace text string with new string, memory must be MemFree() */
export function TextReplaceAlloc(
  text: string,
  search: string,
  replacement: string,
): string {
  return copyAndFreeCString(
    lib.TextReplaceAlloc(cstr(text), cstr(search), cstr(replacement)),
  );
}

/** Replace text between two specific strings */
export function TextReplaceBetween(
  text: string,
  begin: string,
  end: string,
  replacement: string,
): string {
  return readCString(
    lib.TextReplaceBetween(
      cstr(text),
      cstr(begin),
      cstr(end),
      cstr(replacement),
    ),
  );
}

/** Replace text between two specific strings, memory must be MemFree() */
export function TextReplaceBetweenAlloc(
  text: string,
  begin: string,
  end: string,
  replacement: string,
): string {
  return copyAndFreeCString(
    lib.TextReplaceBetweenAlloc(
      cstr(text),
      cstr(begin),
      cstr(end),
      cstr(replacement),
    ),
  );
}

/** Insert text in a defined byte position */
export function TextInsert(
  text: string,
  insert: string,
  position: int,
): string {
  return readCString(lib.TextInsert(cstr(text), cstr(insert), position));
}

/** Insert text in a defined byte position, memory must be MemFree() */
export function TextInsertAlloc(
  text: string,
  insert: string,
  position: int,
): string {
  return copyAndFreeCString(
    lib.TextInsertAlloc(cstr(text), cstr(insert), position),
  );
}

/** Join text strings with delimiter */
export function TextJoin(textList: string[], delimiter: string): string {
  const strings = textList.map(cstr);
  const pointers = new BigUint64Array(strings.length);
  for (let i = 0; i < strings.length; i++) {
    const ptr = Deno.UnsafePointer.of(strings[i]);
    pointers[i] = ptr === null ? 0n : Deno.UnsafePointer.value(ptr);
  }
  return readCString(
    lib.TextJoin(
      Deno.UnsafePointer.of(pointers.buffer),
      strings.length,
      cstr(delimiter),
    ),
  );
}

/** Split text into multiple strings, using MAX_TEXTSPLIT_COUNT static strings */
export function TextSplit(text: string, delimiter: string): string[] {
  const count = new Int32Array(1);
  const ptr = lib.TextSplit(
    cstr(text),
    delimiter.charCodeAt(0) || 0,
    Deno.UnsafePointer.of(count.buffer),
  );
  return readCStringArray(ptr, count[0]);
}

/** Append text at specific position and move cursor */
export function TextAppend(
  text: string,
  append: string,
  position: int = TextLength(text),
): { text: string; position: int } {
  const textBytes = cstr(text);
  const appendBytes = cstr(append);
  const buffer = new Uint8Array(textBytes.byteLength + appendBytes.byteLength);
  buffer.set(textBytes);
  const positionBuf = new Int32Array([position]);
  lib.TextAppend(
    buffer,
    appendBytes,
    Deno.UnsafePointer.of(positionBuf.buffer),
  );
  return {
    text: readCString(Deno.UnsafePointer.of(buffer)),
    position: positionBuf[0],
  };
}

/** Find first text occurrence within a string, -1 if not found */
export function TextFindIndex(text: string, search: string): int {
  return lib.TextFindIndex(cstr(text), cstr(search));
}

/** Get upper case version of provided string */
export function TextToUpper(text: string): string {
  return readCString(lib.TextToUpper(cstr(text)));
}

/** Get lower case version of provided string */
export function TextToLower(text: string): string {
  return readCString(lib.TextToLower(cstr(text)));
}

/** Get Pascal case notation version of provided string */
export function TextToPascal(text: string): string {
  return readCString(lib.TextToPascal(cstr(text)));
}

/** Get Snake case notation version of provided string */
export function TextToSnake(text: string): string {
  return readCString(lib.TextToSnake(cstr(text)));
}

/** Get Camel case notation version of provided string */
export function TextToCamel(text: string): string {
  return readCString(lib.TextToCamel(cstr(text)));
}

/** Get integer value from text */
export function TextToInteger(text: string): int {
  return lib.TextToInteger(cstr(text));
}

/** Get float value from text */
export function TextToFloat(text: string): float {
  return lib.TextToFloat(cstr(text));
}

// 3D Stuff

/** Draw a line in 3D world space */
export function DrawLine3D(
  startPos: Vector3,
  endPos: Vector3,
  color: Color,
): void {
  lib.DrawLine3D(startPos.buffer, endPos.buffer, color.buffer);
}

/** Draw a point in 3D space, actually a small line */
export function DrawPoint3D(position: Vector3, color: Color): void {
  lib.DrawPoint3D(position.buffer, color.buffer);
}

/** Draw a circle in 3D world space */
export function DrawCircle3D(
  center: Vector3,
  radius: float,
  rotationAxis: Vector3,
  rotationAngle: float,
  color: Color,
): void {
  lib.DrawCircle3D(
    center.buffer,
    radius,
    rotationAxis.buffer,
    rotationAngle,
    color.buffer,
  );
}

/** Draw a color-filled triangle (vertex in counter-clockwise order!) */
export function DrawTriangle3D(
  v1: Vector3,
  v2: Vector3,
  v3: Vector3,
  color: Color,
): void {
  const cross = (v2.x - v1.x) * (v3.y - v1.y) -
    (v2.y - v1.y) * (v3.x - v1.x);

  if (cross < 0) {
    lib.DrawTriangle3D(v1.buffer, v3.buffer, v2.buffer, color.buffer);
  } else {
    lib.DrawTriangle3D(v1.buffer, v2.buffer, v3.buffer, color.buffer);
  }
}

/** Draw a triangle strip defined by points */
export function DrawTriangleStrip3D(
  points: Vector3[],
  color: Color,
): void {
  const points_buffer = concatVector3(points);
  lib.DrawTriangleStrip3D(
    points_buffer.buffer as BufferSource,
    points.length,
    color.buffer,
  );
}

/** Draw cube */
export function DrawCube(
  position: Vector3,
  width: float,
  height: float,
  length: float,
  color: Color,
): void {
  lib.DrawCube(position.buffer, width, height, length, color.buffer);
}

/** Draw cube (Vector version) */
export function DrawCubeV(
  position: Vector3,
  size: Vector3,
  color: Color,
): void {
  lib.DrawCubeV(position.buffer, size.buffer, color.buffer);
}

/** Draw cube wires */
export function DrawCubeWires(
  position: Vector3,
  width: float,
  height: float,
  length: float,
  color: Color,
): void {
  lib.DrawCubeWires(position.buffer, width, height, length, color.buffer);
}

/** Draw cube wires (Vector version) */
export function DrawCubeWiresV(
  position: Vector3,
  size: Vector3,
  color: Color,
): void {
  lib.DrawCubeWiresV(position.buffer, size.buffer, color.buffer);
}

/** Draw sphere */
export function DrawSphere(
  center: Vector3,
  radius: float,
  color: Color,
): void {
  lib.DrawSphere(center.buffer, radius, color.buffer);
}

/** Draw sphere with extended parameters */
export function DrawSphereEx(
  center: Vector3,
  radius: float,
  rings: int,
  slices: int,
  color: Color,
): void {
  lib.DrawSphereEx(center.buffer, radius, rings, slices, color.buffer);
}

/** Draw sphere wires */
export function DrawSphereWires(
  center: Vector3,
  radius: float,
  rings: int,
  slices: int,
  color: Color,
): void {
  lib.DrawSphereWires(center.buffer, radius, rings, slices, color.buffer);
}

/** Draw a cylinder/cone */
export function DrawCylinder(
  center: Vector3,
  radius_top: float,
  radius_bottom: float,
  height: float,
  slices: int,
  color: Color,
): void {
  lib.DrawCylinder(
    center.buffer,
    radius_top,
    radius_bottom,
    height,
    slices,
    color.buffer,
  );
}

//RLAPI void DrawCylinderEx(Vector3 startPos, Vector3 endPos, float startRadius, float endRadius, int sides, Color color); // Draw a cylinder with base at startPos and top at endPos

/** Draw a cylinder with base at startPos and top at endPos */
export function DrawCylinderEx(
  startPos: Vector3,
  endPos: Vector3,
  radiusTop: float,
  radiusBottom: float,
  slices: int,
  color: Color,
): void {
  lib.DrawCylinderEx(
    startPos.buffer,
    endPos.buffer,
    radiusTop,
    radiusBottom,
    slices,
    color.buffer,
  );
}

/** Draw a cylinder/cone wires */
export function DrawCylinderWires(
  center: Vector3,
  radius_top: float,
  radius_bottom: float,
  height: float,
  slices: int,
  color: Color,
): void {
  lib.DrawCylinderWires(
    center.buffer,
    radius_top,
    radius_bottom,
    height,
    slices,
    color.buffer,
  );
}

/** Draw a cylinder wires with base at startPos and top at endPos */
export function DrawCylinderWiresEx(
  startPos: Vector3,
  endPos: Vector3,
  radiusTop: float,
  radiusBottom: float,
  slices: int,
  color: Color,
): void {
  lib.DrawCylinderWiresEx(
    startPos.buffer,
    endPos.buffer,
    radiusTop,
    radiusBottom,
    slices,
    color.buffer,
  );
}

//RLAPI void DrawCapsule(Vector3 startPos, Vector3 endPos, float radius, int slices, int rings, Color color); // Draw a capsule with the center of its sphere caps at startPos and endPos
/** Draw a capsule with the center of its sphere caps at startPos and endPos */
export function DrawCapsule(
  startPos: Vector3,
  endPos: Vector3,
  radius: float,
  slices: int,
  rings: int,
  color: Color,
): void {
  lib.DrawCapsule(
    startPos.buffer,
    endPos.buffer,
    radius,
    slices,
    rings,
    color.buffer,
  );
}

/** Draw capsule wireframe with the center of its sphere caps at startPos and endPos */
export function DrawCapsuleWires(
  startPos: Vector3,
  endPos: Vector3,
  radius: float,
  slices: int,
  rings: int,
  color: Color,
): void {
  lib.DrawCapsuleWires(
    startPos.buffer,
    endPos.buffer,
    radius,
    slices,
    rings,
    color.buffer,
  );
}

/** Draw a plane XZ */
export function DrawPlane(center: Vector3, size: Vector2, color: Color): void {
  lib.DrawPlane(center.buffer, size.buffer, color.buffer);
}

/** Draw a ray line */
export function DrawRay(ray: Ray, color: Color): void {
  lib.DrawRay(ray.buffer, color.buffer);
}

/** Draw a grid (centered at (0, 0, 0)) */
export function DrawGrid(slices: int, spacing: float): void {
  lib.DrawGrid(slices, spacing);
}

/** Load model from files (meshes and materials) */
export function LoadModel(fileName: string): Model {
  return new Model(lib.LoadModel(new TextEncoder().encode(fileName + "\0")));
}

/** Load model from generated mesh (default material) */
export function LoadModelFromMesh(mesh: Mesh): Model {
  return new Model(lib.LoadModelFromMesh(mesh.buffer));
}

/** Check if a model is valid (loaded in GPU, VAO/VBOs) */
export function IsModelValid(model: Model): boolean {
  return !!lib.IsModelValid(model.buffer);
}

/** Unload model (including meshes) from memory (RAM and/or VRAM) */
export function UnloadModel(model: Model): void {
  lib.UnloadModel(model.buffer);
}

/** Compute model bounding box limits (considers all meshes) */
export function GetModelBoundingBox(model: Model): BoundingBox {
  const buf = lib.GetModelBoundingBox(model.buffer);
  return BoundingBox.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Draw a model (with texture if set) */
export function DrawModel(
  model: Model,
  position: Vector3,
  scale: float,
  color: Color,
): void {
  lib.DrawModel(model.buffer, position.buffer, scale, color.buffer);
}

/** Draw a model with extended parameters */
export function DrawModelEx(
  model: Model,
  position: Vector3,
  rotationAxis: Vector3,
  rotationAngle: float,
  scale: Vector3,
  tint: Color,
): void {
  lib.DrawModelEx(
    model.buffer,
    position.buffer,
    rotationAxis.buffer,
    rotationAngle,
    scale.buffer,
    tint.buffer,
  );
}

/** Draw a model wires (with texture if set) */
export function DrawModelWires(
  model: Model,
  position: Vector3,
  scale: float,
  tint: Color,
): void {
  lib.DrawModelWires(
    model.buffer,
    position.buffer,
    scale,
    tint.buffer,
  );
}

/** Draw a model wires (with texture if set) with extended parameters */
export function DrawModelWiresEx(
  model: Model,
  position: Vector3,
  rotationAxis: Vector3,
  rotationAngle: float,
  scale: Vector3,
  tint: Color,
): void {
  lib.DrawModelWiresEx(
    model.buffer,
    position.buffer,
    rotationAxis.buffer,
    rotationAngle,
    scale.buffer,
    tint.buffer,
  );
}

/** DrawModelPoints exported by Deno Raylib. */
export function DrawModelPoints(
  model: Model,
  position: Vector3,
  scale: float,
  tint: Color,
): void {
  void model;
  void position;
  void scale;
  void tint;
  throw new Error("DrawModelPoints was removed from raylib 6.0");
}

/** DrawModelPointsEx exported by Deno Raylib. */
export function DrawModelPointsEx(
  model: Model,
  position: Vector3,
  rotationAxis: Vector3,
  rotationAngle: float,
  scale: Vector3,
  tint: Color,
): void {
  void model;
  void position;
  void rotationAxis;
  void rotationAngle;
  void scale;
  void tint;
  throw new Error("DrawModelPointsEx was removed from raylib 6.0");
}

/** Draw bounding box (wires) */
export function DrawBoundingBox(
  box: BoundingBox,
  color: Color,
): void {
  lib.DrawBoundingBox(
    box.buffer,
    color.buffer,
  );
}

/** Draw a billboard texture */
export function DrawBillboard(
  camera: Camera,
  texture: Texture2D,
  position: Vector3,
  scale: float,
  tint: Color,
): void {
  lib.DrawBillboard(
    camera.buffer,
    texture.buffer,
    position.buffer,
    scale,
    tint.buffer,
  );
}

/** Draw a billboard texture defined by source */
export function DrawBillboardRec(
  camera: Camera,
  texture: Texture2D,
  source: Rectangle,
  position: Vector3,
  size: Vector2,
  tint: Color,
): void {
  lib.DrawBillboardRec(
    camera.buffer,
    texture.buffer,
    source.buffer,
    position.buffer,
    size.buffer,
    tint.buffer,
  );
}

/** Draw a billboard texture defined by source and rotation */
export function DrawBillboardPro(
  camera: Camera,
  texture: Texture2D,
  source: Rectangle,
  position: Vector3,
  up: Vector3,
  size: Vector2,
  origin: Vector2,
  rotation: float,
  tint: Color,
): void {
  lib.DrawBillboardPro(
    camera.buffer,
    texture.buffer,
    source.buffer,
    position.buffer,
    up.buffer,
    size.buffer,
    origin.buffer,
    rotation,
    tint.buffer,
  );
}

/** Upload mesh vertex data in GPU and provide VAO/VBO ids */
export function UploadMesh(
  mesh: Mesh,
  dynamic: boolean,
): void {
  lib.UploadMesh(
    mesh.buffer,
    dynamic ? 1 : 0,
  );
}

/** Update mesh vertex data in GPU for a specific buffer index */
export function UpdateMeshBuffer(
  mesh: Mesh,
  index: int,
  data: ArrayBuffer,
  dataSize: int,
  offset: int,
): void {
  lib.UpdateMeshBuffer(
    mesh.buffer,
    index,
    Deno.UnsafePointer.of(data),
    dataSize,
    offset,
  );
}

/** Unload mesh data from CPU and GPU */
export function UnloadMesh(mesh: Mesh): void {
  lib.UnloadMesh(mesh.buffer);
}

/** Draw a 3d mesh with material and transform */
export function DrawMesh(
  mesh: Mesh,
  material: Material,
  transform: Matrix,
): void {
  lib.DrawMesh(
    mesh.buffer,
    material.buffer,
    transform.buffer,
  );
}

/** Draw multiple mesh instances with material and different transforms */
export function DrawMeshInstanced(
  mesh: Mesh,
  material: Material,
  transforms: Float32Array,
  instances: int,
): void {
  lib.DrawMeshInstanced(
    mesh.buffer,
    material.buffer,
    transforms.buffer as ArrayBuffer,
    instances,
  );
}

/** Compute mesh bounding box limits */
export function GetMeshBoundingBox(mesh: Mesh): BoundingBox {
  const buf = lib.GetMeshBoundingBox(mesh.buffer);
  return BoundingBox.fromBuffer(buf.buffer, buf.byteOffset);
}

/** Compute mesh tangents */
export function GenMeshTangents(mesh: Mesh): void {
  lib.GenMeshTangents(mesh.buffer);
}

/** Export mesh data to file, returns true on success */
export function ExportMesh(
  mesh: Mesh,
  fileName: string,
): boolean {
  return !!lib.ExportMesh(
    mesh.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

/** Export mesh as code file (.h) defining multiple arrays of vertex attributes */
export function ExportMeshAsCode(
  mesh: Mesh,
  fileName: string,
): boolean {
  return !!lib.ExportMeshAsCode(
    mesh.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

/** Generate polygonal mesh */
export function GenMeshPoly(
  sides: int,
  radius: float,
): Mesh {
  return new Mesh(
    lib.GenMeshPoly(
      sides,
      radius,
    ),
  );
}

/** Generate plane mesh (with subdivisions) */
export function GenMeshPlane(
  width: float,
  length: float,
  resX: int,
  resZ: int,
): Mesh {
  return new Mesh(
    lib.GenMeshPlane(
      width,
      length,
      resX,
      resZ,
    ),
  );
}

/** Generate cuboid mesh */
export function GenMeshCube(
  width: float,
  height: float,
  length: float,
): Mesh {
  return new Mesh(
    lib.GenMeshCube(
      width,
      height,
      length,
    ),
  );
}

/** Generate sphere mesh (standard sphere) */
export function GenMeshSphere(
  radius: float,
  rings: int,
  slices: int,
): Mesh {
  return new Mesh(
    lib.GenMeshSphere(
      radius,
      rings,
      slices,
    ),
  );
}

/** Generate half-sphere mesh (no bottom cap) */
export function GenMeshHemiSphere(
  radius: float,
  rings: int,
  slices: int,
): Mesh {
  return new Mesh(
    lib.GenMeshHemiSphere(
      radius,
      rings,
      slices,
    ),
  );
}

/** Generate cylinder mesh */
export function GenMeshCylinder(
  radius: float,
  height: float,
  slices: int,
): Mesh {
  return new Mesh(
    lib.GenMeshCylinder(
      radius,
      height,
      slices,
    ),
  );
}

/** Generate cone/pyramid mesh */
export function GenMeshCone(
  radius: float,
  height: float,
  slices: int,
): Mesh {
  return new Mesh(
    lib.GenMeshCone(
      radius,
      height,
      slices,
    ),
  );
}

/** Generate torus mesh */
export function GenMeshTorus(
  radius: float,
  size: float,
  radSeg: int,
  sides: int,
): Mesh {
  return new Mesh(
    lib.GenMeshTorus(
      radius,
      size,
      radSeg,
      sides,
    ),
  );
}

/** Generate trefoil knot mesh */
export function GenMeshKnot(
  radius: float,
  size: float,
  radSeg: int,
  sides: int,
): Mesh {
  return new Mesh(
    lib.GenMeshKnot(
      radius,
      size,
      radSeg,
      sides,
    ),
  );
}

/** Generate heightmap mesh from image data */
export function GenMeshHeightmap(
  heightmap: Image,
  size: Vector3,
): Mesh {
  return new Mesh(
    lib.GenMeshHeightmap(
      heightmap.buffer,
      size.buffer,
    ),
  );
}

/** Generate cubes-based map mesh from image data */
export function GenMeshCubicmap(
  cubicmap: Image,
  cubeSize: Vector3,
): Mesh {
  return new Mesh(
    lib.GenMeshCubicmap(
      cubicmap.buffer,
      cubeSize.buffer,
    ),
  );
}

/** Load materials from model file */
export function LoadMaterials(
  fileName: string,
): { materials: Material[]; count: int; ptr: Deno.PointerValue } {
  const countBuf = new Int32Array(1);

  const ptr = lib.LoadMaterials(
    new TextEncoder().encode(fileName + "\0").buffer,
    Deno.UnsafePointer.of(countBuf.buffer),
  );

  if (!ptr) {
    throw new Error("Failed to load materials");
  }

  const count = countBuf[0];
  const view = new Deno.UnsafePointerView(ptr);
  const buf = view.getArrayBuffer(count * Material.SIZE);

  const materials: Material[] = [];
  for (let i = 0; i < count; i++) {
    materials.push(
      new Material(
        new Uint8Array(buf, i * Material.SIZE, Material.SIZE) as Uint8Array<
          ArrayBuffer
        >,
      ),
    );
  }

  return { materials, count, ptr };
}

/** UnloadMaterials exported by Deno Raylib. */
export function UnloadMaterials(
  loaded: { materials: Material[]; ptr?: Deno.PointerValue } | Material[],
): void {
  const materials = Array.isArray(loaded) ? loaded : loaded.materials;
  for (const material of materials) lib.UnloadMaterial(material.buffer);

  if (
    !Array.isArray(loaded) && loaded.ptr !== undefined && loaded.ptr !== null
  ) {
    lib.MemFree(loaded.ptr);
  }
}

/** Load default material (Supports: DIFFUSE, SPECULAR, NORMAL maps) */
export function LoadMaterialDefault(): Material {
  return new Material(
    lib.LoadMaterialDefault(),
  );
}

/** Check if a material is valid (shader assigned, map textures loaded in GPU) */
export function IsMaterialValid(material: Material): boolean {
  return !!lib.IsMaterialValid(material.buffer);
}

/** Unload material from GPU memory (VRAM) */
export function UnloadMaterial(material: Material): void {
  lib.UnloadMaterial(material.buffer);
}

/** Set texture for a material map type (MATERIAL_MAP_DIFFUSE, MATERIAL_MAP_SPECULAR...) */
export function SetMaterialTexture(
  material: Material,
  mapType: int,
  texture: Texture2D,
): void {
  lib.SetMaterialTexture(
    material.buffer,
    mapType,
    texture.buffer,
  );
}

/** Set material for a mesh */
export function SetModelMeshMaterial(
  model: Model,
  meshId: int,
  materialId: int,
): void {
  lib.SetModelMeshMaterial(
    model.buffer,
    meshId,
    materialId,
  );
}

/** Load model animations from file */
export function LoadModelAnimations(
  fileName: string,
): { animations: ModelAnimation[]; count: int } {
  const countBuf = new Int32Array(1);

  const ptr = lib.LoadModelAnimations(
    new TextEncoder().encode(fileName + "\0").buffer,
    Deno.UnsafePointer.of(countBuf.buffer),
  );

  if (!ptr) {
    throw new Error("Failed to load model animations");
  }

  const count = countBuf[0];
  const view = new Deno.UnsafePointerView(ptr);
  const buf = view.getArrayBuffer(count * ModelAnimation.SIZE);

  const animations: ModelAnimation[] = [];
  for (let i = 0; i < count; i++) {
    animations.push(
      new ModelAnimation(
        new Uint8Array(
          buf,
          i * ModelAnimation.SIZE,
          ModelAnimation.SIZE,
        ) as Uint8Array<ArrayBuffer>,
      ),
    );
  }

  return { animations, count };
}

/** Update model animation pose (vertex buffers and bone matrices) */
export function UpdateModelAnimation(
  model: Model,
  anim: ModelAnimation,
  frame: float,
): void {
  lib.UpdateModelAnimation(
    model.buffer,
    anim.buffer,
    frame,
  );
}

/** UpdateModelAnimationBones exported by Deno Raylib. */
export function UpdateModelAnimationBones(
  model: Model,
  anim: ModelAnimation,
  frame: float,
): void {
  UpdateModelAnimation(model, anim, frame);
}

/** Update model animation pose, blending two animations */
export function UpdateModelAnimationEx(
  model: Model,
  animA: ModelAnimation,
  frameA: float,
  animB: ModelAnimation,
  frameB: float,
  blend: float,
): void {
  lib.UpdateModelAnimationEx(
    model.buffer,
    animA.buffer,
    frameA,
    animB.buffer,
    frameB,
    blend,
  );
}

/** UnloadModelAnimation exported by Deno Raylib. */
export function UnloadModelAnimation(anim: ModelAnimation): void {
  void anim;
  throw new Error(
    "UnloadModelAnimation was removed from raylib 6.0; use UnloadModelAnimations",
  );
}

/** Unload animation array data */
export function UnloadModelAnimations(
  animations: ModelAnimation[],
): void {
  if (animations.length === 0) return;

  lib.UnloadModelAnimations(
    animations[0].buffer,
    animations.length,
  );
}

/** Check model animation skeleton match */
export function IsModelAnimationValid(
  model: Model,
  anim: ModelAnimation,
): boolean {
  return !!lib.IsModelAnimationValid(
    model.buffer,
    anim.buffer,
  );
}

/** Check collision between two spheres */
export function CheckCollisionSpheres(
  center1: Vector3,
  radius1: float,
  center2: Vector3,
  radius2: float,
): boolean {
  return !!lib.CheckCollisionSpheres(
    center1.buffer,
    radius1,
    center2.buffer,
    radius2,
  );
}

/** Check collision between two bounding boxes */
export function CheckCollisionBoxes(
  box1: BoundingBox,
  box2: BoundingBox,
): boolean {
  return !!lib.CheckCollisionBoxes(
    box1.buffer,
    box2.buffer,
  );
}

/** Check collision between box and sphere */
export function CheckCollisionBoxSphere(
  box: BoundingBox,
  center: Vector3,
  radius: float,
): boolean {
  return !!lib.CheckCollisionBoxSphere(
    box.buffer,
    center.buffer,
    radius,
  );
}

/** Get collision info between ray and sphere */
export function GetRayCollisionSphere(
  ray: Ray,
  center: Vector3,
  radius: float,
): RayCollision {
  return new RayCollision(
    lib.GetRayCollisionSphere(
      ray.buffer,
      center.buffer,
      radius,
    ),
  );
}

/** Get collision info between ray and box */
export function GetRayCollisionBox(
  ray: Ray,
  box: BoundingBox,
): RayCollision {
  return new RayCollision(
    lib.GetRayCollisionBox(
      ray.buffer,
      box.buffer,
    ),
  );
}

/** Get collision info between ray and mesh */
export function GetRayCollisionMesh(
  ray: Ray,
  mesh: Mesh,
  transform: Matrix,
): RayCollision {
  return new RayCollision(
    lib.GetRayCollisionMesh(
      ray.buffer,
      mesh.buffer,
      transform.buffer,
    ),
  );
}

/** Get collision info between ray and triangle */
export function GetRayCollisionTriangle(
  ray: Ray,
  p1: Vector3,
  p2: Vector3,
  p3: Vector3,
): RayCollision {
  return new RayCollision(
    lib.GetRayCollisionTriangle(
      ray.buffer,
      p1.buffer,
      p2.buffer,
      p3.buffer,
    ),
  );
}

/** Get collision info between ray and quad */
export function GetRayCollisionQuad(
  ray: Ray,
  p1: Vector3,
  p2: Vector3,
  p3: Vector3,
  p4: Vector3,
): RayCollision {
  return new RayCollision(
    lib.GetRayCollisionQuad(
      ray.buffer,
      p1.buffer,
      p2.buffer,
      p3.buffer,
      p4.buffer,
    ),
  );
}

/** Initialize audio device and context */
export function InitAudioDevice(): void {
  lib.InitAudioDevice();
}

/** Close the audio device and context */
export function CloseAudioDevice(): void {
  lib.CloseAudioDevice();
}

/** Check if audio device has been initialized successfully */
export function IsAudioDeviceReady(): boolean {
  return !!lib.IsAudioDeviceReady();
}

/** Set master volume (listener) */
export function SetMasterVolume(volume: float): void {
  lib.SetMasterVolume(volume);
}

/** Get master volume (listener) */
export function GetMasterVolume(): float {
  return lib.GetMasterVolume();
}

/** Load wave data from file */
export function LoadWave(fileName: string): Wave {
  const buf = lib.LoadWave(new TextEncoder().encode(fileName + "\0").buffer);
  if (!buf) throw new Error("Failed to load wave");
  return new Wave(buf);
}

/** Load wave from memory buffer, fileType refers to extension: i.e. '.wav' */
export function LoadWaveFromMemory(
  fileType: string,
  fileData: Uint8Array,
): Wave {
  const buf = lib.LoadWaveFromMemory(
    new TextEncoder().encode(fileType + "\0").buffer,
    fileData.buffer as ArrayBuffer,
    fileData.byteLength,
  );
  if (!buf) throw new Error("Failed to load wave from memory");
  return new Wave(buf);
}

/** Checks if wave data is valid (data loaded and parameters) */
export function IsWaveValid(wave: Wave): boolean {
  return !!lib.IsWaveValid(wave.buffer);
}

/** Load sound from file */
export function LoadSound(fileName: string): Sound {
  const buf = lib.LoadSound(new TextEncoder().encode(fileName + "\0").buffer);
  if (!buf) throw new Error("Failed to load sound");
  return new Sound(buf);
}

/** Load sound from wave data */
export function LoadSoundFromWave(wave: Wave): Sound {
  const buf = lib.LoadSoundFromWave(wave.buffer);
  if (!buf) throw new Error("Failed to load sound from wave");
  return new Sound(buf);
}

/** Create a new sound that shares the same sample data as the source sound, does not own the sound data */
export function LoadSoundAlias(source: Sound): Sound {
  const buf = lib.LoadSoundAlias(source.buffer);
  if (!buf) throw new Error("Failed to load sound alias");
  return new Sound(buf);
}

/** Checks if a sound is valid (data loaded and buffers initialized) */
export function IsSoundValid(sound: Sound): boolean {
  return !!lib.IsSoundValid(sound.buffer);
}

/** Update sound buffer with new data (default data format: 32 bit float, stereo) */
export function UpdateSound(
  sound: Sound,
  data: BufferSource,
  sampleCount: int,
): void {
  lib.UpdateSound(
    sound.buffer,
    Deno.UnsafePointer.of(data as ArrayBuffer),
    sampleCount,
  );
}

/** Unload wave data */
export function UnloadWave(wave: Wave): void {
  lib.UnloadWave(wave.buffer);
}

/** Unload sound */
export function UnloadSound(sound: Sound): void {
  lib.UnloadSound(sound.buffer);
}

/** Unload a sound alias (does not deallocate sample data) */
export function UnloadSoundAlias(alias: Sound): void {
  lib.UnloadSoundAlias(alias.buffer);
}

/** Export wave data to file, returns true on success */
export function ExportWave(
  wave: Wave,
  fileName: string,
): boolean {
  return !!lib.ExportWave(
    wave.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

/** Export wave sample data to code (.h), returns true on success */
export function ExportWaveAsCode(
  wave: Wave,
  fileName: string,
): boolean {
  return !!lib.ExportWaveAsCode(
    wave.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

/** Play a sound */
export function PlaySound(sound: Sound): void {
  lib.PlaySound(sound.buffer);
}

/** Stop playing a sound */
export function StopSound(sound: Sound): void {
  lib.StopSound(sound.buffer);
}

/** Pause a sound */
export function PauseSound(sound: Sound): void {
  lib.PauseSound(sound.buffer);
}

/** Resume a paused sound */
export function ResumeSound(sound: Sound): void {
  lib.ResumeSound(sound.buffer);
}

/** Check if a sound is currently playing */
export function IsSoundPlaying(sound: Sound): boolean {
  return !!lib.IsSoundPlaying(sound.buffer);
}

/** Set volume for a sound (1.0 is max level) */
export function SetSoundVolume(sound: Sound, volume: float): void {
  lib.SetSoundVolume(sound.buffer, volume);
}

/** Set pitch for a sound (1.0 is base level) */
export function SetSoundPitch(sound: Sound, pitch: float): void {
  lib.SetSoundPitch(sound.buffer, pitch);
}

/** Set pan for a sound (-1.0 left, 0.0 center, 1.0 right) */
export function SetSoundPan(sound: Sound, pan: float): void {
  lib.SetSoundPan(sound.buffer, pan);
}

/** Copy a wave to a new wave */
export function WaveCopy(wave: Wave): Wave {
  return new Wave(
    lib.WaveCopy(wave.buffer),
  );
}

/** Crop a wave to defined frames range */
export function WaveCrop(
  wave: Wave,
  initFrame: int,
  finalFrame: int,
): void {
  lib.WaveCrop(
    wave.buffer,
    initFrame,
    finalFrame,
  );
}

/** Convert wave data to desired format */
export function WaveFormat(
  wave: Wave,
  sampleRate: int,
  sampleSize: int,
  channels: int,
): void {
  lib.WaveFormat(
    wave.buffer,
    sampleRate,
    sampleSize,
    channels,
  );
}

/** Load samples data from wave as a 32bit float data array */
export function LoadWaveSamples(wave: Wave): Float32Array {
  const ptr = lib.LoadWaveSamples(wave.buffer);
  const sampleCount = wave.frameCount * wave.channels;

  if (!ptr) throw new Error("Failed to load wave samples");

  const view = new Deno.UnsafePointerView(ptr);
  const buf = view.getArrayBuffer(sampleCount * 4);
  const samples = new Float32Array(sampleCount);
  samples.set(new Float32Array(buf));
  lib.UnloadWaveSamples(ptr);
  return samples;
}

/** Unload samples data loaded with LoadWaveSamples() */
export function UnloadWaveSamples(samples: Float32Array): void {
  void samples;
}

/** Load music stream from file */
export function LoadMusicStream(fileName: string): Music {
  return new Music(
    lib.LoadMusicStream(
      new TextEncoder().encode(fileName + "\0").buffer,
    ),
  );
}

/** Load music stream from data */
export function LoadMusicStreamFromMemory(
  fileType: string,
  data: Uint8Array,
): Music {
  return new Music(
    lib.LoadMusicStreamFromMemory(
      new TextEncoder().encode(fileType + "\0").buffer,
      data.buffer as ArrayBuffer,
      data.byteLength,
    ),
  );
}

/** Checks if a music stream is valid (context and buffers initialized) */
export function IsMusicValid(music: Music): boolean {
  return !!lib.IsMusicValid(music.buffer);
}

/** Unload music stream */
export function UnloadMusicStream(music: Music): void {
  lib.UnloadMusicStream(music.buffer);
}

/** Start music playing */
export function PlayMusicStream(music: Music): void {
  lib.PlayMusicStream(music.buffer);
}

/** Check if music is playing */
export function IsMusicStreamPlaying(music: Music): boolean {
  return !!lib.IsMusicStreamPlaying(music.buffer);
}

/** Updates buffers for music streaming */
export function UpdateMusicStream(music: Music): void {
  lib.UpdateMusicStream(music.buffer);
}

/** Stop music playing */
export function StopMusicStream(music: Music): void {
  lib.StopMusicStream(music.buffer);
}

/** Pause music playing */
export function PauseMusicStream(music: Music): void {
  lib.PauseMusicStream(music.buffer);
}

/** Resume playing paused music */
export function ResumeMusicStream(music: Music): void {
  lib.ResumeMusicStream(music.buffer);
}

/** Seek music to a position (in seconds) */
export function SeekMusicStream(music: Music, position: float): void {
  lib.SeekMusicStream(music.buffer, position);
}

/** Set volume for music (1.0 is max level) */
export function SetMusicVolume(music: Music, volume: float): void {
  lib.SetMusicVolume(music.buffer, volume);
}

/** Set pitch for a music (1.0 is base level) */
export function SetMusicPitch(music: Music, pitch: float): void {
  lib.SetMusicPitch(music.buffer, pitch);
}

/** Set pan for a music (-1.0 left, 0.0 center, 1.0 right) */
export function SetMusicPan(music: Music, pan: float): void {
  lib.SetMusicPan(music.buffer, pan);
}

/** Get music time length (in seconds) */
export function GetMusicTimeLength(music: Music): float {
  return lib.GetMusicTimeLength(music.buffer);
}

/** Get current music time played (in seconds) */
export function GetMusicTimePlayed(music: Music): float {
  return lib.GetMusicTimePlayed(music.buffer);
}

/** Load audio stream (to stream raw audio pcm data) */
export function LoadAudioStream(
  sampleRate: int,
  sampleSize: int,
  channels: int,
): AudioStream {
  return new AudioStream(
    lib.LoadAudioStream(
      sampleRate,
      sampleSize,
      channels,
    ),
  );
}

/** Checks if an audio stream is valid (buffers initialized) */
export function IsAudioStreamValid(stream: AudioStream): boolean {
  return !!lib.IsAudioStreamValid(stream.buffer);
}

/** Unload audio stream and free memory */
export function UnloadAudioStream(stream: AudioStream): void {
  lib.UnloadAudioStream(stream.buffer);
}

/** Update audio stream buffers with data */
export function UpdateAudioStream(
  stream: AudioStream,
  data: BufferSource,
  frameCount: int,
): void {
  lib.UpdateAudioStream(
    stream.buffer,
    Deno.UnsafePointer.of(data),
    frameCount,
  );
}

/** Check if any audio stream buffers requires refill */
export function IsAudioStreamProcessed(stream: AudioStream): boolean {
  return !!lib.IsAudioStreamProcessed(stream.buffer);
}

/** Play audio stream */
export function PlayAudioStream(stream: AudioStream): void {
  lib.PlayAudioStream(stream.buffer);
}

/** Pause audio stream */
export function PauseAudioStream(stream: AudioStream): void {
  lib.PauseAudioStream(stream.buffer);
}

/** Resume audio stream */
export function ResumeAudioStream(stream: AudioStream): void {
  lib.ResumeAudioStream(stream.buffer);
}

/** Check if audio stream is playing */
export function IsAudioStreamPlaying(stream: AudioStream): boolean {
  return !!lib.IsAudioStreamPlaying(stream.buffer);
}

/** Stop audio stream */
export function StopAudioStream(stream: AudioStream): void {
  lib.StopAudioStream(stream.buffer);
}

/** Set volume for audio stream (1.0 is max level) */
export function SetAudioStreamVolume(
  stream: AudioStream,
  volume: float,
): void {
  lib.SetAudioStreamVolume(stream.buffer, volume);
}

/** Set pitch for audio stream (1.0 is base level) */
export function SetAudioStreamPitch(
  stream: AudioStream,
  pitch: float,
): void {
  lib.SetAudioStreamPitch(stream.buffer, pitch);
}

/** Set pan for audio stream (-1.0 to 1.0 range, 0.0 is centered) */
export function SetAudioStreamPan(
  stream: AudioStream,
  pan: float,
): void {
  lib.SetAudioStreamPan(stream.buffer, pan);
}

/** Default size for new audio streams */
export function SetAudioStreamBufferSizeDefault(size: int): void {
  lib.SetAudioStreamBufferSizeDefault(size);
}

const audioStreamCallbacks = new WeakMap<
  AudioStream,
  Deno.UnsafeCallback<AudioCallbackDef>
>();

/** Set an audio callback using a thread-safe bridge for raylib's audio thread. */
export async function SetAudioStreamCallback(
  stream: AudioStream,
  callback:
    | ((buffer: Deno.PointerValue, frames: int) => void)
    | Deno.PointerValue,
): Promise<Deno.UnsafeCallback<AudioCallbackDef> | undefined> {
  const previous = audioStreamCallbacks.get(stream);
  if (typeof callback === "function") {
    const bridge = Deno.UnsafeCallback.threadSafe<AudioCallbackDef>(
      { parameters: ["pointer", "u32"], result: "void" },
      (buffer, frames) => callback(buffer, frames as int),
    );
    await audioControl.SetAudioStreamCallback(stream.buffer, bridge.pointer);
    audioStreamCallbacks.set(stream, bridge);
    previous?.close();
    return bridge;
  }

  await audioControl.SetAudioStreamCallback(stream.buffer, callback);
  audioStreamCallbacks.delete(stream);
  previous?.close();
  return undefined;
}

/** AudioCallbackDef exported by Deno Raylib. */
export type AudioCallbackDef = {
  parameters: ["pointer", "u32"];
  result: "void";
};

const audioProcessors = new Set<Deno.UnsafeCallback<AudioCallbackDef>>();

/** Attach audio stream processor to stream, receives frames x 2 samples as 'float' (stereo) */
export function AttachAudioStreamProcessor(
  stream: AudioStream,
  processor: (buffer: Deno.PointerObject, frames: int) => void,
): Deno.UnsafeCallback<AudioCallbackDef> {
  const cb = Deno.UnsafeCallback.threadSafe<AudioCallbackDef>(
    { parameters: ["pointer", "u32"], result: "void" },
    (buf, frames) => {
      if (buf === null) return;
      processor(buf, frames as int);
    },
  );

  audioProcessors.add(cb);
  lib.AttachAudioStreamProcessor(stream.buffer, cb.pointer);

  return cb;
}

/** Detach audio stream processor from stream */
export async function DetachAudioStreamProcessor(
  stream: AudioStream,
  processor: Deno.UnsafeCallback<AudioCallbackDef>,
): Promise<void> {
  await audioControl.DetachAudioStreamProcessor(
    stream.buffer,
    processor.pointer,
  );
  audioProcessors.delete(processor);
  processor.close();
}

/** Attach audio stream processor to the entire audio pipeline, receives frames x 2 samples as 'float' (stereo) */
export function AttachAudioMixedProcessor(
  processor: (buffer: Deno.PointerObject, frames: int) => void,
): Deno.UnsafeCallback<AudioCallbackDef> {
  const cb = Deno.UnsafeCallback.threadSafe<AudioCallbackDef>(
    { parameters: ["pointer", "u32"], result: "void" },
    (buf, frames) => {
      if (buf === null) return;
      processor(buf, frames as int);
    },
  );

  audioProcessors.add(cb);
  lib.AttachAudioMixedProcessor(cb.pointer);

  return cb;
}

/** Detach audio stream processor from the entire audio pipeline */
export async function DetachAudioMixedProcessor(
  processor: Deno.UnsafeCallback<AudioCallbackDef>,
): Promise<void> {
  await audioControl.DetachAudioMixedProcessor(processor.pointer);
  audioProcessors.delete(processor);
  processor.close();
}

//-----------------------------------------------------------------------
// RL MATH API
//-----------------------------------------------------------------------

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
