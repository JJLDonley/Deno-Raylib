// Add durable JSR module and symbol documentation to generated public files.

import { dirname, fromFileUrl, resolve } from "path";

const root = resolve(dirname(fromFileUrl(import.meta.url)), "../..");
const configPath = resolve(root, "deno.json");
const apiPath = resolve(root, "Bindings/Generators/raylib_api.json");
const config = JSON.parse(await Deno.readTextFile(configPath));
const api = JSON.parse(await Deno.readTextFile(apiPath));

const clean = (value: string | undefined, fallback: string): string =>
  (value?.trim() || fallback).replaceAll("*/", "* /");

const descriptions = new Map<string, string>();
for (
  const item of [
    ...api.functions,
    ...api.structs,
    ...api.enums,
    ...api.aliases,
    ...api.callbacks,
    ...api.defines,
  ] as Array<{ name: string; description?: string }>
) {
  descriptions.set(
    item.name,
    clean(item.description, `${item.name} from the raylib 6.0 API.`),
  );
}

const moduleDescriptions = new Map<string, string>([
  ["Raylib/mod.ts", "Complete native raylib 6.0 direct API."],
  [
    "Raylib/raylib.ts",
    "Complete native raylib 6.0 API for Deno, including raymath, rcamera, rgestures, and rlgl.",
  ],
  [
    "Raylib/raymath.ts",
    "Direct raymath vector, matrix, quaternion, and scalar APIs.",
  ],
  [
    "Raylib/rcamera.ts",
    "Direct rcamera movement, rotation, and projection APIs.",
  ],
  ["Raylib/rgestures.ts", "Direct rgestures detection and gesture-state APIs."],
  ["Raylib/rlgl.ts", "Direct low-level rlgl rendering API."],
  [
    "Modules/mod.ts",
    "Native separation-of-concerns modules using the original raylib API names.",
  ],
  ["Tools/init.ts", "Deno Raylib desktop and web project initializer."],
  [
    "Scripts/build_native.ts",
    "Cross-platform native Deno Raylib executable builder.",
  ],
  [
    "Web/mod.ts",
    "Browser modules matching the native Deno Raylib module names.",
  ],
]);

function moduleDescription(relativePath: string, source: string): string {
  const configured = moduleDescriptions.get(relativePath);
  if (configured) return configured;

  const existing = source.match(/^\/\*\*\s*([^@*][\s\S]*?)\s*\*\//)?.[1]
    ?.replace(/^\s*\*\s?/gm, " ").trim();
  if (existing) return existing;

  const name = relativePath.split("/").at(-1)?.replace(/\.ts$/, "") ??
    "module";
  if (relativePath.startsWith("Web/")) {
    return `${name} APIs for the browser WebAssembly backend.`;
  }
  if (relativePath.startsWith("Modules/")) {
    return `${name} APIs for the native raylib backend.`;
  }
  return `Public ${name} entrypoint for Deno Raylib.`;
}

function ensureModuleDoc(source: string, description: string): string {
  if (/^\/\*\*[\s\S]*?@module[\s\S]*?\*\//.test(source)) return source;
  return `/**\n * ${
    clean(description, "Deno Raylib module.")
  }\n *\n * @module\n */\n${source}`;
}

function ensureSymbolDocs(source: string): string {
  const lines = source.split("\n");
  const output: string[] = [];
  const declaration =
    /^export\s+(?:declare\s+)?(?:async\s+)?(?:function|class|enum|interface|type|const|let|var)\s+([A-Za-z_$][\w$]*)/;

  for (const line of lines) {
    const match = line.match(declaration);
    if (match) {
      let index = output.length - 1;
      while (index >= 0 && output[index].trim() === "") index--;
      const emptyDoc = index >= 0 && /^\/\*\*\s*\*\/$/.test(output[index]);
      const alreadyDocumented = index >= 0 && !emptyDoc &&
        output[index].trim().endsWith("*/");
      if (!alreadyDocumented) {
        const name = match[1];
        const doc = `/** ${
          descriptions.get(name) ?? `${name} exported by Deno Raylib.`
        } */`;
        if (emptyDoc) output[index] = doc;
        else output.push(doc);
      }
    }
    output.push(line);
  }
  return output.join("\n");
}

function ensureMemberDocs(source: string): string {
  const lines = source.split("\n");
  const output: string[] = [];
  let containerDepth = 0;
  let inPublicContainer = false;
  const container = /^export\s+(?:declare\s+)?(?:class|interface|enum)\s+/;
  const member =
    /^\x20{2}(?:(?:static\s+)?readonly\s+|static\s+|get\s+|set\s+)?([A-Za-z_$][\w$]*)(?:\??:|\s*\(|\s*=)/;

  for (const line of lines) {
    if (!inPublicContainer && container.test(line)) {
      inPublicContainer = true;
      containerDepth = 0;
    }

    if (inPublicContainer) {
      const match = line.match(member);
      if (match) {
        let index = output.length - 1;
        while (index >= 0 && output[index].trim() === "") index--;
        const alreadyDocumented = index >= 0 &&
          output[index].trim().endsWith("*/");
        if (!alreadyDocumented) {
          output.push(`  /** ${match[1]} member. */`);
        }
      }

      containerDepth += (line.match(/\{/g) ?? []).length;
      containerDepth -= (line.match(/\}/g) ?? []).length;
      if (containerDepth === 0 && line.includes("}")) inPublicContainer = false;
    }
    output.push(line);
  }
  return output.join("\n");
}

const entrypoints = new Set<string>(Object.values(config.exports));
for (const value of entrypoints) {
  const relativePath = String(value).replace(/^\.\//, "");
  const path = resolve(root, relativePath);
  let source = await Deno.readTextFile(path);
  source = ensureModuleDoc(source, moduleDescription(relativePath, source));
  source = ensureSymbolDocs(source);
  source = ensureMemberDocs(source);
  await Deno.writeTextFile(path, source);
}

// Struct declarations are re-exported by native and Web entrypoints. Document
// them at their declarations so JSR can carry the descriptions through.
for (
  const relativePath of [
    "Bindings/Structs/structs.ts",
    "Raylib/rlgl.ts",
    "Web/structs.ts",
    "Web/functions.ts",
    "Web/constants.ts",
  ]
) {
  const path = resolve(root, relativePath);
  let source = ensureSymbolDocs(await Deno.readTextFile(path));
  source = ensureMemberDocs(source);
  await Deno.writeTextFile(path, source);
}

console.log(`Documented ${entrypoints.size} public entrypoints.`);
