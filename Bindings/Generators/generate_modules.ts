// Generate exhaustive separation-of-concerns facades from the raylib 6.0 API.
// deno-lint-ignore-file no-explicit-any

const api = JSON.parse(
  Deno.readTextFileSync(new URL("./raylib_api.json", import.meta.url)),
);

type FunctionDef = { name: string; description?: string };
type ModuleDef = {
  description: string;
  functions: Set<string>;
  include?: string[];
};

const allFunctions = api.functions as FunctionDef[];
const indexOf = (name: string) => {
  const index = allFunctions.findIndex((fn) => fn.name === name);
  if (index < 0) throw new Error(`API boundary function not found: ${name}`);
  return index;
};
const namesBetween = (start: string, end?: string) => {
  const from = indexOf(start);
  const to = end ? indexOf(end) : allFunctions.length;
  return allFunctions.slice(from, to).map((fn) => fn.name);
};
const set = (values: Iterable<string>) => new Set(values);
const union = (...groups: Iterable<string>[]) =>
  set(groups.flatMap((g) => [...g]));
const matching = (group: Iterable<string>, pattern: RegExp) =>
  set([...group].filter((name) => pattern.test(name)));
const selected = (group: Iterable<string>, names: string[]) => {
  const available = new Set(group);
  return set(names.filter((name) => available.has(name)));
};

// Official raylib.h module boundaries in the pinned 6.0 header.
const core = set(namesBetween("InitWindow", "SetShapesTexture"));
const shapes = set(namesBetween("SetShapesTexture", "LoadImage"));
const textures = set(namesBetween("LoadImage", "GetFontDefault"));
const text = set(namesBetween("GetFontDefault", "DrawLine3D"));
const models = set(namesBetween("DrawLine3D", "InitAudioDevice"));
const audio = set(namesBetween("InitAudioDevice", "Clamp"));
const math = set(namesBetween("Clamp", "GetCameraForward"));
const cameraControls = set(namesBetween("GetCameraForward", "rlMatrixMode"));
const rlgl = set(namesBetween("rlMatrixMode"));

const modules = new Map<string, ModuleDef>();
const define = (
  name: string,
  description: string,
  functions: Iterable<string>,
  include: string[] = [],
) => modules.set(name, { description, functions: set(functions), include });

// Core and platform
define(
  "Core",
  "Core application, platform, timing, input, files, and automation APIs.",
  core,
);
define(
  "Application",
  "Application configuration and platform integration.",
  selected(core, ["SetConfigFlags", "OpenURL"]),
  ["ConfigFlags"],
);
define(
  "Window",
  "Window lifecycle, state, sizing, position, title, and icons.",
  matching(core, /Window|Fullscreen|Maximize|Minimize|RestoreWindow/),
  ["ConfigFlags", "Image", "Vector2"],
);
define(
  "Monitor",
  "Monitor discovery, dimensions, refresh rate, and DPI.",
  matching(core, /Monitor|WindowScaleDPI/),
  ["Vector2"],
);
define(
  "Screen",
  "Screen and render dimensions, screenshots, and screen-space helpers.",
  union(
    matching(core, /Screen|RenderWidth|RenderHeight/),
    selected(core, ["TakeScreenshot"]),
  ),
  ["Camera2D", "Camera3D", "Ray", "Vector2", "Vector3"],
);
define(
  "Clipboard",
  "Clipboard text and image access.",
  matching(core, /Clipboard/),
  ["Image"],
);
define(
  "Events",
  "Window event waiting and polling behavior.",
  matching(core, /EventWaiting/),
);
define(
  "Timing",
  "Frame timing, elapsed time, FPS, and waiting.",
  selected(core, [
    "SwapScreenBuffer",
    "WaitTime",
    "SetTargetFPS",
    "GetFrameTime",
    "GetTime",
    "GetFPS",
  ]),
);
define(
  "Logging",
  "Trace logging levels and callbacks.",
  matching(core, /TraceLog/),
  ["TraceLogLevel"],
);
define(
  "Memory",
  "raylib memory allocation and release.",
  matching(core, /^Mem/),
);
define(
  "Random",
  "Random seeds, values, and unique sequences.",
  matching(core, /Random/),
);
define(
  "Automation",
  "Automation event recording, playback, loading, and export.",
  matching(core, /Automation|EventRecording|PlayAutomation/),
  ["AutomationEvent", "AutomationEventList"],
);

// Files and data
define(
  "Files",
  "Binary and text file loading, saving, copying, moving, and inspection.",
  matching(core, /File|Dropped/),
  ["FilePathList"],
);
define(
  "Directories",
  "Directory creation, traversal, counting, and working-directory control.",
  matching(core, /Directory/),
  ["FilePathList"],
);
define(
  "Paths",
  "Path and filename inspection.",
  matching(core, /Path|FileName|FileExtension/),
);
define(
  "DroppedFiles",
  "Drag-and-drop file handling.",
  matching(core, /Dropped/),
  ["FilePathList"],
);
define(
  "Compression",
  "Compression, decompression, and Base64 conversion.",
  matching(core, /Compress|Decompress|Base64/),
);
define(
  "Hashing",
  "CRC32, MD5, SHA-1, and SHA-256 hashing.",
  matching(core, /CRC32|MD5|SHA1|SHA256/),
);

// Input
const keyboard = matching(core, /Key|ExitKey/);
const mouse = matching(core, /Mouse/);
const cursor = matching(core, /Cursor/);
const gamepad = matching(core, /Gamepad/);
const touch = matching(core, /Touch/);
const gestures = matching(core, /Gesture/);
define(
  "Keyboard",
  "Keyboard state, queues, repetition, and exit-key control.",
  keyboard,
  ["KeyboardKey"],
);
define(
  "Mouse",
  "Mouse buttons, position, motion, wheel, and cursor selection.",
  union(mouse, cursor),
  ["MouseButton", "MouseCursor", "Vector2"],
);
define("Cursor", "Cursor visibility, locking, and shape controls.", cursor, [
  "MouseCursor",
]);
define(
  "Gamepad",
  "Gamepad discovery, buttons, axes, vibration, and mappings.",
  gamepad,
  ["GamepadAxis", "GamepadButton"],
);
define("Touch", "Touch points, positions, and identifiers.", touch, [
  "Vector2",
]);
define(
  "Gestures",
  "Gesture enabling, recognition, vectors, angles, and duration.",
  gestures,
  ["Gesture", "Vector2"],
);
define(
  "Input",
  "All keyboard, mouse, cursor, gamepad, touch, and gesture APIs.",
  union(keyboard, mouse, cursor, gamepad, touch, gestures),
);

// Drawing and rendering modes
const drawing = selected(core, [
  "ClearBackground",
  "BeginDrawing",
  "EndDrawing",
  "BeginMode2D",
  "EndMode2D",
  "BeginMode3D",
  "EndMode3D",
  "BeginTextureMode",
  "EndTextureMode",
  "BeginShaderMode",
  "EndShaderMode",
  "BeginBlendMode",
  "EndBlendMode",
  "BeginScissorMode",
  "EndScissorMode",
  "BeginVrStereoMode",
  "EndVrStereoMode",
]);
define(
  "Drawing",
  "Drawing lifecycle and 2D, 3D, texture, shader, blend, scissor, and VR modes.",
  drawing,
  ["BlendMode", "Camera2D", "Camera3D", "Color", "RenderTexture", "Shader"],
);
define("Blend", "Blend-mode drawing controls.", matching(core, /BlendMode/), [
  "BlendMode",
]);
define(
  "Scissor",
  "Scissor-mode drawing controls.",
  matching(core, /ScissorMode/),
);
const shaderFunctions = union(
  matching(core, /Shader/),
  matching(models, /Shader/),
);
define(
  "Shaders",
  "Shader loading, validation, locations, uniforms, and drawing mode.",
  shaderFunctions,
  [
    "Matrix",
    "Shader",
    "ShaderAttributeDataType",
    "ShaderLocationIndex",
    "ShaderUniformDataType",
    "Texture",
  ],
);
define(
  "RenderTexture",
  "Render-target texture lifecycle and drawing mode.",
  union(matching(core, /TextureMode/), matching(textures, /RenderTexture/)),
  ["RenderTexture", "Texture"],
);
define(
  "VR",
  "VR stereo configuration and rendering.",
  matching(core, /Vr|Stereo/),
  ["VrDeviceInfo", "VrStereoConfig"],
);
define(
  "Colors",
  "Color conversion, normalization, tinting, fading, blending, and constants.",
  matching(textures, /Color|Fade/),
  ["Color", "Vector3", "Vector4"],
);

// Images and textures
define(
  "Image",
  "Image loading, generation, manipulation, drawing, colors, palettes, and export.",
  matching(textures, /Image/),
  ["Color", "Font", "Image", "PixelFormat", "Rectangle", "Vector2"],
);
define(
  "Texture",
  "Texture loading, updating, filtering, wrapping, mipmaps, and drawing.",
  matching(textures, /Texture|DrawTexture/),
  [
    "Color",
    "Image",
    "NPatchInfo",
    "PixelFormat",
    "Rectangle",
    "RenderTexture",
    "RenderTexture2D",
    "Texture",
    "Texture2D",
    "TextureFilter",
    "TextureWrap",
    "Vector2",
  ],
);
define(
  "Cubemap",
  "Cubemap loading and layout handling.",
  matching(textures, /Cubemap/),
  ["CubemapLayout", "Image", "Texture"],
);
define(
  "TextureDrawing",
  "Texture, source rectangle, transformed, and N-patch drawing.",
  matching(textures, /^DrawTexture/),
  ["Color", "NPatchInfo", "NPatchLayout", "Rectangle", "Texture", "Vector2"],
);

// Shapes and collision
const collision2D = matching(shapes, /Collision/);
const shapes3D = matching(
  models,
  /^Draw(Line3D|Point3D|Circle3D|Triangle3D|TriangleStrip3D|Cube|Sphere|Cylinder|Capsule|Plane|Ray|Grid)/,
);
const collision3D = matching(models, /Collision|BoundingBox/);
define(
  "Shapes2D",
  "2D pixels, lines, circles, ellipses, rings, rectangles, triangles, polygons, and sectors.",
  shapes,
  ["Color", "Rectangle", "Texture", "Vector2"],
);
define(
  "Shapes3D",
  "3D lines, points, triangles, cubes, spheres, cylinders, capsules, planes, rays, and grids.",
  shapes3D,
  ["Camera3D", "Color", "Ray", "Vector2", "Vector3"],
);
define(
  "Splines",
  "Linear, Bézier, Catmull-Rom, and basis spline drawing and evaluation.",
  matching(shapes, /Spline/),
  ["Color", "Vector2"],
);
define(
  "Collision2D",
  "2D point, line, circle, rectangle, triangle, and polygon collisions.",
  collision2D,
  ["Rectangle", "Vector2"],
);
define(
  "Collision3D",
  "3D boxes, spheres, rays, meshes, and triangle collisions.",
  collision3D,
  ["BoundingBox", "Mesh", "Ray", "RayCollision", "Vector3"],
);
define(
  "Collision",
  "All 2D and 3D collision APIs.",
  union(collision2D, collision3D),
);
define(
  "Shapes",
  "Complete 2D and 3D shape drawing, splines, and shape collisions.",
  union(shapes, shapes3D, collision3D),
  [
    "BoundingBox",
    "Color",
    "Ray",
    "RayCollision",
    "Rectangle",
    "Texture",
    "Vector2",
    "Vector3",
  ],
);

// Text and fonts
define(
  "Text",
  "Text drawing, measuring, formatting, UTF-8, codepoints, fonts, and glyphs.",
  text,
  ["Color", "Font", "GlyphInfo", "Rectangle", "Texture", "Vector2"],
);
define(
  "Font",
  "Font loading, generation, validation, export, and unloading.",
  matching(text, /Font/),
  ["Font", "FontType", "GlyphInfo", "Image", "Rectangle", "Texture"],
);
define(
  "Glyph",
  "Glyph lookup, atlases, codepoints, and UTF-8 conversion.",
  matching(text, /Glyph|Codepoint|UTF8/),
  ["Font", "GlyphInfo", "Rectangle"],
);

// Models and meshes
define(
  "Model",
  "Complete 3D models, meshes, materials, animation, drawing, and collision API.",
  models,
  [
    "BoneInfo",
    "BoundingBox",
    "Material",
    "MaterialMap",
    "MaterialMapIndex",
    "Mesh",
    "Model",
    "ModelAnimation",
    "ModelSkeleton",
    "Ray",
    "RayCollision",
    "Shader",
    "Texture",
    "Transform",
    "Vector2",
    "Vector3",
  ],
);
define(
  "Mesh",
  "Mesh generation, upload, update, drawing, export, tangents, and bounds.",
  matching(models, /Mesh|GenMesh/),
  ["BoundingBox", "Material", "Mesh", "Transform"],
);
define(
  "Material",
  "Material loading, maps, textures, shaders, and assignment.",
  matching(models, /Material/),
  ["Color", "Material", "MaterialMap", "MaterialMapIndex", "Shader", "Texture"],
);
define(
  "Animation",
  "Model animation loading, validation, update, interpolation, and pose APIs.",
  matching(models, /Animation|Pose/),
  ["BoneInfo", "Model", "ModelAnimation", "Transform"],
);
define(
  "Skeleton",
  "Skeleton, bone, bind-pose, and transform management.",
  matching(models, /Skeleton|Bone|Pose/),
  ["BoneInfo", "Model", "ModelSkeleton", "Transform"],
);
define(
  "ModelCollision",
  "Model, mesh, bounding-box, and ray collision queries.",
  collision3D,
  ["BoundingBox", "Mesh", "Ray", "RayCollision", "Vector3"],
);

// Cameras and coordinates
const cameraCore = matching(core, /Camera/);
const coordinates = matching(core, /WorldToScreen|ScreenToWorld/);
define(
  "Camera2D",
  "2D camera drawing and coordinate conversion.",
  union(
    selected(core, ["BeginMode2D", "EndMode2D"]),
    matching(coordinates, /2D/),
  ),
  ["Camera2D", "Matrix", "Vector2"],
);
define(
  "Camera3D",
  "3D camera drawing, matrices, rays, and coordinate conversion.",
  union(
    selected(core, ["BeginMode3D", "EndMode3D"]),
    matching(core, /CameraMatrix|WorldToScreen|ScreenToWorldRay/),
    cameraControls,
  ),
  [
    "Camera3D",
    "CameraMode",
    "CameraProjection",
    "Matrix",
    "Ray",
    "Vector2",
    "Vector3",
  ],
);
define(
  "CameraControls",
  "rcamera movement, rotation, direction, view, and projection controls.",
  cameraControls,
  ["Camera3D", "Matrix", "Vector3"],
);
define(
  "Coordinates",
  "World, screen, 2D camera, and screen-ray coordinate conversion.",
  coordinates,
  ["Camera2D", "Camera3D", "Ray", "Vector2", "Vector3"],
);
define(
  "Camera",
  "Complete 2D, 3D, coordinate conversion, and rcamera controls.",
  union(
    cameraCore,
    coordinates,
    cameraControls,
    selected(core, ["BeginMode2D", "EndMode2D", "BeginMode3D", "EndMode3D"]),
  ),
  [
    "Camera2D",
    "Camera3D",
    "CameraMode",
    "CameraProjection",
    "Matrix",
    "Ray",
    "Vector2",
    "Vector3",
  ],
);

// Audio
define(
  "Audio",
  "Complete audio device, wave, sound, music, and stream API.",
  audio,
  ["AudioStream", "Music", "Sound", "Wave"],
);
define(
  "AudioDevice",
  "Audio device lifecycle and master-volume controls.",
  matching(audio, /AudioDevice|MasterVolume/),
);
define(
  "Wave",
  "Wave loading, validation, copying, cropping, formatting, samples, and export.",
  matching(audio, /Wave/),
  ["Wave"],
);
define(
  "Sound",
  "Sound loading, aliases, playback, state, and properties.",
  matching(audio, /Sound/),
  ["Sound", "Wave"],
);
define(
  "Music",
  "Streamed music loading, playback, seeking, state, and timing.",
  matching(audio, /Music/),
  ["Music"],
);
define(
  "AudioStream",
  "Raw audio streams, callbacks, processors, buffering, and playback.",
  matching(audio, /AudioStream|AudioMixedProcessor/),
  ["AudioStream"],
);

// raymath
define(
  "Math",
  "Complete raymath scalar, vector, matrix, and quaternion API.",
  math,
  [
    "Matrix",
    "Quaternion",
    "Vector2",
    "Vector3",
    "Vector4",
    "float3",
    "float16",
  ],
);
define(
  "ScalarMath",
  "Scalar clamp, interpolation, normalization, remapping, wrapping, and equality.",
  selected(math, [
    "Clamp",
    "Lerp",
    "Normalize",
    "Remap",
    "Wrap",
    "FloatEquals",
  ]),
);
define(
  "Vector2",
  "Vector2 construction, arithmetic, geometry, interpolation, and transformation.",
  matching(math, /^Vector2/),
  ["Matrix", "Vector2"],
);
define(
  "Vector3",
  "Vector3 construction, arithmetic, geometry, projection, and transformation.",
  matching(math, /^Vector3/),
  ["Matrix", "Quaternion", "Vector3"],
);
define(
  "Vector4",
  "Vector4 construction, arithmetic, interpolation, and equality.",
  matching(math, /^Vector4/),
  ["Vector4"],
);
define(
  "Matrix",
  "Matrix construction, arithmetic, transforms, projection, composition, and decomposition.",
  matching(math, /^Matrix/),
  ["Matrix", "Quaternion", "Vector3"],
);
define(
  "Quaternion",
  "Quaternion construction, arithmetic, interpolation, and conversion.",
  matching(math, /^Quaternion/),
  ["Matrix", "Quaternion", "Vector3"],
);

// rlgl low-level rendering
define(
  "Rlgl",
  "Complete low-level rlgl API, constants, enums, and render structures.",
  rlgl,
  ["Matrix", "rlDrawCall", "rlRenderBatch", "rlVertexBuffer"],
);
define(
  "ImmediateMode",
  "Low-level matrix stack and immediate-mode vertex drawing.",
  matching(
    rlgl,
    /^rl(Matrix|Push|Pop|LoadIdentity|Translate|Rotate|Scale|MultMatrix|Frustum|Ortho|Viewport|SetClip|GetCull|Begin$|End$|Vertex|TexCoord|Normal|Color)/,
  ),
  ["Matrix"],
);
define(
  "RenderState",
  "Low-level textures, shaders, blending, depth, culling, scissor, wireframe, line, point, and stereo state.",
  matching(
    rlgl,
    /^rl(Enable|Disable|Active|SetBlend|SetCull|Scissor|Clear|CheckErrors|ColorMask|SetLine|GetLine|SetPoint|GetPoint|IsStereo)/,
  ),
);
define(
  "RenderBatch",
  "Low-level render-batch allocation, activation, drawing, and limits.",
  matching(rlgl, /RenderBatch|^rlSetTexture$/),
  ["rlDrawCall", "rlRenderBatch", "rlVertexBuffer"],
);
define(
  "VertexBuffer",
  "VAOs, VBOs, vertex attributes, vertex arrays, and instanced drawing.",
  matching(rlgl, /Vertex|Attribute/),
  ["rlVertexBuffer"],
);
define(
  "Framebuffer",
  "Low-level framebuffer allocation, binding, attachment, copy, and resize.",
  matching(rlgl, /Framebuffer|DrawBuffers/),
);
define(
  "ShaderBuffer",
  "Shader storage buffers, compute dispatch, and image-texture binding.",
  matching(rlgl, /ShaderBuffer|ComputeShader|ImageTexture/),
);
define(
  "LowLevelTexture",
  "Low-level texture allocation, formats, upload, download, mipmaps, and deletion.",
  matching(rlgl, /Texture|PixelFormat/),
);
define(
  "LowLevelShader",
  "Low-level shader compilation, programs, locations, uniforms, and activation.",
  matching(rlgl, /Shader|Uniform|Location/),
  ["Matrix"],
);

// Convenience aggregates
define(
  "Graphics",
  "All drawing, shapes, textures, text, models, shaders, cameras, and low-level rendering.",
  union(
    drawing,
    shapes,
    textures,
    text,
    models,
    shaderFunctions,
    cameraControls,
    rlgl,
  ),
);
define(
  "Assets",
  "Image, texture, font, model, material, animation, wave, sound, and music asset APIs.",
  union(
    textures,
    text,
    matching(models, /Load|Unload|Export|Is/),
    matching(audio, /Load|Unload|Export|Is/),
  ),
);

const functionModules = new Map<string, string[]>();
for (const fn of allFunctions) functionModules.set(fn.name, []);
for (const [moduleName, module] of modules) {
  for (const functionName of module.functions) {
    functionModules.get(functionName)?.push(moduleName);
  }
}

const uncovered = [...functionModules]
  .filter(([, memberships]) => memberships.length === 0)
  .map(([name]) => name);
if (uncovered.length > 0) {
  throw new Error(`Functions missing module coverage: ${uncovered.join(", ")}`);
}

const rlglIncludes = [
  ...api.enums.filter((value: any) => value.name.startsWith("rl")).flatMap(
    (
      value: any,
    ) => [value.name, ...value.values.map((entry: any) => entry.name)],
  ),
  ...api.defines.filter((value: any) =>
    value.name.startsWith("RL_") && typeof value.value === "number"
  ).map((value: any) => value.name),
];
modules.get("Rlgl")!.include!.push(...rlglIncludes);

for (const [name, module] of modules) {
  const exports = [...new Set([...module.functions, ...(module.include ?? [])])]
    .sort();
  const output = [
    `/** ${module.description} */`,
    "export {",
    ...exports.map((value) => `  ${value},`),
    '} from "../Raylib/raylib.ts";',
    "",
  ].join("\n");
  await Deno.writeTextFile(
    new URL(`../../Modules/${name}.ts`, import.meta.url),
    output,
  );
}

// Compatibility aliases retained from earlier releases.
await Deno.writeTextFile(
  new URL("../../Modules/Models.ts", import.meta.url),
  '/** @deprecated Prefer `Modules/Model`. */\nexport * from "./Model.ts";\n',
);
await Deno.writeTextFile(
  new URL("../../Modules/Windows.ts", import.meta.url),
  '/** @deprecated Prefer `Modules/Window`. */\nexport * from "./Window.ts";\n',
);

const moduleNames = [...modules.keys()].sort();
const modOutput = [
  ...moduleNames.map((name) => `export * as ${name} from "./${name}.ts";`),
  'export * as Models from "./Models.ts";',
  'export * as Windows from "./Windows.ts";',
  "",
].join("\n");
await Deno.writeTextFile(
  new URL("../../Modules/mod.ts", import.meta.url),
  modOutput,
);

const manifestOutput = [
  "// This file is generated by generate_modules.ts",
  `export const MODULE_NAMES = ${
    JSON.stringify(moduleNames, null, 2)
  } as const;`,
  `export const FUNCTION_MODULES = ${
    JSON.stringify(Object.fromEntries(functionModules), null, 2)
  } as const;`,
  "",
].join("\n");
await Deno.writeTextFile(
  new URL("../../Modules/manifest.ts", import.meta.url),
  manifestOutput,
);

// Keep JSR subpath exports synchronized with the generated module list.
const denoJsonUrl = new URL("../../deno.json", import.meta.url);
const denoJson = JSON.parse(await Deno.readTextFile(denoJsonUrl));
for (const key of Object.keys(denoJson.exports)) {
  if (
    key.startsWith("./Modules/") && key !== "./Modules/Models" &&
    key !== "./Modules/Windows"
  ) {
    delete denoJson.exports[key];
  }
}
denoJson.exports["./Modules"] = "./Modules/mod.ts";
for (const name of moduleNames) {
  denoJson.exports[`./Modules/${name}`] = `./Modules/${name}.ts`;
}
denoJson.exports["./Modules/Models"] = "./Modules/Models.ts";
denoJson.exports["./Modules/Windows"] = "./Modules/Windows.ts";
await Deno.writeTextFile(denoJsonUrl, `${JSON.stringify(denoJson, null, 2)}\n`);
