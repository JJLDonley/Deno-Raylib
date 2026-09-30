// deno-lint-ignore-file no-explicit-any
// Generate structs.ts from raylib_api.json + layouts.ts

import {
  STRUCT_LAYOUT_ABI as NATIVE_STRUCT_LAYOUT_ABI,
  STRUCT_LAYOUTS as NATIVE_STRUCT_LAYOUTS,
} from "../Structs/layouts.ts";
import {
  STRUCT_LAYOUT_ABI as WEB_STRUCT_LAYOUT_ABI,
  STRUCT_LAYOUTS as WEB_STRUCT_LAYOUTS,
} from "../../Web/layouts.ts";

const web = Deno.args.includes("--web");
const STRUCT_LAYOUT_ABI = web
  ? WEB_STRUCT_LAYOUT_ABI
  : NATIVE_STRUCT_LAYOUT_ABI;
const STRUCT_LAYOUTS = web ? WEB_STRUCT_LAYOUTS : NATIVE_STRUCT_LAYOUTS;

const apiPath = new URL("./raylib_api.json", import.meta.url);
const api = JSON.parse(Deno.readTextFileSync(apiPath));

const aliasMap = new Map<string, string>(
  api.aliases.map((alias: { name: string; type: string }) => [
    alias.name,
    alias.type,
  ]),
);

const structSet = new Set<string>(api.structs.map((s: any) => s.name));
const callbackSet = new Set<string>(api.callbacks.map((cb: any) => cb.name));

const pointerSize = STRUCT_LAYOUT_ABI.pointerSize;

const longFields = api.structs.flatMap((struct: StructDef) =>
  struct.fields.filter((field) => /\blong\b/.test(field.type)).map(
    (field) => `${struct.name}.${field.name}`,
  )
);
if (longFields.length > 0) {
  throw new Error(
    `Target-sized long fields require per-ABI TypeScript structures: ${
      longFields.join(", ")
    }`,
  );
}
const littleEndianExpr = "littleEndian";

type Field = {
  name: string;
  type: string;
  description?: string;
};

type StructDef = {
  name: string;
  description?: string;
  fields: Field[];
};

function resolveAlias(type: string): string {
  let current = type.trim();
  const seen = new Set<string>();
  while (aliasMap.has(current) && !seen.has(current)) {
    seen.add(current);
    current = aliasMap.get(current)!.trim();
  }
  return current;
}

function stripConst(type: string): string {
  return type.replace(/^const\s+/, "").trim();
}

function parseArray(type: string): { base: string; count: number } | null {
  const match = type.match(/^(.*)\[(\d+)\]$/);
  if (!match) return null;
  return { base: match[1].trim(), count: Number(match[2]) };
}

function isPointer(type: string): boolean {
  return type.includes("*");
}

function normalizeType(type: string): string {
  return resolveAlias(stripConst(type));
}

function isCharArray(base: string): boolean {
  return base === "char" || base === "signed char" || base === "unsigned char";
}

function isPrimitive(type: string): boolean {
  return [
    "bool",
    "char",
    "signed char",
    "unsigned char",
    "short",
    "unsigned short",
    "int",
    "unsigned int",
    "long",
    "unsigned long",
    "long long",
    "unsigned long long",
    "float",
    "double",
  ].includes(type);
}

function tsTypeForPrimitive(type: string): string {
  switch (type) {
    case "bool":
      return "boolean";
    case "long long":
    case "unsigned long long":
      return "bigint";
    default:
      return "number";
  }
}

function dataViewGetter(type: string, signed = true): string {
  switch (type) {
    case "bool":
      return "getUint8";
    case "char":
    case "signed char":
      return "getInt8";
    case "unsigned char":
      return "getUint8";
    case "short":
      return "getInt16";
    case "unsigned short":
      return "getUint16";
    case "int":
      return "getInt32";
    case "unsigned int":
      return "getUint32";
    case "long":
    case "unsigned long":
      // Assume long is 4 or 8; layouts.ts already computed offsets.
      return "getInt32";
    case "long long":
      return "getBigInt64";
    case "unsigned long long":
      return "getBigUint64";
    case "float":
      return "getFloat32";
    case "double":
      return "getFloat64";
    default:
      return signed ? "getInt32" : "getUint32";
  }
}

function dataViewSetter(type: string, signed = true): string {
  switch (type) {
    case "bool":
      return "setUint8";
    case "char":
    case "signed char":
      return "setInt8";
    case "unsigned char":
      return "setUint8";
    case "short":
      return "setInt16";
    case "unsigned short":
      return "setUint16";
    case "int":
      return "setInt32";
    case "unsigned int":
      return "setUint32";
    case "long":
    case "unsigned long":
      return "setInt32";
    case "long long":
      return "setBigInt64";
    case "unsigned long long":
      return "setBigUint64";
    case "float":
      return "setFloat32";
    case "double":
      return "setFloat64";
    default:
      return signed ? "setInt32" : "setUint32";
  }
}

function typedArrayFor(type: string): string | null {
  switch (type) {
    case "float":
      return "Float32Array";
    case "double":
      return "Float64Array";
    case "int":
    case "long":
    case "short":
      return "Int32Array";
    case "unsigned int":
    case "unsigned long":
      return "Uint32Array";
    case "unsigned short":
      return "Uint16Array";
    case "unsigned char":
    case "char":
    case "signed char":
      return "Uint8Array";
    default:
      return null;
  }
}

function isConvenienceEligible(struct: StructDef): boolean {
  return struct.fields.every((field) =>
    !field.type.includes("*") && !/\[/.test(field.type)
  );
}

function emitClass(struct: StructDef): string {
  const layout = (STRUCT_LAYOUTS as any)[struct.name];
  if (!layout) return "";

  const canConvenience = isConvenienceEligible(struct);
  let out = "";
  out += `export class ${struct.name} {\n`;
  out += `  static readonly SIZE = ${layout.size};\n`;
  out += `  #buffer: Uint8Array<ArrayBuffer>;\n`;
  out += `  #view: DataView;\n\n`;
  if (canConvenience) {
    const params = struct.fields.map((field) => {
      const type = normalizeType(field.type);
      if (isPrimitive(type)) {
        return `${field.name}: ${tsTypeForPrimitive(type)}`;
      }
      if (structSet.has(type)) return `${field.name}: ${type}`;
      return `${field.name}: unknown`;
    });
    const optionsType = `Partial<{ ${
      struct.fields.map((field) => {
        const type = normalizeType(field.type);
        if (isPrimitive(type)) {
          return `${field.name}: ${tsTypeForPrimitive(type)}`;
        }
        if (structSet.has(type)) return `${field.name}: ${type}`;
        return `${field.name}: unknown`;
      }).join("; ")
    } }>`;
    out += `  constructor(buffer: Uint8Array<ArrayBuffer>);\n`;
    out += `  constructor(options: ${optionsType});\n`;
    out += `  constructor(${params.join(", ")});\n`;
    out += `  constructor(arg0: Uint8Array<ArrayBuffer> | ${optionsType} | ${
      params[0]?.split(":")[1]?.trim() ?? "unknown"
    }, ...rest: unknown[]) {\n`;
    out += `    if (arg0 instanceof Uint8Array) {\n`;
    out += `      this.#buffer = arg0;\n`;
    out +=
      `      this.#view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset, this.#buffer.byteLength);\n`;
    out += `      return;\n`;
    out += `    }\n`;
    out +=
      `    this.#buffer = new Uint8Array(new ArrayBuffer(${struct.name}.SIZE));\n`;
    out +=
      `    this.#view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset, this.#buffer.byteLength);\n`;
    out +=
      `    if (arg0 && typeof arg0 === "object" && !("buffer" in (arg0 as object))) {\n`;
    struct.fields.forEach((field) => {
      out +=
        `      if ((arg0 as any).${field.name} !== undefined) this.${field.name} = (arg0 as any).${field.name};\n`;
    });
    out += `      return;\n`;
    out += `    }\n`;
    out += `    const args = [arg0, ...rest];\n`;
    struct.fields.forEach((field, idx) => {
      out +=
        `    if (args[${idx}] !== undefined) this.${field.name} = args[${idx}] as any;\n`;
    });
    out += `  }\n\n`;
  } else {
    out += `  constructor(buffer: Uint8Array<ArrayBuffer>) {\n`;
    out += `    this.#buffer = buffer;\n`;
    out +=
      `    this.#view = new DataView(this.#buffer.buffer, this.#buffer.byteOffset, this.#buffer.byteLength);\n`;
    out += `  }\n\n`;
  }
  out +=
    `  static fromBuffer(buffer: ArrayBufferLike, byteOffset = 0): ${struct.name} {\n`;
  out +=
    `    return new ${struct.name}(new Uint8Array(buffer as ArrayBuffer, byteOffset, ${struct.name}.SIZE));\n`;
  out += `  }\n\n`;
  out += `  get buffer(): Uint8Array<ArrayBuffer> {\n`;
  out += `    return this.#buffer;\n`;
  out += `  }\n\n`;

  for (const field of struct.fields) {
    const type = normalizeType(field.type);
    const fieldLayout = layout.fields.find((f: any) => f.name === field.name);
    if (!fieldLayout) continue;
    const offset = fieldLayout.offset;

    const arrayInfo = parseArray(type);
    if (arrayInfo) {
      const base = normalizeType(arrayInfo.base);
      if (isCharArray(base)) {
        const count = arrayInfo.count;
        out += `  get ${field.name}(): string {\n`;
        out +=
          `    const bytes = new Uint8Array(this.#buffer.buffer, this.#buffer.byteOffset + ${offset}, ${count});\n`;
        out += `    let end = bytes.indexOf(0);\n`;
        out += `    if (end === -1) end = ${count};\n`;
        out += `    return new TextDecoder().decode(bytes.subarray(0, end));\n`;
        out += `  }\n\n`;
        out += `  set ${field.name}(value: string) {\n`;
        out +=
          `    const bytes = new Uint8Array(this.#buffer.buffer, this.#buffer.byteOffset + ${offset}, ${count});\n`;
        out += `    bytes.fill(0);\n`;
        out += `    const encoded = new TextEncoder().encode(value);\n`;
        out += `    bytes.set(encoded.subarray(0, ${count}));\n`;
        out += `  }\n\n`;
        out += `  get ${field.name}Bytes(): Uint8Array {\n`;
        out +=
          `    return new Uint8Array(this.#buffer.buffer, this.#buffer.byteOffset + ${offset}, ${count});\n`;
        out += `  }\n\n`;
      } else if (structSet.has(base)) {
        const count = arrayInfo.count;
        out += `  get ${field.name}(): ${base}[] {\n`;
        out += `    const items: ${base}[] = [];\n`;
        out += `    const size = ${base}.SIZE;\n`;
        out += `    for (let i = 0; i < ${count}; i++) {\n`;
        out +=
          `      items.push(${base}.fromBuffer(this.#buffer.buffer, this.#buffer.byteOffset + ${offset} + i * size));\n`;
        out += `    }\n`;
        out += `    return items;\n`;
        out += `  }\n\n`;
        out += `  set ${field.name}(values: ${base}[]) {\n`;
        out += `    const size = ${base}.SIZE;\n`;
        out += `    const count = Math.min(values.length, ${count});\n`;
        out += `    for (let i = 0; i < count; i++) {\n`;
        out +=
          `      const target = new Uint8Array(this.#buffer.buffer, this.#buffer.byteOffset + ${offset} + i * size, size);\n`;
        out += `      target.set(values[i].buffer);\n`;
        out += `    }\n`;
        out += `  }\n\n`;
      } else if (isPrimitive(base)) {
        const ctor = typedArrayFor(base) ?? "Uint8Array";
        out += `  get ${field.name}(): ${ctor} {\n`;
        out +=
          `    return new ${ctor}(this.#buffer.buffer, this.#buffer.byteOffset + ${offset}, ${arrayInfo.count});\n`;
        out += `  }\n\n`;
        out += `  set ${field.name}(values: ArrayLike<${
          tsTypeForPrimitive(base)
        }>) {\n`;
        out += `    const view = this.${field.name};\n`;
        out += `    const count = Math.min(values.length, view.length);\n`;
        out +=
          `    for (let i = 0; i < count; i++) view[i] = values[i] as any;\n`;
        out += `  }\n\n`;
      }
      continue;
    }

    if (
      isPointer(type) || callbackSet.has(type) || fieldLayout.type === "pointer"
    ) {
      const name = `${field.name}Ptr`;
      const pointerType = pointerSize === 4 ? "number" : "bigint";
      const pointerGetter = pointerSize === 4 ? "getUint32" : "getBigUint64";
      const pointerSetter = pointerSize === 4 ? "setUint32" : "setBigUint64";
      out += `  get ${name}(): ${pointerType} {\n`;
      out +=
        `    return this.#view.${pointerGetter}(${offset}, ${littleEndianExpr});\n`;
      out += `  }\n\n`;
      out += `  set ${name}(value: ${pointerType}) {\n`;
      out +=
        `    this.#view.${pointerSetter}(${offset}, value, ${littleEndianExpr});\n`;
      out += `  }\n\n`;
      continue;
    }

    if (structSet.has(type)) {
      out += `  get ${field.name}(): ${type} {\n`;
      out +=
        `    return ${type}.fromBuffer(this.#buffer.buffer, this.#buffer.byteOffset + ${offset});\n`;
      out += `  }\n\n`;
      out += `  set ${field.name}(value: ${type}) {\n`;
      out +=
        `    const target = new Uint8Array(this.#buffer.buffer, this.#buffer.byteOffset + ${offset}, ${type}.SIZE);\n`;
      out += `    target.set(value.buffer);\n`;
      out += `  }\n\n`;
      continue;
    }

    if (isPrimitive(type)) {
      const getter = dataViewGetter(type);
      const setter = dataViewSetter(type);
      const tsType = tsTypeForPrimitive(type);
      const endianArg = [
        "getInt16",
        "getUint16",
        "getInt32",
        "getUint32",
        "getFloat32",
        "getFloat64",
        "setInt16",
        "setUint16",
        "setInt32",
        "setUint32",
        "setFloat32",
        "setFloat64",
      ].includes(getter) || [
        "setInt16",
        "setUint16",
        "setInt32",
        "setUint32",
        "setFloat32",
        "setFloat64",
      ].includes(setter);

      if (type === "bool") {
        out += `  get ${field.name}(): boolean {\n`;
        out += `    return this.#view.getUint8(${offset}) !== 0;\n`;
        out += `  }\n\n`;
        out += `  set ${field.name}(value: boolean) {\n`;
        out += `    this.#view.setUint8(${offset}, value ? 1 : 0);\n`;
        out += `  }\n\n`;
      } else if (
        type === "char" ||
        type === "signed char" ||
        type === "unsigned char"
      ) {
        out += `  get ${field.name}(): number {\n`;
        out += `    return this.#view.${getter}(${offset});\n`;
        out += `  }\n\n`;
        out += `  set ${field.name}(value: number) {\n`;
        out += `    this.#view.${setter}(${offset}, value);\n`;
        out += `  }\n\n`;
      } else if (getter.startsWith("getBig")) {
        out += `  get ${field.name}(): ${tsType} {\n`;
        out +=
          `    return this.#view.${getter}(${offset}, ${littleEndianExpr});\n`;
        out += `  }\n\n`;
        out += `  set ${field.name}(value: ${tsType}) {\n`;
        out +=
          `    this.#view.${setter}(${offset}, value, ${littleEndianExpr});\n`;
        out += `  }\n\n`;
      } else {
        out += `  get ${field.name}(): ${tsType} {\n`;
        out += endianArg
          ? `    return this.#view.${getter}(${offset}, ${littleEndianExpr}) as ${tsType};\n`
          : `    return this.#view.${getter}(${offset}) as ${tsType};\n`;
        out += `  }\n\n`;
        out += `  set ${field.name}(value: ${tsType}) {\n`;
        out += endianArg
          ? `    this.#view.${setter}(${offset}, value as any, ${littleEndianExpr});\n`
          : `    this.#view.${setter}(${offset}, value as any);\n`;
        out += `  }\n\n`;
      }
    }
  }

  out += "}\n\n";
  return out;
}

let result = "// This file is generated by generate_structs.ts\n";
result += "// deno-lint-ignore-file no-explicit-any\n\n";
result += `export const littleEndian = (() => {\n`;
result += `  const buffer = new ArrayBuffer(2);\n`;
result += `  new DataView(buffer).setInt16(0, 256, true);\n`;
result += `  return new Int16Array(buffer)[0] === 256;\n`;
result += `})();\n\n`;
result += `const _POINTER_SIZE = ${pointerSize};\n\n`;

for (const struct of api.structs as StructDef[]) {
  result += emitClass(struct);
}

const outputPath = web
  ? new URL("../../Web/structs.ts", import.meta.url)
  : new URL("../Structs/structs.ts", import.meta.url);
Deno.writeTextFileSync(outputPath, result);
