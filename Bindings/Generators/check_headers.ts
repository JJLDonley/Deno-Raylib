// Check the metadata against public declarations independently of rlparser.
// This also catches header-only functions that its annotation parser can omit.
import { FFI_STRUCTS } from "../Structs/ffi_structs.ts";
import { STRUCT_LAYOUTS } from "../Structs/layouts.ts";

function ffiLayout(type: Deno.NativeType): { size: number; align: number } {
  if (typeof type === "object") {
    let size = 0;
    let align = 1;
    for (const field of type.struct) {
      const value = ffiLayout(field);
      size = Math.ceil(size / value.align) * value.align + value.size;
      align = Math.max(align, value.align);
    }
    return { size: Math.ceil(size / align) * align, align };
  }
  const sizes: Record<string, number> = {
    u8: 1,
    i8: 1,
    bool: 1,
    u16: 2,
    i16: 2,
    u32: 4,
    i32: 4,
    f32: 4,
    u64: 8,
    i64: 8,
    f64: 8,
    pointer: 8,
    buffer: 8,
    function: 8,
    usize: 8,
    isize: 8,
  };
  const size = sizes[type];
  if (!size) throw new Error(`Unsupported ABI type ${type}`);
  return { size, align: size };
}
interface FunctionDefinition {
  name: string;
  returnType: string;
  params?: { name: string; type: string }[];
}
const api = JSON.parse(
  await Deno.readTextFile(new URL("./raylib_api.json", import.meta.url)),
) as {
  functions: FunctionDefinition[];
};
const functions = new Map(api.functions.map((fn) => [fn.name, fn]));
const declared = new Set<string>();
const normalize = (type: string) =>
  type.replace(/\s+/g, "").replace(/^const/, "");
const errors: string[] = [];
for (const [name, expected] of Object.entries(STRUCT_LAYOUTS)) {
  const actual = ffiLayout(FFI_STRUCTS[name as keyof typeof FFI_STRUCTS]);
  if (actual.size !== expected.size || actual.align !== expected.align) {
    errors.push(`${name}: FFI descriptor does not match its C memory layout`);
  }
}
for (const header of ["raylib", "raymath", "rcamera", "rlgl", "rgestures"]) {
  const text = await Deno.readTextFile(
    new URL(`../Headers/${header}.h`, import.meta.url),
  );
  const pattern = header === "rgestures"
    // RGESTURES_STANDALONE declarations are not active when linked to raylib.
    ? /^(void)\s+(ProcessGestureEvent|UpdateGestures)\(([^)]*)\);/gm
    : /^(?:RLAPI|RMAPI)\s+([\w\s*]+?)(\w+)\(([^)]*)\)/gm;
  let count = 0;
  for (const match of text.matchAll(pattern)) {
    const [, returnType, name, parameters] = match;
    declared.add(name);
    count++;
    const fn = functions.get(name);
    if (!fn) {
      errors.push(`${header}.h: missing ${name}`);
      continue;
    }
    if (normalize(returnType) !== normalize(fn.returnType)) {
      errors.push(`${name}: incorrect return type`);
    }
    const params = parameters.trim() === "void" || !parameters.trim()
      ? []
      : parameters.split(",");
    if (params.length !== (fn.params?.length ?? 0)) {
      errors.push(`${name}: incorrect parameter count`);
    }
    params.forEach((param, index) => {
      const expected = fn.params?.[index];
      if (!expected) return;
      if (param.trim() === "..." && expected.type === "...") return;
      const actual = normalize(param);
      const generated = normalize(`${expected.type} ${expected.name}`);
      if (actual !== generated) {
        errors.push(
          `${name}: ${param.trim()} differs from ${expected.type} ${expected.name}`,
        );
      }
    });
  }
  if (!count) errors.push(`No public declarations found in ${header}.h`);
}
for (const name of functions.keys()) {
  if (!declared.has(name)) errors.push(`Stale metadata function: ${name}`);
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(
  `Verified ${declared.size} public function signatures against all five headers and ${
    Object.keys(STRUCT_LAYOUTS).length
  } FFI struct layouts.`,
);
