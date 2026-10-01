import { join, resolve } from "path";
import { fromFileUrl } from "path/from-file-url";

const libraryRoot = fromFileUrl(new URL("../", import.meta.url));
const projectRoot = Deno.cwd();

interface BuildOptions {
  output: string;
  source?: string;
}

function parseOptions(args: string[]): BuildOptions {
  let output: string | undefined;
  let source: string | undefined;
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (!value || (flag !== "--out-dir" && flag !== "--source-dir")) {
      console.error(
        "Usage: deno run -A Scripts/build_web.ts --out-dir <build-directory> [--source-dir <source-directory>]",
      );
      Deno.exit(2);
    }
    if (flag === "--out-dir") output = resolve(value);
    if (flag === "--source-dir") source = resolve(value);
  }
  if (!output) {
    console.error("Missing required --out-dir option");
    Deno.exit(2);
  }
  return { output, source };
}

async function requireFile(path: string, description: string): Promise<void> {
  try {
    await Deno.stat(path);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`${description} was not found at ${path}`);
    }
    throw error;
  }
}

async function main(): Promise<void> {
  const { output, source } = parseOptions(Deno.args);
  const emcc = join(
    projectRoot,
    "Lib",
    "emsdk",
    "upstream",
    "emscripten",
    Deno.build.os === "windows" ? "emcc.bat" : "emcc",
  );
  const bridge = join(libraryRoot, "Web", "Bridge", "generated.c");
  const backend = join(libraryRoot, "Web", "Bridge", "backend.mjs");
  const exportsPath = join(libraryRoot, "Web", "Bridge", "exports.json");
  const vendor = join(projectRoot, "Lib", "Web");
  const library = join(vendor, "libraylib.web.a");

  await requireFile(
    emcc,
    "Emscripten (run web setup to install it under Lib/emsdk)",
  );
  await requireFile(library, "The prepared raylib web archive");
  await requireFile(bridge, "The generated WebAssembly bridge");
  await Deno.mkdir(output, { recursive: true });

  const modulePath = join(output, "raylib_web.mjs");
  const exportsFile = JSON.parse(await Deno.readTextFile(exportsPath)) as {
    exported: string[];
  };
  const exports = ["_malloc", "_free", ...exportsFile.exported];
  const result = await new Deno.Command(emcc, {
    args: [
      bridge,
      library,
      `-I${vendor}`,
      `-I${join(libraryRoot, "Bindings", "Headers")}`,
      "-O2",
      "--no-entry",
      "-sUSE_GLFW=3",
      "-sMODULARIZE=1",
      "-sEXPORT_ES6=1",
      "-sENVIRONMENT=web",
      "-sALLOW_MEMORY_GROWTH=1",
      `-sEXPORTED_FUNCTIONS=${JSON.stringify(exports)}`,
      '-sEXPORTED_RUNTIME_METHODS=["cwrap","UTF8ToString","HEAPU8"]',
      "-o",
      modulePath,
    ],
    stdout: "inherit",
    stderr: "inherit",
  }).output();
  if (!result.success) {
    throw new Error(`Emscripten exited with code ${result.code}`);
  }

  await Deno.copyFile(backend, join(output, "backend.mjs"));
  const structs = join(libraryRoot, "Web", "structs.ts");
  const bundle = await new Deno.Command(Deno.execPath(), {
    args: [
      "bundle",
      "--platform",
      "browser",
      "--format",
      "esm",
      "--output",
      join(output, "web_structs.js"),
      structs,
    ],
    stdout: "inherit",
    stderr: "inherit",
  }).output();
  if (!bundle.success) {
    throw new Error(`Could not bundle Web structures: ${bundle.code}`);
  }

  if (source) {
    const html = join(source, "index.html");
    const entrypoint = join(source, "main.ts");
    await requireFile(html, "The web application HTML entrypoint");
    await requireFile(entrypoint, "The web application TypeScript entrypoint");
    await Deno.copyFile(html, join(output, "index.html"));

    const applicationBundle = await new Deno.Command(Deno.execPath(), {
      args: [
        "bundle",
        "--check",
        "--platform",
        "browser",
        "--format",
        "esm",
        "--output",
        join(output, "app.js"),
        entrypoint,
      ],
      stdout: "inherit",
      stderr: "inherit",
    }).output();
    if (!applicationBundle.success) {
      throw new Error(
        `Could not bundle the web application: ${applicationBundle.code}`,
      );
    }
  }
  console.log(`Built the raylib web runtime in ${output}`);
}

if (import.meta.main) await main();
