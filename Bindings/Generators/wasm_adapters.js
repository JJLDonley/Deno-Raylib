// Embedded inside createBackend by generate_wasm_bridge.ts.
// Explicit adapters match the public TypeScript wrappers, not raw C signatures.
/* global backend, module, Structs, allocate, malloc, copyStruct */

// Track temporary allocations in a scope, including when a later allocation fails.
const withMemory = (action) => {
  const pointers = [];
  const alloc = (value) => {
    const pointer = typeof value === "number" ? malloc(value) : allocate(value);
    pointers.push(pointer);
    return pointer;
  };
  try {
    return action(alloc);
  } finally {
    for (const pointer of pointers) module._free(pointer);
  }
};

// Desktop convenience wrappers return typed arrays, not float3/float16 structs.
for (
  const [name, resultType, count] of [
    ["Vector3ToFloatV", "float3", 3],
    ["MatrixToFloatV", "float16", 16],
  ]
) {
  const call = module.cwrap(`dr_${name}`, null, ["number", "number"]);
  backend[name] = (value) =>
    withMemory((alloc) => {
      const result = alloc(Structs[resultType].SIZE);
      call(result, alloc(value));
      return new Float32Array(
        module.HEAPU8.slice(result, result + count * 4).buffer,
      );
    });
}

const droppedFiles = module.cwrap("dr_LoadDroppedFiles", null, ["number"]);
const freeDroppedFiles = module.cwrap("dr_UnloadDroppedFiles", null, [
  "number",
]);
backend.LoadDroppedFiles = () =>
  withMemory((alloc) => {
    const result = alloc(Structs.FilePathList.SIZE);
    droppedFiles(result);
    try {
      const list = copyStruct("FilePathList", result);
      const paths = [];
      for (let index = 0; index < list.count; index++) {
        const pointer = new DataView(module.HEAPU8.buffer).getUint32(
          Number(list.pathsPtr) + index * 4,
          true,
        );
        paths.push(module.UTF8ToString(pointer));
      }
      return paths;
    } finally {
      freeDroppedFiles(result);
    }
  });

const decompose = module.cwrap("dr_MatrixDecompose", null, [
  "number",
  "number",
  "number",
  "number",
]);
backend.MatrixDecompose = (matrix) =>
  withMemory((alloc) => {
    const mat = alloc(matrix);
    const translation = alloc(Structs.Vector3.SIZE);
    const rotation = alloc(Structs.Vector4.SIZE);
    const scale = alloc(Structs.Vector3.SIZE);
    decompose(mat, translation, rotation, scale);
    return {
      translation: copyStruct("Vector3", translation),
      rotation: copyStruct("Vector4", rotation),
      scale: copyStruct("Vector3", scale),
    };
  });

const windowIcons = module.cwrap("dr_SetWindowIcons", null, [
  "number",
  "number",
]);
backend.SetWindowIcons = (images) =>
  withMemory((alloc) => {
    if (!Array.isArray(images)) throw new TypeError("Expected an Image array");
    const pointer = images.length
      ? alloc(images.length * Structs.Image.SIZE)
      : 0;
    images.forEach((image, index) => {
      if (
        !(image.buffer instanceof Uint8Array) ||
        image.buffer.length !== Structs.Image.SIZE
      ) {
        throw new TypeError("Expected a Web Image");
      }
      module.HEAPU8.set(image.buffer, pointer + index * Structs.Image.SIZE);
    });
    windowIcons(pointer, images.length);
  });

const textCopy = module.cwrap("dr_TextCopy", "number", ["number", "string"]);
backend.TextCopy = (src) =>
  withMemory((alloc) => {
    const dst = alloc(new TextEncoder().encode(src).length + 1);
    const bytesCopied = textCopy(dst, src);
    return { text: module.UTF8ToString(dst), bytesCopied };
  });

// Copy into JS-owned memory so Wasm memory growth cannot invalidate the result.
// Release the raylib allocation immediately; the matching unload is a no-op.
const imageColors = module.cwrap("dr_LoadImageColors", "number", ["number"]);
const imagePalette = module.cwrap("dr_LoadImagePalette", "number", [
  "number",
  "number",
  "number",
]);
const freeColors = module.cwrap("dr_UnloadImageColors", null, ["number"]);
const freePalette = module.cwrap("dr_UnloadImagePalette", null, ["number"]);
backend.LoadImageColors = (image) =>
  withMemory((alloc) => {
    const pointer = imageColors(alloc(image));
    if (!pointer) throw new Error("LoadImageColors failed");
    try {
      return module.HEAPU8.slice(
        pointer,
        pointer + image.width * image.height * 4,
      );
    } finally {
      freeColors(pointer);
    }
  });
backend.LoadImagePalette = (image, maxPaletteSize) =>
  withMemory((alloc) => {
    const count = alloc(4);
    module.HEAPU8.fill(0, count, count + 4);
    const pointer = imagePalette(alloc(image), maxPaletteSize, count);
    if (!pointer) throw new Error("LoadImagePalette failed");
    try {
      const colorCount = new DataView(module.HEAPU8.buffer).getInt32(
        count,
        true,
      );
      return {
        colors: module.HEAPU8.slice(pointer, pointer + colorCount * 4),
        colorCount,
      };
    } finally {
      freePalette(pointer);
    }
  });
const unloadColors = (colors) => {
  if (!(colors instanceof Uint8Array)) {
    throw new TypeError("Expected color bytes");
  }
};
backend.UnloadImageColors = unloadColors;
backend.UnloadImagePalette = unloadColors;
