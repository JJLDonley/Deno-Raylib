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

export type float = number;
export type int = number;
export type bool = boolean;
export type char = string;

/** Raw 1:1 Deno FFI symbols for advanced APIs that require pointer handling. */
export const native = DLL.symbols;
const lib = native;
const audioControl = AUDIO_CONTROL_DLL.symbols;
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

export const RAYLIB_VERSION_MAJOR = 6;
export const RAYLIB_VERSION_MINOR = 0;
export const RAYLIB_VERSION_PATCH = 0;
export const RAYLIB_VERSION = "6.0";

/** Whether or not this computer is little or big endian */
export const littleEndian: bool = (() => {
  // Stolen from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
})();

export function concatVector2(vectors: Vector2[]): Float32Array {
  const vecs = new Float32Array(vectors.length * 2);
  for (let i = 0; i < vectors.length; i++) {
    vecs[i * 2] = vectors[i].x;
    vecs[i * 2 + 1] = vectors[i].y;
  }
  return vecs;
}

export function concatVector3(vectors: Vector3[]): Float32Array {
  const vecs = new Float32Array(vectors.length * 3);
  for (let i = 0; i < vectors.length; i++) {
    vecs[i * 3] = vectors[i].x;
    vecs[i * 3 + 1] = vectors[i].y;
    vecs[i * 3 + 2] = vectors[i].z;
  }
  return vecs;
}

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

export enum ConfigFlags {
  VSYNC_HINT = 0x00000040, // Set to try enabling V-Sync on GPU
  FULLSCREEN_MODE = 0x00000002, // Set to run program in fullscreen
  RESIZABLE = 0x00000004, // Set to allow resizable window
  UNDECORATED = 0x00000008, // Set to disable window decoration (frame and buttons)
  HIDDEN = 0x00000080, // Set to hide window
  MINIMIZED = 0x00000200, // Set to minimize window (iconify)
  MAXIMIZED = 0x00000400, // Set to maximize window (expanded to monitor)
  UNFOCUSED = 0x00000800, // Set to window non focused
  TOPMOST = 0x00001000, // Set to window always on top
  ALWAYS_RUN = 0x00000100, // Set to allow windows running while minimized
  TRANSPARENT = 0x00000010, // Set to allow transparent framebuffer
  HIGHDPI = 0x00002000, // Set to support HighDPI
  MOUSE_PASSTHROUGH = 0x00004000, // Set to support mouse passthrough, only supported when WINDOW_UNDECORATED
  BORDERLESS = 0x00008000, // Set to run program in borderless windowed mode
  MSAA_4X_HINT = 0x00000020, // Set to try enabling MSAA 4X
  INTERLACED_HINT = 0x00010000, // Set to try enabling interlaced video format (for V3D)
}

export enum TraceLogLevel {
  ALL = 0, // Display all logs
  TRACE, // Trace logging, intended for internal use only
  DEBUG, // Debug logging, used for internal debugging, it should be disabled on release builds
  INFO, // Info logging, used for program execution info
  WARNING, // Warning logging, used on recoverable failures
  ERROR, // Error logging, used on unrecoverable failures
  FATAL, // Fatal logging, used to abort program: exit(EXIT_FAILURE)
  NONE, // Disable logging
}

export enum KeyboardKey {
  NULL = 0, // Key: NULL, used for no key pressed
  // Alphanumeric keys
  APOSTROPHE = 39, // Key: '
  COMMA = 44, // Key: ,
  MINUS = 45, // Key: -
  PERIOD = 46, // Key: .
  SLASH = 47, // Key: /
  ZERO = 48, // Key: 0
  ONE = 49, // Key: 1
  TWO = 50, // Key: 2
  THREE = 51, // Key: 3
  FOUR = 52, // Key: 4
  FIVE = 53, // Key: 5
  SIX = 54, // Key: 6
  SEVEN = 55, // Key: 7
  EIGHT = 56, // Key: 8
  NINE = 57, // Key: 9
  SEMICOLON = 59, // Key: ;
  EQUAL = 61, // Key: =
  A = 65, // Key: A | a
  B = 66, // Key: B | b
  C = 67, // Key: C | c
  D = 68, // Key: D | d
  E = 69, // Key: E | e
  F = 70, // Key: F | f
  G = 71, // Key: G | g
  H = 72, // Key: H | h
  I = 73, // Key: I | i
  J = 74, // Key: J | j
  K = 75, // Key: K | k
  L = 76, // Key: L | l
  M = 77, // Key: M | m
  N = 78, // Key: N | n
  O = 79, // Key: O | o
  P = 80, // Key: P | p
  Q = 81, // Key: Q | q
  R = 82, // Key: R | r
  S = 83, // Key: S | s
  T = 84, // Key: T | t
  U = 85, // Key: U | u
  V = 86, // Key: V | v
  W = 87, // Key: W | w
  X = 88, // Key: X | x
  Y = 89, // Key: Y | y
  Z = 90, // Key: Z | z
  LEFT_BRACKET = 91, // Key: [
  BACKSLASH = 92, // Key: '\'
  RIGHT_BRACKET = 93, // Key: ]
  GRAVE = 96, // Key: `
  // Function keys
  SPACE = 32, // Key: Space
  ESCAPE = 256, // Key: Esc
  ENTER = 257, // Key: Enter
  TAB = 258, // Key: Tab
  BACKSPACE = 259, // Key: Backspace
  INSERT = 260, // Key: Ins
  DELETE = 261, // Key: Del
  RIGHT = 262, // Key: Cursor right
  LEFT = 263, // Key: Cursor left
  DOWN = 264, // Key: Cursor down
  UP = 265, // Key: Cursor up
  PAGE_UP = 266, // Key: Page up
  PAGE_DOWN = 267, // Key: Page down
  HOME = 268, // Key: Home
  END = 269, // Key: End
  CAPS_LOCK = 280, // Key: Caps lock
  SCROLL_LOCK = 281, // Key: Scroll down
  NUM_LOCK = 282, // Key: Num lock
  PRINT_SCREEN = 283, // Key: Print screen
  PAUSE = 284, // Key: Pause
  F1 = 290, // Key: F1
  F2 = 291, // Key: F2
  F3 = 292, // Key: F3
  F4 = 293, // Key: F4
  F5 = 294, // Key: F5
  F6 = 295, // Key: F6
  F7 = 296, // Key: F7
  F8 = 297, // Key: F8
  F9 = 298, // Key: F9
  F10 = 299, // Key: F10
  F11 = 300, // Key: F11
  F12 = 301, // Key: F12
  LEFT_SHIFT = 340, // Key: Shift left
  LEFT_CONTROL = 341, // Key: Control left
  LEFT_ALT = 342, // Key: Alt left
  LEFT_SUPER = 343, // Key: Super left
  RIGHT_SHIFT = 344, // Key: Shift right
  RIGHT_CONTROL = 345, // Key: Control right
  RIGHT_ALT = 346, // Key: Alt right
  RIGHT_SUPER = 347, // Key: Super right
  KB_MENU = 348, // Key: KB menu
  // Keypad keys
  KP_0 = 320, // Key: Keypad 0
  KP_1 = 321, // Key: Keypad 1
  KP_2 = 322, // Key: Keypad 2
  KP_3 = 323, // Key: Keypad 3
  KP_4 = 324, // Key: Keypad 4
  KP_5 = 325, // Key: Keypad 5
  KP_6 = 326, // Key: Keypad 6
  KP_7 = 327, // Key: Keypad 7
  KP_8 = 328, // Key: Keypad 8
  KP_9 = 329, // Key: Keypad 9
  KP_DECIMAL = 330, // Key: Keypad .
  KP_DIVIDE = 331, // Key: Keypad /
  KP_MULTIPLY = 332, // Key: Keypad *
  KP_SUBTRACT = 333, // Key: Keypad -
  KP_ADD = 334, // Key: Keypad +
  KP_ENTER = 335, // Key: Keypad Enter
  KP_EQUAL = 336, // Key: Keypad =
  // Android key buttons
  BACK = 4, // Key: Android back button
  MENU = 5, // Key: Android menu button
  VOLUME_UP = 24, // Key: Android volume up button
  VOLUME_DOWN = 25, // Key: Android volume down button
}

export enum MouseButton {
  LEFT = 0, // Mouse button left
  RIGHT = 1, // Mouse button right
  MIDDLE = 2, // Mouse button middle (pressed wheel)
  SIDE = 3, // Mouse button side (advanced mouse device)
  EXTRA = 4, // Mouse button extra (advanced mouse device)
  FORWARD = 5, // Mouse button forward (advanced mouse device)
  BACK = 6, // Mouse button back (advanced mouse device)
}

export enum MouseCursor {
  DEFAULT = 0, // Default pointer shape
  ARROW = 1, // Arrow shape
  IBEAM = 2, // Text writing cursor shape
  CROSSHAIR = 3, // Cross shape
  POINTING_HAND = 4, // Pointing hand cursor
  RESIZE_EW = 5, // Horizontal resize/move arrow shape
  RESIZE_NS = 6, // Vertical resize/move arrow shape
  RESIZE_NWSE = 7, // Top-left to bottom-right diagonal resize/move arrow shape
  RESIZE_NESW = 8, // The top-right to bottom-left diagonal resize/move arrow shape
  RESIZE_ALL = 9, // The omnidirectional resize/move cursor shape
  NOT_ALLOWED = 10, // The operation-not-allowed shape
}

export enum GamepadButton {
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

export enum GamepadAxis {
  LEFT_X = 0, // Gamepad left stick X axis
  LEFT_Y = 1, // Gamepad left stick Y axis
  RIGHT_X = 2, // Gamepad right stick X axis
  RIGHT_Y = 3, // Gamepad right stick Y axis
  LEFT_TRIGGER = 4, // Gamepad back trigger left, pressure level: [1..-1]
  RIGHT_TRIGGER = 5, // Gamepad back trigger right, pressure level: [1..-1]
}

export enum MaterialMapIndex {
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

export enum ShaderLocationIndex {
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
  MATRIX_BONETRANSFORMS = 28, // Shader location: array of matrices uniform: bone transforms
  VERTEX_INSTANCETRANSFORM, // Shader location: vertex attribute: instance transform
}

export enum ShaderUniformDataType {
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

export enum ShaderAttributeDataType {
  FLOAT = 0, // Shader attribute type: float
  VEC2, // Shader attribute type: vec2 (2 float)
  VEC3, // Shader attribute type: vec3 (3 float)
  VEC4, // Shader attribute type: vec4 (4 float)
}

export enum PixelFormat {
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

export enum TextureFilter {
  POINT = 0, // No filter, just pixel approximation
  BILINEAR, // Linear filtering
  TRILINEAR, // Trilinear filtering (linear with mipmaps)
  ANISOTROPIC_4X, // Anisotropic filtering 4x
  ANISOTROPIC_8X, // Anisotropic filtering 8x
  ANISOTROPIC_16X, // Anisotropic filtering 16x
}

export enum TextureWrap {
  REPEAT = 0, // Repeats texture in tiled mode
  CLAMP, // Clamps texture to edge pixel in tiled mode
  MIRROR_REPEAT, // Mirrors and repeats the texture in tiled mode
  MIRROR_CLAMP, // Mirrors and clamps to border the texture in tiled mode
}

export enum CubemapLayout {
  AUTO_DETECT = 0, // Automatically detect layout type
  LINE_VERTICAL, // Layout is defined by a vertical line with faces
  LINE_HORIZONTAL, // Layout is defined by a horizontal line with faces
  CROSS_THREE_BY_FOUR, // Layout is defined by a 3x4 cross with cubemap faces
  CROSS_FOUR_BY_THREE, // Layout is defined by a 4x3 cross with cubemap faces
}

export enum FontType {
  DEFAULT = 0, // Default font generation, anti-aliased
  BITMAP, // Bitmap font generation, no anti-aliasing
  SDF, // SDF font generation, requires external shader
}

export enum BlendMode {
  ALPHA = 0, // Blend textures considering alpha (default)
  ADDITIVE, // Blend textures adding colors
  MULTIPLIED, // Blend textures multiplying colors
  ADD_COLORS, // Blend textures adding colors (alternative)
  SUBTRACT_COLORS, // Blend textures subtracting colors (alternative)
  ALPHA_PREMULTIPLY, // Blend premultiplied textures considering alpha
  CUSTOM, // Blend textures using custom src/dst factors (use rlSetBlendFactors())
  CUSTOM_SEPARATE, // Blend textures using custom rgb/alpha separate src/dst factors (use rlSetBlendFactorsSeparate())
}

export enum Gesture {
  NONE = 0, // No gesture
  TAP = 1, // Tap gesture
  DOUBLETAP = 2, // Double tap gesture
  HOLD = 4, // Hold gesture
  DRAG = 8, // Drag gesture
  SWIPE_RIGHT = 16, // Swipe right gesture
  SWIPE_LEFT = 32, // Swipe left gesture
  SWIPE_UP = 64, // Swipe up gesture
  SWIPE_DOWN = 128, // Swipe down gesture
  PINCH_IN = 256, // Pinch in gesture
  PINCH_OUT = 512, // Pinch out gesture
}

export enum CameraMode {
  CUSTOM = 0, // Camera custom, controlled by user (UpdateCamera() does nothing)
  FREE, // Camera free mode
  ORBITAL, // Camera orbital, around target, zoom supported
  FIRST_PERSON, // Camera first person
  THIRD_PERSON, // Camera third person
}

export enum CameraProjection {
  PERSPECTIVE = 0, // Perspective projection
  ORTHOGRAPHIC, // Orthographic projection
}

export enum NPatchLayout {
  NINE_PATCH = 0, // Npatch layout: 3x3 tiles
  THREE_PATCH_VERTICAL, // Npatch layout: 1x3 tiles
  THREE_PATCH_HORIZONTAL, // Npatch layout: 3x1 tiles
}

// struct types (imported)
// consts

export const LightGray: Color = new Color(200, 200, 200, 255);
export const Gray: Color = new Color(130, 130, 130, 255);
export const DarkGray: Color = new Color(80, 80, 80, 255);

export const Yellow: Color = new Color(253, 249, 0, 255);
export const Gold: Color = new Color(255, 203, 0, 255);
export const Orange: Color = new Color(255, 161, 0, 255);
export const Pink: Color = new Color(255, 109, 194, 255);
export const Red: Color = new Color(230, 41, 55, 255);
export const Maroon: Color = new Color(190, 33, 55, 255);

export const Green: Color = new Color(0, 228, 48, 255);
export const Lime: Color = new Color(0, 158, 47, 255);
export const DarkGreen: Color = new Color(0, 117, 44, 255);

export const SkyBlue: Color = new Color(102, 191, 255, 255);
export const Blue: Color = new Color(0, 121, 241, 255);
export const DarkBlue: Color = new Color(0, 82, 172, 255);

export const Purple: Color = new Color(200, 122, 255, 255);
export const Violet: Color = new Color(135, 60, 190, 255);
export const DarkPurple: Color = new Color(112, 31, 126, 255);

export const Beige: Color = new Color(211, 176, 131, 255);
export const Brown: Color = new Color(127, 106, 79, 255);
export const DarkBrown: Color = new Color(76, 63, 47, 255);

export const White: Color = new Color(255, 255, 255, 255);
export const Black: Color = new Color(0, 0, 0, 255);
export const Blank: Color = new Color(0, 0, 0, 0);
export const Magenta: Color = new Color(255, 0, 255, 255);
export const RayWhite: Color = new Color(245, 245, 245, 255);

// functions

export function InitWindow(width: int, height: int, title: string): void {
  lib.InitWindow(width, height, new TextEncoder().encode(title + "\0"));
}

export function CloseWindow(): void {
  lib.CloseWindow();
}

export function WindowShouldClose(): boolean {
  return !!lib.WindowShouldClose();
}

export function IsWindowReady(): boolean {
  return !!lib.IsWindowReady();
}

export function IsWindowFullscreen(): boolean {
  return !!lib.IsWindowFullscreen();
}

export function IsWindowHidden(): boolean {
  return !!lib.IsWindowHidden();
}

export function IsWindowMinimized(): boolean {
  return !!lib.IsWindowMinimized();
}

export function IsWindowMaximized(): boolean {
  return !!lib.IsWindowMaximized();
}

export function IsWindowFocused(): boolean {
  return !!lib.IsWindowFocused();
}

export function IsWindowResized(): boolean {
  return !!lib.IsWindowResized();
}

export function IsWindowState(state: ConfigFlags): boolean {
  return !!lib.IsWindowState(state);
}

export function SetWindowState(state: ConfigFlags): void {
  lib.SetWindowState(state);
}

export function ClearWindowState(state: ConfigFlags): void {
  lib.ClearWindowState(state);
}

export function ToggleFullscreen(): void {
  lib.ToggleFullscreen();
}

export function ToggleBorderlessWindowed(): void {
  lib.ToggleBorderlessWindowed();
}

export function MaximizedWindow(): void {
  lib.MaximizeWindow();
}

export function MaximizeWindow(): void {
  lib.MaximizeWindow();
}

export function MinimizedWindow(): void {
  lib.MinimizeWindow();
}

export function MinimizeWindow(): void {
  lib.MinimizeWindow();
}

export function RestoreWindow(): void {
  lib.RestoreWindow();
}

export function SetWindowIcon(image: Image): void {
  lib.SetWindowIcon(image.buffer);
}

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

export function SetWindowTitle(title: string): void {
  lib.SetWindowTitle(new TextEncoder().encode(title + "\0"));
}

export function SetWindowPosition(x: int, y: int): void {
  lib.SetWindowPosition(x, y);
}

export function SetWindowMonitor(monitor: int): void {
  lib.SetWindowMonitor(monitor);
}

export function SetWindowMinSize(width: int, height: int): void {
  lib.SetWindowMinSize(width, height);
}

export function SetWindowMaxSize(width: int, height: int): void {
  lib.SetWindowMaxSize(width, height);
}

export function SetWindowSize(width: int, height: int): void {
  lib.SetWindowSize(width, height);
}

export function SetWindowOpacity(opacity: float): void {
  lib.SetWindowOpacity(opacity);
}

export function SetWindowFocused(): void {
  lib.SetWindowFocused();
}

export function GetWindowHandle(): Deno.PointerValue {
  return lib.GetWindowHandle();
}

export function GetScreenWidth(): int {
  return lib.GetScreenWidth();
}

export function GetScreenHeight(): int {
  return lib.GetScreenHeight();
}

export function GetRenderWidth(): int {
  return lib.GetRenderWidth();
}

export function GetRenderHeight(): int {
  return lib.GetRenderHeight();
}

export function GetMonitorCount(): int {
  return lib.GetMonitorCount();
}

export function GetCurrentMonitor(): int {
  return lib.GetCurrentMonitor();
}

export function GetMonitorPosition(monitor: int): Vector2 {
  const buf = lib.GetMonitorPosition(monitor);
  const f = new Float32Array(buf.buffer, buf.byteOffset, 2);
  return new Vector2(f[0], f[1]);
}

export function GetMonitorWidth(monitor: int): int {
  return lib.GetMonitorWidth(monitor);
}

export function GetMonitorHeight(monitor: int): int {
  return lib.GetMonitorHeight(monitor);
}

export function GetMonitorPhysicalWidth(monitor: int): int {
  return lib.GetMonitorPhysicalWidth(monitor);
}

export function GetMonitorPhysicalHeight(monitor: int): int {
  return lib.GetMonitorPhysicalHeight(monitor);
}

export function GetMonitorRefreshRate(monitor: int): int {
  return lib.GetMonitorRefreshRate(monitor);
}

export function GetWindowPosition(): Vector2 {
  const buf = lib.GetWindowPosition();
  const f = new Float32Array(buf.buffer, buf.byteOffset, 2);
  return new Vector2(f[0], f[1]);
}

export function GetWindowScaleDPI(): Vector2 {
  const buf = lib.GetWindowScaleDPI();
  const f = new Float32Array(buf.buffer, buf.byteOffset, 2);
  return new Vector2(f[0], f[1]);
}

export function GetMonitorName(monitor: int): string {
  const ptr = lib.GetMonitorName(monitor);
  if (ptr === null) return "";
  return Deno.UnsafePointerView.getCString(ptr);
}

export function SetClipboardText(text: string): void {
  lib.SetClipboardText(new TextEncoder().encode(text + "\0"));
}

export function GetClipboardText(): string {
  const buf = lib.GetClipboardText();
  if (buf === null) return "";
  return Deno.UnsafePointerView.getCString(buf);
}

export function GetClipboardImage(): Image {
  const buf = lib.GetClipboardImage();
  return new Image(buf);
}

export function EnableEventWaiting(): void {
  lib.EnableEventWaiting();
}

export function DisableEventWaiting(): void {
  lib.DisableEventWaiting();
}

export function ShowCursor(): void {
  lib.ShowCursor();
}

export function HideCursor(): void {
  lib.HideCursor();
}

export function IsCursorHidden(): boolean {
  return !!lib.IsCursorHidden();
}

export function EnableCursor(): void {
  lib.EnableCursor();
}

export function DisableCursor(): void {
  lib.DisableCursor();
}

export function IsCursorOnScreen(): boolean {
  return !!lib.IsCursorOnScreen();
}

export function ClearBackground(color: Color): void {
  lib.ClearBackground(color.buffer);
}

export function BeginDrawing(): void {
  lib.BeginDrawing();
}

export function EndDrawing(): void {
  lib.EndDrawing();
}

export function BeginMode2D(camera: Camera2D): void {
  lib.BeginMode2D(camera.buffer);
}

export function EndMode2D(): void {
  lib.EndMode2D();
}

export function BeginMode3D(camera: Camera3D): void {
  lib.BeginMode3D(camera.buffer);
}

export function EndMode3D(): void {
  lib.EndMode3D();
}

// rlgl state helpers (skybox)
export function DisableBackfaceCulling(): void {
  lib.rlDisableBackfaceCulling();
}

export function EnableBackfaceCulling(): void {
  lib.rlEnableBackfaceCulling();
}

export function DisableDepthMask(): void {
  lib.rlDisableDepthMask();
}

export function EnableDepthMask(): void {
  lib.rlEnableDepthMask();
}

export function BeginTextureMode(target: RenderTexture): void {
  lib.BeginTextureMode(target.buffer);
}

export function EndTextureMode(): void {
  lib.EndTextureMode();
}

export function BeginShaderMode(shader: Shader): void {
  lib.BeginShaderMode(shader.buffer);
}

export function EndShaderMode(): void {
  lib.EndShaderMode();
}

export function BeginBlendMode(mode: BlendMode): void {
  lib.BeginBlendMode(mode);
}

export function EndBlendMode(): void {
  lib.EndBlendMode();
}

export function BeginScissorMode(
  x: int,
  y: int,
  width: int,
  height: int,
): void {
  lib.BeginScissorMode(x, y, width, height);
}

export function EndScissorMode(): void {
  lib.EndScissorMode();
}

export function BeginVrStereoMode(config: VrStereoConfig): void {
  lib.BeginVrStereoMode(config.buffer);
}

export function EndVrStereoMode(): void {
  lib.EndVrStereoMode();
}

export function LoadVrStereoConfig(device: VrDeviceInfo): VrStereoConfig {
  const buf = lib.LoadVrStereoConfig(device.buffer);
  return new VrStereoConfig(buf);
}

export function UnloadVrStereoConfig(config: VrStereoConfig): void {
  lib.UnloadVrStereoConfig(config.buffer);
}

export function LoadShader(vShader: string, fShader: string): Shader {
  const vShaderBuf = new TextEncoder().encode(vShader + "\0");
  const fShaderBuf = new TextEncoder().encode(fShader + "\0");
  const buf = lib.LoadShader(vShaderBuf, fShaderBuf);
  return new Shader(buf);
}

export function LoadShaderFromMemory(vShader: string, fShader: string): Shader {
  const vShaderBuf = new TextEncoder().encode(vShader + "\0");
  const fShaderBuf = new TextEncoder().encode(fShader + "\0");
  const buf = lib.LoadShaderFromMemory(vShaderBuf, fShaderBuf);
  return new Shader(buf);
}

export function IsShaderValid(shader: Shader): boolean {
  return !!lib.IsShaderValid(shader.buffer);
}

export function GetShaderLocation(shader: Shader, name: string): int {
  const nameBuf = new TextEncoder().encode(name + "\0");
  return lib.GetShaderLocation(shader.buffer, nameBuf);
}

export function GetShaderLocationAttrib(shader: Shader, name: string): int {
  const nameBuf = new TextEncoder().encode(name + "\0");
  return lib.GetShaderLocationAttrib(shader.buffer, nameBuf);
}

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

export function UnloadShader(shader: Shader): void {
  lib.UnloadShader(shader.buffer);
}

export function GetScreenToWorldRay(position: Vector2, camera: Camera): Ray {
  const buf = lib.GetScreenToWorldRay(position.buffer, camera.buffer);
  return Ray.fromBuffer(buf.buffer, buf.byteOffset);
}

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

export function GetWorldToScreen(position: Vector3, camera: Camera): Vector2 {
  const buf = lib.GetWorldToScreen(position.buffer, camera.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

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

export function GetWorldToScreen2D(
  position: Vector2,
  camera: Camera2D,
): Vector2 {
  const buf = lib.GetWorldToScreen2D(position.buffer, camera.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function GetSCreenToWorld2D(
  position: Vector2,
  camera: Camera2D,
): Vector2 {
  const buf = lib.GetScreenToWorld2D(position.buffer, camera.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function GetScreenToWorld2D(
  position: Vector2,
  camera: Camera2D,
): Vector2 {
  const buf = lib.GetScreenToWorld2D(position.buffer, camera.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function GetCameraMatrix(camera: Camera): Matrix {
  const buf = lib.GetCameraMatrix(camera.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function GetCameraMatrix2D(camera: Camera2D): Matrix {
  const buf = lib.GetCameraMatrix2D(camera.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function SetTargetFPS(fps: int): void {
  lib.SetTargetFPS(fps);
}

export function GetFrameTime(): float {
  return lib.GetFrameTime();
}

export function GetTime(): float {
  return lib.GetTime();
}

export function GetFPS(): int {
  return lib.GetFPS();
}

export function SwapScreenBuffer(): void {
  lib.SwapScreenBuffer();
}

export function PollInputEvents(): void {
  lib.PollInputEvents();
}

export function WaitTime(seconds: float): void {
  lib.WaitTime(seconds);
}

export function SetRandomSeed(seed: int): void {
  lib.SetRandomSeed(seed);
}

export function GetRandomValue(min: int, max: int): int {
  return lib.GetRandomValue(min, max);
}

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

export function UnloadRandomSequence(
  sequence: Deno.PointerValue,
): void {
  if (sequence !== null) lib.UnloadRandomSequence(sequence);
}

export function TakeScreenshot(fileName: string): void {
  const fileNameBuf = new TextEncoder().encode(fileName + "\0");
  lib.TakeScreenshot(fileNameBuf);
}

export function SetConfigFlags(flags: ConfigFlags): void {
  lib.SetConfigFlags(flags);
}

export function OpenURL(url: string): void {
  const urlBuf = new TextEncoder().encode(url + "\0");
  lib.OpenURL(urlBuf);
}

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

export type TraceLogCallbackDef = {
  parameters: ["i32", "pointer", "pointer"];
  result: "void";
};

let traceLogCallback: Deno.UnsafeCallback<TraceLogCallbackDef> | undefined;

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

export function MemAlloc(size: int): Deno.PointerValue {
  return lib.MemAlloc(size);
}

export function MemRealloc(
  ptr: Deno.PointerValue,
  size: int,
): Deno.PointerValue {
  return lib.MemRealloc(ptr, size);
}

export function MemFree(ptr: Deno.PointerValue): void {
  if (ptr !== null) lib.MemFree(ptr);
}

export function LoadFileData(fileName: string): Uint8Array {
  const size = new Int32Array(1);
  const ptr = lib.LoadFileData(cstr(fileName), Deno.UnsafePointer.of(size));
  if (ptr === null) return new Uint8Array();
  const data = copyPointerBytes(ptr, size[0]);
  lib.UnloadFileData(ptr);
  return data;
}

export function UnloadFileData(data: Deno.PointerValue): void {
  if (data !== null) lib.UnloadFileData(data);
}

export function SaveFileData(fileName: string, data: Uint8Array): boolean {
  return !!lib.SaveFileData(
    cstr(fileName),
    Deno.UnsafePointer.of(data),
    data.byteLength,
  );
}

export function ExportDataAsCode(
  data: Uint8Array<ArrayBuffer>,
  fileName: string,
): boolean {
  return !!lib.ExportDataAsCode(data, data.byteLength, cstr(fileName));
}

export function LoadFileText(fileName: string): string {
  const ptr = lib.LoadFileText(cstr(fileName));
  if (ptr === null) return "";
  const text = readCString(ptr);
  lib.UnloadFileText(ptr);
  return text;
}

export function UnloadFileText(text: Deno.PointerValue): void {
  if (text !== null) lib.UnloadFileText(text);
}

export function SaveFileText(fileName: string, text: string): boolean {
  return !!lib.SaveFileText(cstr(fileName), cstr(text));
}

export function SetLoadFileDataCallback(callback: Deno.PointerValue): void {
  lib.SetLoadFileDataCallback(callback);
}

export function SetSaveFileDataCallback(callback: Deno.PointerValue): void {
  lib.SetSaveFileDataCallback(callback);
}

export function SetLoadFileTextCallback(callback: Deno.PointerValue): void {
  lib.SetLoadFileTextCallback(callback);
}

export function SetSaveFileTextCallback(callback: Deno.PointerValue): void {
  lib.SetSaveFileTextCallback(callback);
}

export function FileRename(fileName: string, fileRename: string): int {
  return lib.FileRename(cstr(fileName), cstr(fileRename));
}

export function FileRemove(fileName: string): int {
  return lib.FileRemove(cstr(fileName));
}

export function FileCopy(srcPath: string, dstPath: string): int {
  return lib.FileCopy(cstr(srcPath), cstr(dstPath));
}

export function FileMove(srcPath: string, dstPath: string): int {
  return lib.FileMove(cstr(srcPath), cstr(dstPath));
}

export function FileTextReplace(
  fileName: string,
  search: string,
  replacement: string,
): int {
  return lib.FileTextReplace(cstr(fileName), cstr(search), cstr(replacement));
}

export function FileTextFindIndex(fileName: string, search: string): int {
  return lib.FileTextFindIndex(cstr(fileName), cstr(search));
}

export function FileExists(fileName: string): boolean {
  return !!lib.FileExists(cstr(fileName));
}

export function DirectoryExists(dirPath: string): boolean {
  return !!lib.DirectoryExists(cstr(dirPath));
}

export function IsFileExtension(fileName: string, ext: string): boolean {
  return !!lib.IsFileExtension(cstr(fileName), cstr(ext));
}

export function GetFileLength(fileName: string): int {
  return lib.GetFileLength(cstr(fileName));
}

export function GetFileModTime(fileName: string): number {
  return Number(lib.GetFileModTime(cstr(fileName)));
}

export function GetFileExtension(fileName: string): string {
  return readCString(lib.GetFileExtension(cstr(fileName)));
}

export function GetFileName(filePath: string): string {
  return readCString(lib.GetFileName(cstr(filePath)));
}

export function GetFileNameWithoutExt(filePath: string): string {
  return readCString(lib.GetFileNameWithoutExt(cstr(filePath)));
}

export function GetDirectoryPath(filePath: string): string {
  return readCString(lib.GetDirectoryPath(cstr(filePath)));
}

export function GetPrevDirectoryPath(dirPath: string): string {
  return readCString(lib.GetPrevDirectoryPath(cstr(dirPath)));
}

export function GetWorkingDirectory(): string {
  return readCString(lib.GetWorkingDirectory());
}

export function GetApplicationDirectory(): string {
  return readCString(lib.GetApplicationDirectory());
}

export function MakeDirectory(dirPath: string): int {
  return lib.MakeDirectory(cstr(dirPath));
}

export function ChangeDirectory(dirPath: string): boolean {
  return !!lib.ChangeDirectory(cstr(dirPath));
}

export function IsPathFile(path: string): boolean {
  return !!lib.IsPathFile(cstr(path));
}

export function IsFileNameValid(fileName: string): boolean {
  return !!lib.IsFileNameValid(cstr(fileName));
}

export function LoadDirectoryFiles(dirPath: string): FilePathList {
  return new FilePathList(lib.LoadDirectoryFiles(cstr(dirPath)));
}

export function LoadDirectoryFilesEx(
  basePath: string,
  filter: string,
  scanSubdirs: boolean,
): FilePathList {
  return new FilePathList(
    lib.LoadDirectoryFilesEx(cstr(basePath), cstr(filter), scanSubdirs ? 1 : 0),
  );
}

export function UnloadDirectoryFiles(files: FilePathList): void {
  lib.UnloadDirectoryFiles(files.buffer);
}

export function GetDirectoryFileCount(dirPath: string): number {
  return lib.GetDirectoryFileCount(cstr(dirPath));
}

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

export function CompressData(data: Uint8Array<ArrayBuffer>): Uint8Array {
  const size = new Int32Array(1);
  const ptr = lib.CompressData(
    data,
    data.byteLength,
    Deno.UnsafePointer.of(size.buffer),
  );
  return copyAndFreeBytes(ptr, size[0]);
}

export function DecompressData(compData: Uint8Array<ArrayBuffer>): Uint8Array {
  const size = new Int32Array(1);
  const ptr = lib.DecompressData(
    compData,
    compData.byteLength,
    Deno.UnsafePointer.of(size.buffer),
  );
  return copyAndFreeBytes(ptr, size[0]);
}

export function EncodeDataBase64(data: Uint8Array<ArrayBuffer>): string {
  const size = new Int32Array(1);
  const ptr = lib.EncodeDataBase64(
    data,
    data.byteLength,
    Deno.UnsafePointer.of(size.buffer),
  );
  return copyAndFreeCString(ptr);
}

export function DecodeDataBase64(text: string): Uint8Array {
  const size = new Int32Array(1);
  const ptr = lib.DecodeDataBase64(
    cstr(text),
    Deno.UnsafePointer.of(size.buffer),
  );
  return copyAndFreeBytes(ptr, size[0]);
}

export function ComputeCRC32(data: Uint8Array<ArrayBuffer>): number {
  return lib.ComputeCRC32(data, data.byteLength);
}

export function ComputeMD5(data: Uint8Array<ArrayBuffer>): Uint8Array {
  return copyPointerBytes(lib.ComputeMD5(data, data.byteLength), 16);
}

export function ComputeSHA1(data: Uint8Array<ArrayBuffer>): Uint8Array {
  return copyPointerBytes(lib.ComputeSHA1(data, data.byteLength), 20);
}

export function ComputeSHA256(data: Uint8Array<ArrayBuffer>): Uint8Array {
  return copyPointerBytes(lib.ComputeSHA256(data, data.byteLength), 32);
}

export function isFileDropped(): boolean {
  return !!lib.IsFileDropped();
}

export function IsFileDropped(): boolean {
  return !!lib.IsFileDropped();
}

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

export function UnloadDroppedFiles(files: FilePathList): void {
  lib.UnloadDroppedFiles(files.buffer);
}

export function LoadAutomationEventList(file: string): AutomationEventList {
  return new AutomationEventList(
    lib.LoadAutomationEventList(new TextEncoder().encode(file + "\0")),
  );
}

export function UnloadAutomationEventList(
  eventList: AutomationEventList,
): void {
  lib.UnloadAutomationEventList(eventList.buffer);
}

export function ExportAutomationEventList(
  eventList: AutomationEventList,
  file: string,
): void {
  lib.ExportAutomationEventList(
    eventList.buffer,
    new TextEncoder().encode(file + "\0"),
  );
}

export function SetAutomationEventList(eventList: AutomationEventList): void {
  lib.SetAutomationEventList(eventList.buffer);
}

export function SetAutomationEventBaseFrame(frame: int): void {
  lib.SetAutomationEventBaseFrame(frame);
}

export function StartAutomationEventRecording(): void {
  lib.StartAutomationEventRecording();
}

export function StopAutomationEventRecording(): void {
  lib.StopAutomationEventRecording();
}

export function PlayAutomationEvent(event: AutomationEvent): void {
  lib.PlayAutomationEvent(event.buffer);
}

export function IsKeyPressed(key: KeyboardKey): boolean {
  return !!lib.IsKeyPressed(key);
}

export function IsKeyPressedRepeat(key: KeyboardKey): boolean {
  return !!lib.IsKeyPressedRepeat(key);
}

export function IsKeyDown(key: KeyboardKey): boolean {
  return !!lib.IsKeyDown(key);
}

export function IsKeyReleased(key: KeyboardKey): boolean {
  return !!lib.IsKeyReleased(key);
}

export function IsKeyUp(key: KeyboardKey): boolean {
  return !!lib.IsKeyUp(key);
}

export function GetKeyPressed(): KeyboardKey {
  return lib.GetKeyPressed();
}

export function GetCharPressed(): string {
  const char = lib.GetCharPressed(); // returns a number
  return String.fromCharCode(char);
}

export function GetKeyName(key: KeyboardKey): string {
  return readCString(lib.GetKeyName(key));
}

export function SetExitKey(key: KeyboardKey): void {
  lib.SetExitKey(key);
}

export function IsGamepadAvailable(gamepad: int): boolean {
  return !!lib.IsGamepadAvailable(gamepad);
}

export function GetGamepadName(gamepad: int): string {
  const ptr = lib.GetGamepadName(gamepad);
  if (!ptr) return "";
  const view = new Deno.UnsafePointerView(ptr);
  return view.getCString();
}

export function IsGamepadButtonPressed(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonPressed(gamepad, button);
}

export function IsGamepadButtonReleased(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonReleased(gamepad, button);
}

export function IsGamepadButtonUp(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonUp(gamepad, button);
}

export function IsGamepadButtonDown(
  gamepad: int,
  button: GamepadButton,
): boolean {
  return !!lib.IsGamepadButtonDown(gamepad, button);
}

export function GetGamepadButtonPressed(): GamepadButton {
  return lib.GetGamepadButtonPressed();
}

export function GetGamepadAxisCount(gamepad: int): int {
  return lib.GetGamepadAxisCount(gamepad);
}

export function GetGamepadAxisMovement(gamepad: int, axis: GamepadAxis): float {
  return lib.GetGamepadAxisMovement(gamepad, axis);
}

export function SetGamepadMappings(mappings: string): void {
  lib.SetGamepadMappings(new TextEncoder().encode(mappings + "\0"));
}

export function SetGamepadVibration(
  gamepad: int,
  leftVibration: float,
  rightVibration: float,
  duration: int,
): void {
  lib.SetGamepadVibration(gamepad, leftVibration, rightVibration, duration);
}

export function IsMouseButtonPressed(button: MouseButton): boolean {
  return !!lib.IsMouseButtonPressed(button);
}

export function IsMouseButtonDown(button: MouseButton): boolean {
  return !!lib.IsMouseButtonDown(button);
}

export function IsMouseButtonReleased(button: MouseButton): boolean {
  return !!lib.IsMouseButtonReleased(button);
}

export function IsMouseButtonUp(button: MouseButton): boolean {
  return !!lib.IsMouseButtonUp(button);
}

export function GetMouseX(): int {
  return lib.GetMouseX();
}

export function GetMouseY(): int {
  return lib.GetMouseY();
}

export function GetMousePosition(): Vector2 {
  const buffer = lib.GetMousePosition();
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

export function GetMouseDelta(): Vector2 {
  const buffer = lib.GetMouseDelta();
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

export function SetMousePosition(x: int, y: int): void {
  lib.SetMousePosition(x, y);
}

export function SetMouseOffset(offsetX: int, offsetY: int): void {
  lib.SetMouseOffset(offsetX, offsetY);
}

export function SetMouseScale(scaleX: float, scaleY: float): void {
  lib.SetMouseScale(scaleX, scaleY);
}

export function GetMouseWheelMove(): float {
  return lib.GetMouseWheelMove();
}

export function GetMouseWheelMoveV(): Vector2 {
  const buffer = lib.GetMouseWheelMoveV();
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

export function SetMouseCursor(cursor: MouseCursor): void {
  lib.SetMouseCursor(cursor);
}

export function GetTouchX(): int {
  return lib.GetTouchX();
}

export function GetTouchY(): int {
  return lib.GetTouchY();
}

export function GetTouchPosition(index: int): Vector2 {
  const buffer = lib.GetTouchPosition(index);
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

export function GetTouchPointId(index: int): int {
  return lib.GetTouchPointId(index);
}

export function GetTouchPointCount(): int {
  return lib.GetTouchPointCount();
}

export function SetGesturesEnabled(flags: Gesture): void {
  lib.SetGesturesEnabled(flags);
}

export function IsGestureDetected(gesture: Gesture): boolean {
  return !!lib.IsGestureDetected(gesture);
}

export function GetGestureDetected(): Gesture {
  return lib.GetGestureDetected() as Gesture;
}

export function GetGestureHoldDuration(): float {
  return lib.GetGestureHoldDuration();
}

export function GetGestureDragVector(): Vector2 {
  const buffer = lib.GetGestureDragVector();
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

export function GetGestureDragAngle(): float {
  return lib.GetGestureDragAngle();
}

export function GetGesturePinchVector(): Vector2 {
  const buffer = lib.GetGesturePinchVector();
  return Vector2.fromBuffer(buffer.buffer, buffer.byteOffset);
}

export function GetGesturePinchAngle(): float {
  return lib.GetGesturePinchAngle();
}

export function UpdateCamera(camera: Camera, mode: CameraMode): void {
  lib.UpdateCamera(camera.buffer, mode);
}

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

export function SetShapesTexture(texture: Texture2D, source: Rectangle): void {
  lib.SetShapesTexture(texture.buffer, source.buffer);
}

export function GetShapesTexture(): Texture2D {
  const buffer = lib.GetShapesTexture();
  return new Texture2D(buffer);
}

export function GetShapesTextureRectangle(): Rectangle {
  const buffer = lib.GetShapesTextureRectangle();
  return Rectangle.fromBuffer(buffer.buffer, buffer.byteOffset);
}

export function DrawPixel(posX: int, posY: int, color: Color): void {
  lib.DrawPixel(posX, posY, color.buffer);
}

export function DrawPixelV(position: Vector2, color: Color): void {
  lib.DrawPixelV(position.buffer, color.buffer);
}

export function DrawLine(
  posX: int,
  posY: int,
  endX: int,
  endY: int,
  color: Color,
): void {
  lib.DrawLine(posX, posY, endX, endY, color.buffer);
}

export function DrawLineV(
  startPos: Vector2,
  endPos: Vector2,
  color: Color,
): void {
  lib.DrawLineV(startPos.buffer, endPos.buffer, color.buffer);
}

export function DrawLineEx(
  startPos: Vector2,
  endPos: Vector2,
  thickness: float,
  color: Color,
): void {
  lib.DrawLineEx(startPos.buffer, endPos.buffer, thickness, color.buffer);
}

export function DrawLineStrip(points: Vector2[], color: Color): void {
  const line_strip_buffer = concatVector2(points);
  lib.DrawLineStrip(
    line_strip_buffer as BufferSource,
    points.length,
    color.buffer,
  );
}

export function DrawLineBezier(
  startPos: Vector2,
  endPos: Vector2,
  thickness: float,
  color: Color,
): void {
  lib.DrawLineBezier(startPos.buffer, endPos.buffer, thickness, color.buffer);
}

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

export function DrawCircle(
  posX: int,
  posY: int,
  radius: int,
  color: Color,
): void {
  lib.DrawCircle(posX, posY, radius, color.buffer);
}

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

export function DrawCircleV(center: Vector2, radius: int, color: Color): void {
  lib.DrawCircleV(center.buffer, radius, color.buffer);
}

export function DrawCircleLines(
  centerX: int,
  centerY: int,
  radius: int,
  color: Color,
): void {
  lib.DrawCircleLines(centerX, centerY, radius, color.buffer);
}

export function DrawCircleLinesV(
  center: Vector2,
  radius: int,
  color: Color,
): void {
  lib.DrawCircleLinesV(center.buffer, radius, color.buffer);
}

export function DrawEllipse(
  centerX: int,
  centerY: int,
  radiusX: int,
  radiusY: int,
  color: Color,
): void {
  lib.DrawEllipse(centerX, centerY, radiusX, radiusY, color.buffer);
}

export function DrawEllipseV(
  center: Vector2,
  radiusX: float,
  radiusY: float,
  color: Color,
): void {
  lib.DrawEllipseV(center.buffer, radiusX, radiusY, color.buffer);
}

export function DrawEllipseLines(
  centerX: int,
  centerY: int,
  radiusX: int,
  radiusY: int,
  color: Color,
): void {
  lib.DrawEllipseLines(centerX, centerY, radiusX, radiusY, color.buffer);
}

export function DrawEllipseLinesV(
  center: Vector2,
  radiusX: float,
  radiusY: float,
  color: Color,
): void {
  lib.DrawEllipseLinesV(center.buffer, radiusX, radiusY, color.buffer);
}

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

export function DrawRectangle(
  posX: int,
  posY: int,
  width: int,
  height: int,
  color: Color,
): void {
  lib.DrawRectangle(posX, posY, width, height, color.buffer);
}

export function DrawRectangleV(
  position: Vector2,
  size: Vector2,
  color: Color,
): void {
  lib.DrawRectangleV(position.buffer, size.buffer, color.buffer);
}

export function DrawRectangleRec(
  rec: Rectangle,
  color: Color,
): void {
  lib.DrawRectangleRec(rec.buffer, color.buffer);
}

export function DrawRectanglePro(
  rec: Rectangle,
  origin: Vector2,
  rotation: float,
  color: Color,
): void {
  lib.DrawRectanglePro(rec.buffer, origin.buffer, rotation, color.buffer);
}

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

export function DrawRectangleLines(
  posX: int,
  posY: int,
  width: int,
  height: int,
  color: Color,
): void {
  lib.DrawRectangleLines(posX, posY, width, height, color.buffer);
}

export function DrawRectangleLinesEx(
  rec: Rectangle,
  lineThick: int,
  color: Color,
): void {
  lib.DrawRectangleLinesEx(rec.buffer, lineThick, color.buffer);
}

export function DrawRectangleRounded(
  rec: Rectangle,
  radius: float,
  segments: int,
  color: Color,
): void {
  lib.DrawRectangleRounded(rec.buffer, radius, segments, color.buffer);
}

export function DrawRectangleRoundedLines(
  rec: Rectangle,
  radius: float,
  segments: int,
  color: Color,
): void {
  lib.DrawRectangleRoundedLines(rec.buffer, radius, segments, color.buffer);
}

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

export function DrawPoly(
  center: Vector2,
  sides: int,
  radius: float,
  rotation: float,
  color: Color,
): void {
  lib.DrawPoly(center.buffer, sides, radius, rotation, color.buffer);
}

export function DrawPolyLines(
  center: Vector2,
  sides: int,
  radius: float,
  rotation: float,
  color: Color,
): void {
  lib.DrawPolyLines(center.buffer, sides, radius, rotation, color.buffer);
}

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

export function CheckCollisionRecs(rec1: Rectangle, rec2: Rectangle): boolean {
  return !!lib.CheckCollisionRecs(rec1.buffer, rec2.buffer);
}

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

export function CheckCollisionPointRec(
  point: Vector2,
  rec: Rectangle,
): boolean {
  return !!lib.CheckCollisionPointRec(point.buffer, rec.buffer);
}

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

export function GetCollisionRec(rec1: Rectangle, rec2: Rectangle): Rectangle {
  const buf = lib.GetCollisionRec(rec1.buffer, rec2.buffer);
  const view = new DataView(buf.buffer);
  const x = view.getFloat32(0, littleEndian);
  const y = view.getFloat32(4, littleEndian);
  const width = view.getFloat32(8, littleEndian);
  const height = view.getFloat32(12, littleEndian);
  return new Rectangle(x, y, width, height);
}

export function LoadImage(file: string): Image {
  return new Image(lib.LoadImage(new TextEncoder().encode(file + "\0")));
}

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

export function LoadImageFromTexture(texture: Texture2D): Image {
  return new Image(lib.LoadImageFromTexture(texture.buffer));
}

export function LoadImageFromScreen(): Image {
  return new Image(lib.LoadImageFromScreen());
}

export function IsImageValid(image: Image): boolean {
  return !!lib.IsImageValid(image.buffer);
}

export function UnloadImage(image: Image): void {
  lib.UnloadImage(image.buffer);
}

export function ExportImage(image: Image, fileName: string): boolean {
  return !!lib.ExportImage(image.buffer, cstr(fileName));
}

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

export function ExportImageAsCode(image: Image, file: string): boolean {
  return !!lib.ExportImageAsCode(
    image.buffer,
    new TextEncoder().encode(file + "\0"),
  );
}

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

export function ImageCopy(
  image: Image,
): Image {
  return new Image(
    lib.ImageCopy(
      image.buffer,
    ),
  );
}

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

export function ImageFormat(
  image: Image,
  newFormat: int,
): void {
  lib.ImageFormat(
    image.buffer,
    newFormat,
  );
}

export function ImageToPOT(
  image: Image,
  fill: Color,
): void {
  lib.ImageToPOT(
    image.buffer,
    fill.buffer,
  );
}

export function ImageCrop(
  image: Image,
  crop: Rectangle,
): void {
  lib.ImageCrop(
    image.buffer,
    crop.buffer,
  );
}

export function ImageAlphaCrop(
  image: Image,
  threshold: float,
): void {
  lib.ImageAlphaCrop(
    image.buffer,
    threshold,
  );
}

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

export function ImageAlphaMask(
  image: Image,
  alphaMask: Image,
): void {
  lib.ImageAlphaMask(
    image.buffer,
    alphaMask.buffer,
  );
}

export function ImageAlphaPremultiply(
  image: Image,
): void {
  lib.ImageAlphaPremultiply(
    image.buffer,
  );
}

export function ImageBlurGaussian(
  image: Image,
  blurSize: int,
): void {
  lib.ImageBlurGaussian(
    image.buffer,
    blurSize,
  );
}

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

export function ImageMipmaps(
  image: Image,
): void {
  lib.ImageMipmaps(
    image.buffer,
  );
}

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

export function ImageFlipVertical(
  image: Image,
): void {
  lib.ImageFlipVertical(
    image.buffer,
  );
}

export function ImageFlipHorizontal(
  image: Image,
): void {
  lib.ImageFlipHorizontal(
    image.buffer,
  );
}

export function ImageRotate(
  image: Image,
  degrees: int,
): void {
  lib.ImageRotate(
    image.buffer,
    degrees,
  );
}

export function ImageRotateCW(
  image: Image,
): void {
  lib.ImageRotateCW(
    image.buffer,
  );
}

export function ImageRotateCCW(
  image: Image,
): void {
  lib.ImageRotateCCW(
    image.buffer,
  );
}

export function ImageColorTint(
  image: Image,
  color: Color,
): void {
  lib.ImageColorTint(
    image.buffer,
    color.buffer,
  );
}

export function ImageColorInvert(
  image: Image,
): void {
  lib.ImageColorInvert(
    image.buffer,
  );
}

// Image color modification functions (in-place)

export function ImageColorGrayscale(
  image: Image,
): void {
  lib.ImageColorGrayscale(
    image.buffer,
  );
}

export function ImageColorContrast(
  image: Image,
  contrast: float,
): void {
  lib.ImageColorContrast(
    image.buffer,
    contrast,
  );
}

export function ImageColorBrightness(
  image: Image,
  brightness: int,
): void {
  lib.ImageColorBrightness(
    image.buffer,
    brightness,
  );
}

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

export function LoadImageColors(
  image: Image,
): Uint8Array<ArrayBuffer> {
  const ptr = lib.LoadImageColors(image.buffer);
  if (ptr === null) throw new Error("LoadImageColors failed");

  const size = image.width * image.height * 4;
  const view = new Deno.UnsafePointerView(ptr);
  return new Uint8Array(view.getArrayBuffer(size));
}

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

export function UnloadImageColors(
  colors: Uint8Array<ArrayBuffer>,
): void {
  lib.UnloadImageColors(colors);
}

export function UnloadImagePalette(
  colors: Uint8Array<ArrayBuffer>,
): void {
  lib.UnloadImagePalette(colors);
}

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

export function ImageClearBackground(
  dst: Image,
  color: Color,
): void {
  lib.ImageClearBackground(
    dst.buffer,
    color.buffer,
  );
}

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

export function LoadTexture(file: string): Texture2D {
  return new Texture2D(
    lib.LoadTexture(new TextEncoder().encode(file + "\0").buffer),
  );
}

export function LoadTextureFromImage(image: Image): Texture2D {
  return new Texture2D(lib.LoadTextureFromImage(image.buffer));
}

export function LoadTextureCubemap(image: Image, layout: int): Texture2D {
  return new Texture2D(lib.LoadTextureCubemap(image.buffer, layout));
}

export function LoadRenderTexture(width: int, height: int): RenderTexture {
  return new RenderTexture(lib.LoadRenderTexture(width, height));
}

export function IsTextureValid(texture: Texture2D): boolean {
  return !!lib.IsTextureValid(texture.buffer);
}

export function UnloadTexture(texture: Texture2D): void {
  lib.UnloadTexture(texture.buffer);
}

export function IsRenderTextureValid(texture: RenderTexture): boolean {
  return !!lib.IsRenderTextureValid(texture.buffer);
}

export function UnloadRenderTexture(texture: RenderTexture): void {
  lib.UnloadRenderTexture(texture.buffer);
}

export function UpdateTexture(texture: Texture2D, pixels: Uint8Array): void {
  lib.UpdateTexture(
    texture.buffer,
    Deno.UnsafePointer.of(pixels.buffer as BufferSource),
  );
}

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

export function GenTextureMipmaps(texture: Texture2D): void {
  lib.GenTextureMipmaps(texture.buffer);
}

export function SetTextureFilter(
  texture: Texture2D,
  filter: TextureFilter,
): void {
  lib.SetTextureFilter(texture.buffer, filter);
}

export function SetTextureWrap(texture: Texture2D, wrap: TextureWrap): void {
  lib.SetTextureWrap(texture.buffer, wrap);
}

// Texture drawing functions

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

export function ColorIsEqual(col1: Color, col2: Color): boolean {
  return !!lib.ColorIsEqual(col1.buffer, col2.buffer);
}

export function Fade(
  color: Color,
  alpha: float,
): Color {
  const buf = lib.Fade(color.buffer, alpha);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

export function ColorToInt(color: Color): int {
  return lib.ColorToInt(color.buffer);
}

export function ColorNormalize(color: Color): Vector4 {
  const buf = lib.ColorNormalize(color.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function ColorFromNormalized(normalized: Vector4): Color {
  const buf = lib.ColorFromNormalized(normalized.buffer);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

export function ColorToHSV(color: Color): Vector3 {
  const buf = lib.ColorToHSV(color.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function ColorFromHSV(
  hue: float,
  saturation: float,
  value: float,
): Color {
  const buf = lib.ColorFromHSV(hue, saturation, value);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

export function ColorTint(color: Color, tint: Color): Color {
  const buf = lib.ColorTint(color.buffer, tint.buffer);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

export function ColorBrightness(color: Color, factor: float): Color {
  const buf = lib.ColorBrightness(color.buffer, factor);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

export function ColorContrast(color: Color, contrast: float): Color {
  const buf = lib.ColorContrast(color.buffer, contrast);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

export function ColorAlpha(color: Color, alpha: float): Color {
  const buf = lib.ColorAlpha(color.buffer, alpha);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

export function ColorAlphaBlend(
  dst: Color,
  src: Color,
  tint: Color,
): Color {
  const buf = lib.ColorAlphaBlend(dst.buffer, src.buffer, tint.buffer);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

export function ColorLerp(color1: Color, color2: Color, amount: float): Color {
  const buf = lib.ColorLerp(color1.buffer, color2.buffer, amount);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

export function GetColor(hex: int): Color {
  const buf = lib.GetColor(hex);
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

export function GetPixelColor(srcPtr: Uint8Array, format: PixelFormat): Color {
  const buf = lib.GetPixelColor(
    Deno.UnsafePointer.of(srcPtr.buffer as BufferSource),
    format,
  );
  return Color.fromBuffer(buf.buffer, buf.byteOffset);
}

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

export function GetPixelDataSize(
  width: int,
  height: int,
  format: PixelFormat,
): int {
  return lib.GetPixelDataSize(width, height, format);
}

export function GetFontDefault(): Font {
  return new Font(lib.GetFontDefault());
}

export function LoadFont(file: string): Font {
  return new Font(
    lib.LoadFont(new TextEncoder().encode(file + "\0")),
  );
}

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

export function LoadFontFromImage(
  image: Image,
  key: Color,
  firstChar: int,
): Font {
  return new Font(
    lib.LoadFontFromImage(image.buffer, key.buffer, firstChar),
  );
}

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

export function IsFontValid(font: Font): boolean {
  return !!lib.IsFontValid(font.buffer);
}

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

export function UnloadFont(font: Font): void {
  lib.UnloadFont(font.buffer);
}

export function ExportFontAsCode(
  font: Font,
  fileName: string,
): boolean {
  return !!lib.ExportFontAsCode(
    font.buffer,
    new TextEncoder().encode(fileName + "\0"),
  );
}

export function DrawFPS(posX: int, posY: int): void {
  lib.DrawFPS(posX, posY);
}

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

export function SetTextLineSpacing(spacing: int): void {
  lib.SetTextLineSpacing(spacing);
}

export function MeasureText(text: string, fontSize: int): int {
  return lib.MeasureText(
    new TextEncoder().encode(text + "\0").buffer,
    fontSize,
  );
}

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

export function GetGlyphIndex(font: Font, codepoint: int): int {
  return lib.GetGlyphIndex(font.buffer, codepoint);
}

export function GetGlyphInfo(font: Font, codepoint: int): GlyphInfo {
  const buf = lib.GetGlyphInfo(font.buffer, codepoint);
  return new GlyphInfo(buf);
}

export function GetGlyphAtlasRec(font: Font, codepoint: int): Rectangle {
  const buf = lib.GetGlyphAtlasRec(font.buffer, codepoint);
  return Rectangle.fromBuffer(buf.buffer, buf.byteOffset);
}

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

export function UnloadUTF8(text: Deno.PointerValue): void {
  if (text !== null) lib.UnloadUTF8(text);
}

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

export function UnloadCodepoints(codepoints: Deno.PointerValue): void {
  if (codepoints !== null) lib.UnloadCodepoints(codepoints);
}

export function GetCodepointCount(text: string): int {
  return lib.GetCodepointCount(cstr(text));
}

export function GetCodepoint(text: string): { codepoint: int; size: int } {
  const size = new Int32Array(1);
  const codepoint = lib.GetCodepoint(
    cstr(text),
    Deno.UnsafePointer.of(size.buffer),
  );
  return { codepoint, size: size[0] };
}

export function GetCodepointNext(text: string): { codepoint: int; size: int } {
  const size = new Int32Array(1);
  const codepoint = lib.GetCodepointNext(
    cstr(text),
    Deno.UnsafePointer.of(size.buffer),
  );
  return { codepoint, size: size[0] };
}

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

export function CodepointToUTF8(codepoint: int): { text: string; size: int } {
  const size = new Int32Array(1);
  const ptr = lib.CodepointToUTF8(
    codepoint,
    Deno.UnsafePointer.of(size.buffer),
  );
  return { text: readCString(ptr), size: size[0] };
}

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

export function UnloadTextLines(
  text: Deno.PointerValue,
  lineCount: int,
): void {
  if (text !== null) lib.UnloadTextLines(text, lineCount);
}

export function TextCopy(src: string): { text: string; bytesCopied: int } {
  const dst = new Uint8Array(cstr(src).byteLength);
  const bytesCopied = lib.TextCopy(dst, cstr(src));
  return { text: readCString(Deno.UnsafePointer.of(dst)), bytesCopied };
}

export function TextIsEqual(text1: string, text2: string): boolean {
  return !!lib.TextIsEqual(cstr(text1), cstr(text2));
}

export function TextLength(text: string): number {
  return lib.TextLength(cstr(text));
}

export function TextSubtext(text: string, position: int, length: int): string {
  return readCString(lib.TextSubtext(cstr(text), position, length));
}

export function TextRemoveSpaces(text: string): string {
  return readCString(lib.TextRemoveSpaces(cstr(text)));
}

export function GetTextBetween(
  text: string,
  begin: string,
  end: string,
): string {
  return readCString(lib.GetTextBetween(cstr(text), cstr(begin), cstr(end)));
}

export function TextReplace(
  text: string,
  search: string,
  replacement: string,
): string {
  return readCString(
    lib.TextReplace(cstr(text), cstr(search), cstr(replacement)),
  );
}

export function TextReplaceAlloc(
  text: string,
  search: string,
  replacement: string,
): string {
  return copyAndFreeCString(
    lib.TextReplaceAlloc(cstr(text), cstr(search), cstr(replacement)),
  );
}

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

export function TextInsert(
  text: string,
  insert: string,
  position: int,
): string {
  return readCString(lib.TextInsert(cstr(text), cstr(insert), position));
}

export function TextInsertAlloc(
  text: string,
  insert: string,
  position: int,
): string {
  return copyAndFreeCString(
    lib.TextInsertAlloc(cstr(text), cstr(insert), position),
  );
}

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

export function TextSplit(text: string, delimiter: string): string[] {
  const count = new Int32Array(1);
  const ptr = lib.TextSplit(
    cstr(text),
    delimiter.charCodeAt(0) || 0,
    Deno.UnsafePointer.of(count.buffer),
  );
  return readCStringArray(ptr, count[0]);
}

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

export function TextFindIndex(text: string, search: string): int {
  return lib.TextFindIndex(cstr(text), cstr(search));
}

export function TextToUpper(text: string): string {
  return readCString(lib.TextToUpper(cstr(text)));
}

export function TextToLower(text: string): string {
  return readCString(lib.TextToLower(cstr(text)));
}

export function TextToPascal(text: string): string {
  return readCString(lib.TextToPascal(cstr(text)));
}

export function TextToSnake(text: string): string {
  return readCString(lib.TextToSnake(cstr(text)));
}

export function TextToCamel(text: string): string {
  return readCString(lib.TextToCamel(cstr(text)));
}

export function TextToInteger(text: string): int {
  return lib.TextToInteger(cstr(text));
}

export function TextToFloat(text: string): float {
  return lib.TextToFloat(cstr(text));
}

// 3D Stuff

export function DrawLine3D(
  startPos: Vector3,
  endPos: Vector3,
  color: Color,
): void {
  lib.DrawLine3D(startPos.buffer, endPos.buffer, color.buffer);
}

export function DrawPoint3D(position: Vector3, color: Color): void {
  lib.DrawPoint3D(position.buffer, color.buffer);
}

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

export function DrawCube(
  position: Vector3,
  width: float,
  height: float,
  length: float,
  color: Color,
): void {
  lib.DrawCube(position.buffer, width, height, length, color.buffer);
}

export function DrawCubeV(
  position: Vector3,
  size: Vector3,
  color: Color,
): void {
  lib.DrawCubeV(position.buffer, size.buffer, color.buffer);
}

export function DrawCubeWires(
  position: Vector3,
  width: float,
  height: float,
  length: float,
  color: Color,
): void {
  lib.DrawCubeWires(position.buffer, width, height, length, color.buffer);
}

export function DrawCubeWiresV(
  position: Vector3,
  size: Vector3,
  color: Color,
): void {
  lib.DrawCubeWiresV(position.buffer, size.buffer, color.buffer);
}

export function DrawSphere(
  center: Vector3,
  radius: float,
  color: Color,
): void {
  lib.DrawSphere(center.buffer, radius, color.buffer);
}

export function DrawSphereEx(
  center: Vector3,
  radius: float,
  rings: int,
  slices: int,
  color: Color,
): void {
  lib.DrawSphereEx(center.buffer, radius, rings, slices, color.buffer);
}

export function DrawSphereWires(
  center: Vector3,
  radius: float,
  rings: int,
  slices: int,
  color: Color,
): void {
  lib.DrawSphereWires(center.buffer, radius, rings, slices, color.buffer);
}

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

export function DrawPlane(center: Vector3, size: Vector2, color: Color): void {
  lib.DrawPlane(center.buffer, size.buffer, color.buffer);
}

export function DrawRay(ray: Ray, color: Color): void {
  lib.DrawRay(ray.buffer, color.buffer);
}

export function DrawGrid(slices: int, spacing: float): void {
  lib.DrawGrid(slices, spacing);
}

export function LoadModel(fileName: string): Model {
  return new Model(lib.LoadModel(new TextEncoder().encode(fileName + "\0")));
}

export function LoadModelFromMesh(mesh: Mesh): Model {
  return new Model(lib.LoadModelFromMesh(mesh.buffer));
}

export function IsModelValid(model: Model): boolean {
  return !!lib.IsModelValid(model.buffer);
}

export function UnloadModel(model: Model): void {
  lib.UnloadModel(model.buffer);
}

export function GetModelBoundingBox(model: Model): BoundingBox {
  const buf = lib.GetModelBoundingBox(model.buffer);
  return BoundingBox.fromBuffer(buf.buffer, buf.byteOffset);
}

export function DrawModel(
  model: Model,
  position: Vector3,
  scale: float,
  color: Color,
): void {
  lib.DrawModel(model.buffer, position.buffer, scale, color.buffer);
}

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

export function DrawBoundingBox(
  box: BoundingBox,
  color: Color,
): void {
  lib.DrawBoundingBox(
    box.buffer,
    color.buffer,
  );
}

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

export function UploadMesh(
  mesh: Mesh,
  dynamic: boolean,
): void {
  lib.UploadMesh(
    mesh.buffer,
    dynamic ? 1 : 0,
  );
}

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

export function UnloadMesh(mesh: Mesh): void {
  lib.UnloadMesh(mesh.buffer);
}

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

export function GetMeshBoundingBox(mesh: Mesh): BoundingBox {
  const buf = lib.GetMeshBoundingBox(mesh.buffer);
  return BoundingBox.fromBuffer(buf.buffer, buf.byteOffset);
}

export function GenMeshTangents(mesh: Mesh): void {
  lib.GenMeshTangents(mesh.buffer);
}

export function ExportMesh(
  mesh: Mesh,
  fileName: string,
): boolean {
  return !!lib.ExportMesh(
    mesh.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

export function ExportMeshAsCode(
  mesh: Mesh,
  fileName: string,
): boolean {
  return !!lib.ExportMeshAsCode(
    mesh.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

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

export function LoadMaterialDefault(): Material {
  return new Material(
    lib.LoadMaterialDefault(),
  );
}

export function IsMaterialValid(material: Material): boolean {
  return !!lib.IsMaterialValid(material.buffer);
}

export function UnloadMaterial(material: Material): void {
  lib.UnloadMaterial(material.buffer);
}

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

export function UpdateModelAnimationBones(
  model: Model,
  anim: ModelAnimation,
  frame: float,
): void {
  UpdateModelAnimation(model, anim, frame);
}

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

export function UnloadModelAnimation(anim: ModelAnimation): void {
  void anim;
  throw new Error(
    "UnloadModelAnimation was removed from raylib 6.0; use UnloadModelAnimations",
  );
}

export function UnloadModelAnimations(
  animations: ModelAnimation[],
): void {
  if (animations.length === 0) return;

  lib.UnloadModelAnimations(
    animations[0].buffer,
    animations.length,
  );
}

export function IsModelAnimationValid(
  model: Model,
  anim: ModelAnimation,
): boolean {
  return !!lib.IsModelAnimationValid(
    model.buffer,
    anim.buffer,
  );
}

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

export function CheckCollisionBoxes(
  box1: BoundingBox,
  box2: BoundingBox,
): boolean {
  return !!lib.CheckCollisionBoxes(
    box1.buffer,
    box2.buffer,
  );
}

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

export function InitAudioDevice(): void {
  lib.InitAudioDevice();
}

export function CloseAudioDevice(): void {
  lib.CloseAudioDevice();
}

export function IsAudioDeviceReady(): boolean {
  return !!lib.IsAudioDeviceReady();
}

export function SetMasterVolume(volume: float): void {
  lib.SetMasterVolume(volume);
}

export function GetMasterVolume(): float {
  return lib.GetMasterVolume();
}

export function LoadWave(fileName: string): Wave {
  const buf = lib.LoadWave(new TextEncoder().encode(fileName + "\0").buffer);
  if (!buf) throw new Error("Failed to load wave");
  return new Wave(buf);
}

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

export function IsWaveValid(wave: Wave): boolean {
  return !!lib.IsWaveValid(wave.buffer);
}

export function LoadSound(fileName: string): Sound {
  const buf = lib.LoadSound(new TextEncoder().encode(fileName + "\0").buffer);
  if (!buf) throw new Error("Failed to load sound");
  return new Sound(buf);
}

export function LoadSoundFromWave(wave: Wave): Sound {
  const buf = lib.LoadSoundFromWave(wave.buffer);
  if (!buf) throw new Error("Failed to load sound from wave");
  return new Sound(buf);
}

export function LoadSoundAlias(source: Sound): Sound {
  const buf = lib.LoadSoundAlias(source.buffer);
  if (!buf) throw new Error("Failed to load sound alias");
  return new Sound(buf);
}

export function IsSoundValid(sound: Sound): boolean {
  return !!lib.IsSoundValid(sound.buffer);
}

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

export function UnloadWave(wave: Wave): void {
  lib.UnloadWave(wave.buffer);
}

export function UnloadSound(sound: Sound): void {
  lib.UnloadSound(sound.buffer);
}

export function UnloadSoundAlias(alias: Sound): void {
  lib.UnloadSoundAlias(alias.buffer);
}

export function ExportWave(
  wave: Wave,
  fileName: string,
): boolean {
  return !!lib.ExportWave(
    wave.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

export function ExportWaveAsCode(
  wave: Wave,
  fileName: string,
): boolean {
  return !!lib.ExportWaveAsCode(
    wave.buffer,
    new TextEncoder().encode(fileName + "\0").buffer,
  );
}

export function PlaySound(sound: Sound): void {
  lib.PlaySound(sound.buffer);
}

export function StopSound(sound: Sound): void {
  lib.StopSound(sound.buffer);
}

export function PauseSound(sound: Sound): void {
  lib.PauseSound(sound.buffer);
}

export function ResumeSound(sound: Sound): void {
  lib.ResumeSound(sound.buffer);
}

export function IsSoundPlaying(sound: Sound): boolean {
  return !!lib.IsSoundPlaying(sound.buffer);
}

export function SetSoundVolume(sound: Sound, volume: float): void {
  lib.SetSoundVolume(sound.buffer, volume);
}

export function SetSoundPitch(sound: Sound, pitch: float): void {
  lib.SetSoundPitch(sound.buffer, pitch);
}

export function SetSoundPan(sound: Sound, pan: float): void {
  lib.SetSoundPan(sound.buffer, pan);
}

export function WaveCopy(wave: Wave): Wave {
  return new Wave(
    lib.WaveCopy(wave.buffer),
  );
}

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

export function UnloadWaveSamples(samples: Float32Array): void {
  void samples;
}

export function LoadMusicStream(fileName: string): Music {
  return new Music(
    lib.LoadMusicStream(
      new TextEncoder().encode(fileName + "\0").buffer,
    ),
  );
}

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

export function IsMusicValid(music: Music): boolean {
  return !!lib.IsMusicValid(music.buffer);
}

export function UnloadMusicStream(music: Music): void {
  lib.UnloadMusicStream(music.buffer);
}

export function PlayMusicStream(music: Music): void {
  lib.PlayMusicStream(music.buffer);
}

export function IsMusicStreamPlaying(music: Music): boolean {
  return !!lib.IsMusicStreamPlaying(music.buffer);
}

export function UpdateMusicStream(music: Music): void {
  lib.UpdateMusicStream(music.buffer);
}

export function StopMusicStream(music: Music): void {
  lib.StopMusicStream(music.buffer);
}

export function PauseMusicStream(music: Music): void {
  lib.PauseMusicStream(music.buffer);
}

export function ResumeMusicStream(music: Music): void {
  lib.ResumeMusicStream(music.buffer);
}

export function SeekMusicStream(music: Music, position: float): void {
  lib.SeekMusicStream(music.buffer, position);
}

export function SetMusicVolume(music: Music, volume: float): void {
  lib.SetMusicVolume(music.buffer, volume);
}

export function SetMusicPitch(music: Music, pitch: float): void {
  lib.SetMusicPitch(music.buffer, pitch);
}

export function SetMusicPan(music: Music, pan: float): void {
  lib.SetMusicPan(music.buffer, pan);
}

export function GetMusicTimeLength(music: Music): float {
  return lib.GetMusicTimeLength(music.buffer);
}

export function GetMusicTimePlayed(music: Music): float {
  return lib.GetMusicTimePlayed(music.buffer);
}

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

export function IsAudioStreamValid(stream: AudioStream): boolean {
  return !!lib.IsAudioStreamValid(stream.buffer);
}

export function UnloadAudioStream(stream: AudioStream): void {
  lib.UnloadAudioStream(stream.buffer);
}

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

export function IsAudioStreamProcessed(stream: AudioStream): boolean {
  return !!lib.IsAudioStreamProcessed(stream.buffer);
}

export function PlayAudioStream(stream: AudioStream): void {
  lib.PlayAudioStream(stream.buffer);
}

export function PauseAudioStream(stream: AudioStream): void {
  lib.PauseAudioStream(stream.buffer);
}

export function ResumeAudioStream(stream: AudioStream): void {
  lib.ResumeAudioStream(stream.buffer);
}

export function IsAudioStreamPlaying(stream: AudioStream): boolean {
  return !!lib.IsAudioStreamPlaying(stream.buffer);
}

export function StopAudioStream(stream: AudioStream): void {
  lib.StopAudioStream(stream.buffer);
}

export function SetAudioStreamVolume(
  stream: AudioStream,
  volume: float,
): void {
  lib.SetAudioStreamVolume(stream.buffer, volume);
}

export function SetAudioStreamPitch(
  stream: AudioStream,
  pitch: float,
): void {
  lib.SetAudioStreamPitch(stream.buffer, pitch);
}

export function SetAudioStreamPan(
  stream: AudioStream,
  pan: float,
): void {
  lib.SetAudioStreamPan(stream.buffer, pan);
}

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

export type AudioCallbackDef = {
  parameters: ["pointer", "u32"];
  result: "void";
};

const audioProcessors = new Set<Deno.UnsafeCallback<AudioCallbackDef>>();

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

export function Clamp(value: float, min: float, max: float): float {
  return lib.Clamp(value, min, max);
}

export function Lerp(start: float, end: float, amount: float): float {
  return lib.Lerp(start, end, amount);
}

export function Normalize(value: float, start: float, end: float): float {
  return lib.Normalize(value, start, end);
}

export function Remap(
  value: float,
  inputStart: float,
  inputEnd: float,
  outputStart: float,
  outputEnd: float,
): float {
  return lib.Remap(value, inputStart, inputEnd, outputStart, outputEnd);
}

export function Wrap(value: float, min: float, max: float): float {
  return lib.Wrap(value, min, max);
}

export function FloatEquals(x: float, y: float): boolean {
  return !!lib.FloatEquals(x, y);
}

export function Vector2Zero(): Vector2 {
  const buf = lib.Vector2Zero();
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2One(): Vector2 {
  const buf = lib.Vector2One();
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Add(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Add(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2AddValue(v: Vector2, add: float): Vector2 {
  const buf = lib.Vector2AddValue(v.buffer, add);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Subtract(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Subtract(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2SubtractValue(v: Vector2, sub: float): Vector2 {
  const buf = lib.Vector2SubtractValue(v.buffer, sub);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Length(v: Vector2): float {
  return lib.Vector2Length(v.buffer);
}

export function Vector2LengthSqr(v: Vector2): float {
  return lib.Vector2LengthSqr(v.buffer);
}

export function Vector2DotProduct(v1: Vector2, v2: Vector2): float {
  return lib.Vector2DotProduct(v1.buffer, v2.buffer);
}

export function Vector2CrossProduct(v1: Vector2, v2: Vector2): float {
  return lib.Vector2CrossProduct(v1.buffer, v2.buffer);
}

export function Vector2Distance(v1: Vector2, v2: Vector2): float {
  return lib.Vector2Distance(v1.buffer, v2.buffer);
}

export function Vector2DistanceSqr(v1: Vector2, v2: Vector2): float {
  return lib.Vector2DistanceSqr(v1.buffer, v2.buffer);
}

export function Vector2Angle(v1: Vector2, v2: Vector2): float {
  return lib.Vector2Angle(v1.buffer, v2.buffer);
}

export function Vector2LineAngle(start: Vector2, end: Vector2): float {
  return lib.Vector2LineAngle(start.buffer, end.buffer);
}

export function Vector2Scale(v: Vector2, scale: float): Vector2 {
  const buf = lib.Vector2Scale(v.buffer, scale);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Multiply(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Multiply(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Negate(v: Vector2): Vector2 {
  const buf = lib.Vector2Negate(v.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Divide(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Divide(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Normalize(v: Vector2): Vector2 {
  const buf = lib.Vector2Normalize(v.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Transform(v: Vector2, mat: Matrix): Vector2 {
  const buf = lib.Vector2Transform(v.buffer, mat.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Lerp(v1: Vector2, v2: Vector2, amount: float): Vector2 {
  const buf = lib.Vector2Lerp(v1.buffer, v2.buffer, amount);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Reflect(v: Vector2, normal: Vector2): Vector2 {
  const buf = lib.Vector2Reflect(v.buffer, normal.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Min(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Min(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Max(v1: Vector2, v2: Vector2): Vector2 {
  const buf = lib.Vector2Max(v1.buffer, v2.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Rotate(v: Vector2, angle: float): Vector2 {
  const buf = lib.Vector2Rotate(v.buffer, angle);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2MoveTowards(
  v: Vector2,
  target: Vector2,
  maxDistance: float,
): Vector2 {
  const buf = lib.Vector2MoveTowards(v.buffer, target.buffer, maxDistance);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Invert(v: Vector2): Vector2 {
  const buf = lib.Vector2Invert(v.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Clamp(v: Vector2, min: Vector2, max: Vector2): Vector2 {
  const buf = lib.Vector2Clamp(v.buffer, min.buffer, max.buffer);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2ClampValue(v: Vector2, min: float, max: float): Vector2 {
  const buf = lib.Vector2ClampValue(v.buffer, min, max);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector2Equals(p: Vector2, q: Vector2): boolean {
  return !!lib.Vector2Equals(p.buffer, q.buffer);
}

export function Vector2Refract(v: Vector2, n: Vector2, r: float): Vector2 {
  const buf = lib.Vector2Refract(v.buffer, n.buffer, r);
  return Vector2.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Zero(): Vector3 {
  const buf = lib.Vector3Zero();
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3One(): Vector3 {
  const buf = lib.Vector3One();
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Add(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Add(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3AddValue(v: Vector3, add: float): Vector3 {
  const buf = lib.Vector3AddValue(v.buffer, add);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Subtract(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Subtract(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3SubtractValue(v: Vector3, sub: float): Vector3 {
  const buf = lib.Vector3SubtractValue(v.buffer, sub);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Scale(v: Vector3, scalar: float): Vector3 {
  const buf = lib.Vector3Scale(v.buffer, scalar);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Multiply(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Multiply(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3CrossProduct(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3CrossProduct(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Perpendicular(v: Vector3): Vector3 {
  const buf = lib.Vector3Perpendicular(v.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Length(v: Vector3): float {
  return lib.Vector3Length(v.buffer);
}

export function Vector3LengthSqr(v: Vector3): float {
  return lib.Vector3LengthSqr(v.buffer);
}

export function Vector3DotProduct(v1: Vector3, v2: Vector3): float {
  return lib.Vector3DotProduct(v1.buffer, v2.buffer);
}

export function Vector3Distance(v1: Vector3, v2: Vector3): float {
  return lib.Vector3Distance(v1.buffer, v2.buffer);
}

export function Vector3DistanceSqr(v1: Vector3, v2: Vector3): float {
  return lib.Vector3DistanceSqr(v1.buffer, v2.buffer);
}

export function Vector3Angle(v1: Vector3, v2: Vector3): float {
  return lib.Vector3Angle(v1.buffer, v2.buffer);
}

export function Vector3Negate(v: Vector3): Vector3 {
  const buf = lib.Vector3Negate(v.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Divide(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Divide(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Normalize(v: Vector3): Vector3 {
  const buf = lib.Vector3Normalize(v.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Project(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Project(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Reject(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Reject(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3OrthoNormalize(v1: Vector3, v2: Vector3): void {
  lib.Vector3OrthoNormalize(
    v1.buffer,
    v2.buffer,
  );
}

export function Vector3Transform(v: Vector3, mat: Matrix): Vector3 {
  const buf = lib.Vector3Transform(v.buffer, mat.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3RotateByQuaternion(v: Vector3, q: Quaternion): Vector3 {
  const buf = lib.Vector3RotateByQuaternion(v.buffer, q.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3RotateByAxisAngle(
  v: Vector3,
  axis: Vector3,
  angle: float,
): Vector3 {
  const buf = lib.Vector3RotateByAxisAngle(v.buffer, axis.buffer, angle);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3MoveTowards(
  v: Vector3,
  target: Vector3,
  maxDistance: float,
): Vector3 {
  const buf = lib.Vector3MoveTowards(v.buffer, target.buffer, maxDistance);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Lerp(v1: Vector3, v2: Vector3, amount: float): Vector3 {
  const buf = lib.Vector3Lerp(v1.buffer, v2.buffer, amount);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

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

export function Vector3Reflect(v: Vector3, normal: Vector3): Vector3 {
  const buf = lib.Vector3Reflect(v.buffer, normal.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Min(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Min(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Max(v1: Vector3, v2: Vector3): Vector3 {
  const buf = lib.Vector3Max(v1.buffer, v2.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Barycenter(
  p: Vector3,
  a: Vector3,
  b: Vector3,
  c: Vector3,
): Vector3 {
  const buf = lib.Vector3Barycenter(p.buffer, a.buffer, b.buffer, c.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

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

export function Vector3ToFloatV(v: Vector3): Float32Array {
  const buf = lib.Vector3ToFloatV(v.buffer);
  return new Float32Array(buf.buffer, buf.byteOffset, 3);
}

export function Vector3Invert(v: Vector3): Vector3 {
  const buf = lib.Vector3Invert(v.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Clamp(v: Vector3, min: Vector3, max: Vector3): Vector3 {
  const buf = lib.Vector3Clamp(v.buffer, min.buffer, max.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3ClampValue(v: Vector3, min: float, max: float): Vector3 {
  const buf = lib.Vector3ClampValue(v.buffer, min, max);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector3Equals(p: Vector3, q: Vector3): boolean {
  return !!lib.Vector3Equals(p.buffer, q.buffer);
}

export function Vector3Refract(v: Vector3, n: Vector3, r: float): Vector3 {
  const buf = lib.Vector3Refract(v.buffer, n.buffer, r);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Zero(): Vector4 {
  const buf = lib.Vector4Zero();
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4One(): Vector4 {
  const buf = lib.Vector4One();
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Add(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Add(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4AddValue(v: Vector4, add: float): Vector4 {
  const buf = lib.Vector4AddValue(v.buffer, add);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Subtract(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Subtract(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4SubtractValue(v: Vector4, add: float): Vector4 {
  const buf = lib.Vector4SubtractValue(v.buffer, add);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Length(v: Vector4): float {
  return lib.Vector4Length(v.buffer);
}

export function Vector4LengthSqr(v: Vector4): float {
  return lib.Vector4LengthSqr(v.buffer);
}

export function Vector4DotProduct(v1: Vector4, v2: Vector4): float {
  return lib.Vector4DotProduct(v1.buffer, v2.buffer);
}

export function Vector4Distance(v1: Vector4, v2: Vector4): float {
  return lib.Vector4Distance(v1.buffer, v2.buffer);
}

export function Vector4DistanceSqr(v1: Vector4, v2: Vector4): float {
  return lib.Vector4DistanceSqr(v1.buffer, v2.buffer);
}

export function Vector4Scale(v: Vector4, scale: float): Vector4 {
  const buf = lib.Vector4Scale(v.buffer, scale);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Multiply(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Multiply(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Negate(v: Vector4): Vector4 {
  const buf = lib.Vector4Negate(v.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Divide(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Divide(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Normalize(v: Vector4): Vector4 {
  const buf = lib.Vector4Normalize(v.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Min(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Min(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Max(v1: Vector4, v2: Vector4): Vector4 {
  const buf = lib.Vector4Max(v1.buffer, v2.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Lerp(v1: Vector4, v2: Vector4, amount: float): Vector4 {
  const buf = lib.Vector4Lerp(v1.buffer, v2.buffer, amount);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4MoveTowards(
  v: Vector4,
  target: Vector4,
  maxDistance: float,
): Vector4 {
  const buf = lib.Vector4MoveTowards(v.buffer, target.buffer, maxDistance);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Invert(v: Vector4): Vector4 {
  const buf = lib.Vector4Invert(v.buffer);
  return Vector4.fromBuffer(buf.buffer, buf.byteOffset);
}

export function Vector4Equals(p: Vector4, q: Vector4): boolean {
  return !!lib.Vector4Equals(p.buffer, q.buffer);
}

export function MatrixDeterminant(mat: Matrix): float {
  return lib.MatrixDeterminant(mat.buffer);
}

export function MatrixTrace(mat: Matrix): float {
  return lib.MatrixTrace(mat.buffer);
}

export function MatrixTranspose(mat: Matrix): Matrix {
  const buf = lib.MatrixTranspose(mat.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixInvert(mat: Matrix): Matrix {
  const buf = lib.MatrixInvert(mat.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixIdentity(): Matrix {
  const buf = lib.MatrixIdentity();
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixAdd(left: Matrix, right: Matrix): Matrix {
  const buf = lib.MatrixAdd(left.buffer, right.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixSubtract(left: Matrix, right: Matrix): Matrix {
  const buf = lib.MatrixSubtract(left.buffer, right.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixMultiply(left: Matrix, right: Matrix): Matrix {
  const buf = lib.MatrixMultiply(left.buffer, right.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixMultiplyValue(mat: Matrix, value: float): Matrix {
  const buf = lib.MatrixMultiplyValue(mat.buffer, value);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixTranslate(x: float, y: float, z: float): Matrix {
  const buf = lib.MatrixTranslate(x, y, z);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixRotate(axis: Vector3, angle: float): Matrix {
  const buf = lib.MatrixRotate(axis.buffer, angle);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixRotateX(angle: float): Matrix {
  const buf = lib.MatrixRotateX(angle);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixRotateY(angle: float): Matrix {
  const buf = lib.MatrixRotateY(angle);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixRotateZ(angle: float): Matrix {
  const buf = lib.MatrixRotateZ(angle);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixRotateXYZ(angle: Vector3): Matrix {
  const buf = lib.MatrixRotateXYZ(angle.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixRotateZYX(angle: Vector3): Matrix {
  const buf = lib.MatrixRotateZYX(angle.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixScale(x: float, y: float, z: float): Matrix {
  const buf = lib.MatrixScale(x, y, z);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

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

export function MatrixPerspective(
  fovY: float,
  aspect: float,
  nearPlane: float,
  farPlane: float,
): Matrix {
  const buf = lib.MatrixPerspective(fovY, aspect, nearPlane, farPlane);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

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

export function MatrixLookAt(
  eye: Vector3,
  target: Vector3,
  up: Vector3,
): Matrix {
  const buf = lib.MatrixLookAt(eye.buffer, target.buffer, up.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function MatrixToFloatV(mat: Matrix): Float32Array {
  const buf = lib.MatrixToFloatV(mat.buffer);
  return new Float32Array(buf.buffer, buf.byteOffset, 16);
}

export function QuaternionAdd(q1: Quaternion, q2: Quaternion): Quaternion {
  const buf = lib.QuaternionAdd(q1.buffer, q2.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionAddValue(q: Quaternion, add: float): Quaternion {
  const buf = lib.QuaternionAddValue(q.buffer, add);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionSubtract(q1: Quaternion, q2: Quaternion): Quaternion {
  const buf = lib.QuaternionSubtract(q1.buffer, q2.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionSubtractValue(q: Quaternion, sub: float): Quaternion {
  const buf = lib.QuaternionSubtractValue(q.buffer, sub);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionIdentity(): Quaternion {
  const buf = lib.QuaternionIdentity();
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionLength(q: Quaternion): float {
  return lib.QuaternionLength(q.buffer);
}

export function QuaternionNormalize(q: Quaternion): Quaternion {
  const buf = lib.QuaternionNormalize(q.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionInvert(q: Quaternion): Quaternion {
  const buf = lib.QuaternionInvert(q.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionMultiply(q1: Quaternion, q2: Quaternion): Quaternion {
  const buf = lib.QuaternionMultiply(q1.buffer, q2.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionScale(q: Quaternion, mul: float): Quaternion {
  const buf = lib.QuaternionScale(q.buffer, mul);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionDivide(q1: Quaternion, q2: Quaternion): Quaternion {
  const buf = lib.QuaternionDivide(q1.buffer, q2.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionLerp(
  q1: Quaternion,
  q2: Quaternion,
  amount: float,
): Quaternion {
  const buf = lib.QuaternionLerp(q1.buffer, q2.buffer, amount);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionNlerp(
  q1: Quaternion,
  q2: Quaternion,
  amount: float,
): Quaternion {
  const buf = lib.QuaternionNlerp(q1.buffer, q2.buffer, amount);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionSlerp(
  q1: Quaternion,
  q2: Quaternion,
  amount: float,
): Quaternion {
  const buf = lib.QuaternionSlerp(q1.buffer, q2.buffer, amount);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

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

export function QuaternionFromVector3ToVector3(
  from: Vector3,
  to: Vector3,
): Quaternion {
  const buf = lib.QuaternionFromVector3ToVector3(from.buffer, to.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionFromMatrix(mat: Matrix): Quaternion {
  const buf = lib.QuaternionFromMatrix(mat.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionToMatrix(q: Quaternion): Matrix {
  const buf = lib.QuaternionToMatrix(q.buffer);
  return Matrix.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionFromAxisAngle(
  axis: Vector3,
  angle: float,
): Quaternion {
  const buf = lib.QuaternionFromAxisAngle(axis.buffer, angle);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

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

export function QuaternionFromEuler(
  pitch: float,
  yaw: float,
  roll: float,
): Quaternion {
  const buf = lib.QuaternionFromEuler(pitch, yaw, roll);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionToEuler(q: Quaternion): Vector3 {
  const buf = lib.QuaternionToEuler(q.buffer);
  return Vector3.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionTransform(q: Quaternion, mat: Matrix): Quaternion {
  const buf = lib.QuaternionTransform(q.buffer, mat.buffer);
  return Quaternion.fromBuffer(buf.buffer, buf.byteOffset);
}

export function QuaternionEquals(p: Quaternion, q: Quaternion): boolean {
  return !!lib.QuaternionEquals(p.buffer, q.buffer);
}

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
