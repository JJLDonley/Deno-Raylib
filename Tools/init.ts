/**
 * Deno Raylib desktop and web project initializer.
 *
 * @module
 */
import { join, resolve } from "path";
import { fromFileUrl } from "path/from-file-url";
import {
  getNativeTarget,
  type NativeTargetKey,
} from "../Bindings/platforms.ts";

const VERSION = "6.0";
const TEMPLATES = ["desktop", "web", "both"] as const;
const DESKTOP_STARTER = `import * as raylib from "raylib";

raylib.InitWindow(800, 450, "Deno Raylib Desktop");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText("Hello from Deno Raylib!", 24, 24, 28, raylib.Black);
  raylib.DrawCircle(400, 240, 64, raylib.Red);
  raylib.EndDrawing();
}

raylib.CloseWindow();
`;
const WEB_STARTER =
  `import { Application, Drawing, Shapes, Text, Timing, Window } from "raylib/Web";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

await Application.Init({
  canvas,
  moduleUrl: new URL("./backend.mjs", import.meta.url),
});

Window.InitWindow(800, 450, "Deno Raylib Web");
Timing.SetTargetFPS(60);

const background = new Drawing.Color(245, 245, 245, 255);
const accent = new Drawing.Color(230, 41, 55, 255);
const foreground = new Drawing.Color(30, 30, 30, 255);

await Application.Run({
  draw() {
    Drawing.BeginDrawing();
    Drawing.ClearBackground(background);
    Text.DrawText("Hello from Deno Raylib!", 24, 24, 28, foreground);
    Shapes.DrawCircle(400, 240, 64, accent);
    Drawing.EndDrawing();
  },
});
`;
const WEB_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Deno Raylib Web</title>
  </head>
  <body>
    <canvas id="canvas" width="800" height="450"></canvas>
    <script type="module" src="./app.js"></script>
  </body>
</html>
`;
/** Template exported by Deno Raylib. */
export type Template = "desktop" | "web" | "both";

/** InitOptions exported by Deno Raylib. */
export interface InitOptions {
  /** directory member. */
  directory: string;
  /** template member. */
  template: Template;
}

interface PackageSource {
  isRoot(directory: string): boolean;
  copyDirectory(
    source: string,
    destination: string,
    excluded?: Set<string>,
  ): Promise<void>;
  copyFile(source: string, destination: string): Promise<void>;
}

class LocalPackageSource implements PackageSource {
  constructor(private readonly root: string) {}

  isRoot(directory: string): boolean {
    return resolve(this.root) === resolve(directory);
  }

  copyDirectory(
    source: string,
    destination: string,
    excluded = new Set<string>(),
  ): Promise<void> {
    return copyRecursive(join(this.root, source), destination, excluded);
  }

  async copyFile(source: string, destination: string): Promise<void> {
    await Deno.mkdir(join(destination, ".."), { recursive: true });
    await Deno.copyFile(join(this.root, source), destination);
  }
}

class JsrPackageSource implements PackageSource {
  private manifest?: Promise<string[]>;

  constructor(private readonly root: URL) {}

  isRoot(_directory: string): boolean {
    return false;
  }

  private packageFiles(): Promise<string[]> {
    this.manifest ??= (async () => {
      const metadataUrl = new URL(
        `${this.root.href.replace(/\/$/, "")}_meta.json`,
      );
      const response = await fetch(metadataUrl);
      if (!response.ok) {
        throw new Error(
          `Could not read the JSR package manifest: ${response.status} ${response.statusText}`,
        );
      }
      const metadata = await response.json() as {
        manifest: Record<string, unknown>;
      };
      return Object.keys(metadata.manifest).map((path) =>
        path.replace(/^\//, "")
      );
    })();
    return this.manifest;
  }

  async copyDirectory(
    source: string,
    destination: string,
    excluded = new Set<string>(),
  ): Promise<void> {
    const prefix = `${source.replaceAll("\\", "/").replace(/\/$/, "")}/`;
    const files = (await this.packageFiles()).filter((path) => {
      if (!path.startsWith(prefix)) return false;
      const relative = path.slice(prefix.length);
      return !excluded.has(relative.split("/", 1)[0]);
    });
    if (files.length === 0) {
      throw new Error(`The JSR package does not contain ${source}`);
    }
    const batchSize = 16;
    for (let index = 0; index < files.length; index += batchSize) {
      await Promise.all(
        files.slice(index, index + batchSize).map(async (path) => {
          const relative = path.slice(prefix.length);
          await this.copyFile(path, join(destination, ...relative.split("/")));
        }),
      );
    }
  }

  async copyFile(source: string, destination: string): Promise<void> {
    const response = await fetch(
      new URL(source.replaceAll("\\", "/"), this.root),
    );
    if (!response.ok) {
      throw new Error(
        `Could not download ${source} from JSR: ${response.status} ${response.statusText}`,
      );
    }
    await Deno.mkdir(join(destination, ".."), { recursive: true });
    await Deno.writeFile(
      destination,
      new Uint8Array(await response.arrayBuffer()),
    );
  }
}

function packageSource(moduleUrl: string): PackageSource {
  const url = new URL(moduleUrl);
  const root = new URL("../", url);
  if (url.protocol === "file:") {
    return new LocalPackageSource(fromFileUrl(root));
  }
  if (url.protocol === "https:" && url.hostname === "jsr.io") {
    return new JsrPackageSource(root);
  }
  throw new Error(`Unsupported initializer URL: ${moduleUrl}`);
}

function usage(): never {
  console.log(`Create a Deno Raylib starter project.

Usage:
  deno run -A jsr:@jjld/raylib/init [directory] [--template desktop|web|both]
`);
  Deno.exit(0);
}

/** parseInitOptions exported by Deno Raylib. */
export function parseInitOptions(args: string[]): InitOptions {
  let directory = ".";
  let template: Template = "both";
  let hasDirectory = false;
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === "--template" || argument === "-t") {
      const value = args[++index] as Template | undefined;
      if (!value || !TEMPLATES.includes(value)) {
        throw new Error("--template must be desktop, web, or both");
      }
      template = value;
    } else if (argument === "--help" || argument === "-h") {
      usage();
    } else if (argument.startsWith("-")) {
      throw new Error(`Unknown option: ${argument}`);
    } else if (!hasDirectory) {
      directory = argument;
      hasDirectory = true;
    } else {
      throw new Error("Only one project directory may be specified");
    }
  }
  return { directory: resolve(directory), template };
}

async function copyRecursive(
  source: string,
  destination: string,
  excluded = new Set<string>(),
): Promise<void> {
  await Deno.mkdir(destination, { recursive: true });
  for await (const entry of Deno.readDir(source)) {
    if (excluded.has(entry.name)) continue;
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory) await copyRecursive(from, to, excluded);
    else await Deno.copyFile(from, to);
  }
}

async function findLibrary(
  directory: string,
  libraryName: string,
): Promise<string | undefined> {
  for await (const entry of Deno.readDir(directory)) {
    const path = join(directory, entry.name);
    if (entry.isDirectory) {
      const nested = await findLibrary(path, libraryName);
      if (nested) return nested;
    } else if (
      entry.name === libraryName || entry.name.startsWith(libraryName)
    ) {
      return path;
    }
  }
}

async function downloadNativeLibrary(projectRoot: string): Promise<void> {
  const targetKey = `${Deno.build.os}-${Deno.build.arch}` as NativeTargetKey;
  const target = getNativeTarget(Deno.build.os, Deno.build.arch);
  const response = await fetch(
    `https://api.github.com/repos/raysan5/raylib/releases/tags/${VERSION}`,
  );
  if (!response.ok) {
    throw new Error(`Could not read raylib ${VERSION}: ${response.statusText}`);
  }
  const release = await response.json() as {
    assets: Array<{ name: string; browser_download_url: string }>;
  };
  const asset = release.assets.find(({ name }) => name === target.releaseAsset);
  if (!asset) throw new Error(`Missing raylib asset ${target.releaseAsset}`);

  const temporary = await Deno.makeTempDir({ prefix: "deno-raylib-init-" });
  try {
    const archive = join(temporary, asset.name);
    const download = await fetch(asset.browser_download_url);
    if (!download.ok) {
      throw new Error(
        `Could not download ${asset.name}: ${download.statusText}`,
      );
    }
    await Deno.writeFile(
      archive,
      new Uint8Array(await download.arrayBuffer()),
    );
    console.log(`Installing the ${targetKey} raylib library...`);

    const command = Deno.build.os === "windows"
      ? new Deno.Command("powershell", {
        args: [
          "-NoProfile",
          "-Command",
          `Expand-Archive -LiteralPath '${
            archive.replaceAll("'", "''")
          }' -DestinationPath '${temporary.replaceAll("'", "''")}' -Force`,
        ],
      })
      : new Deno.Command("tar", {
        args: ["-xzf", archive, "-C", temporary],
      });
    const result = await command.output();
    if (!result.success) {
      throw new Error(new TextDecoder().decode(result.stderr));
    }

    const library = await findLibrary(temporary, target.libraryName);
    if (!library) throw new Error(`${target.libraryName} was not extracted`);
    await Deno.mkdir(join(projectRoot, "Lib"), { recursive: true });
    await Deno.copyFile(
      library,
      join(projectRoot, "Lib", target.libraryName),
    );
  } finally {
    await Deno.remove(temporary, { recursive: true });
  }
}

function projectConfiguration(template: Template): Record<string, unknown> {
  const desktop = template !== "web";
  const web = template !== "desktop";
  const target = `${Deno.build.os}-${Deno.build.arch}`;
  const entries = [
    desktop ? "Source/Desktop/main.ts" : "",
    web ? "Source/Web/main.ts" : "",
  ].filter(Boolean);
  const tasks: Record<string, string> = {
    check: `deno check ${entries.join(" ")}`,
  };

  if (desktop) {
    tasks["desktop:run"] = "deno run -A Source/Desktop/main.ts";
    tasks["desktop:build"] =
      `deno run -A Raylib/Scripts/build_native.ts --target ${target} --out-dir Build/Desktop Source/Desktop/main.ts`;
    tasks["desktop:build:all"] =
      "deno run -A Raylib/Scripts/build_native.ts --target all --out-dir Build/Desktop Source/Desktop/main.ts";
  }
  if (web) {
    tasks["web:setup"] =
      "deno run -A Raylib/Scripts/setup_emscripten.ts && deno run -A Raylib/Scripts/prepare_web.ts";
    tasks["web:build"] =
      "deno run -A Raylib/Scripts/build_web.ts --source-dir Source/Web --out-dir Build/Web";
    tasks["web:serve"] =
      "deno run --allow-net --allow-read --allow-sys jsr:@std/http@1.1.4/file-server Build/Web";
    tasks["web:dev"] = "deno task web:build && deno task web:serve";
  }
  if (template === "desktop") tasks.dev = "deno task desktop:run";
  if (template === "web") tasks.dev = "deno task web:dev";

  return {
    tasks,
    compilerOptions: {
      types: ["./Raylib/Bindings/global.d.ts"],
      lib: ["deno.ns", "dom", "dom.iterable", "esnext"],
    },
    imports: {
      path: "jsr:@std/path@1.1.4",
      "path/from-file-url": "jsr:@std/path@1.1.4/from-file-url",
      raylib: "./Raylib/Raylib/raylib.ts",
      "raylib/Modules": "./Raylib/Modules/mod.ts",
      "raylib/Web": "./Raylib/Web/mod.ts",
      "raylib/": "./Raylib/",
    },
  };
}

async function installLibrary(
  source: PackageSource,
  libraryRoot: string,
): Promise<void> {
  if (source.isRoot(libraryRoot)) return;

  for (const directory of ["Bindings", "Raylib", "Modules", "Web", "Scripts"]) {
    const excluded = directory === "Bindings"
      ? new Set(["Generators"])
      : directory === "Scripts"
      ? new Set(["Desktop", "Web"])
      : new Set<string>();
    await source.copyDirectory(
      directory,
      join(libraryRoot, directory),
      excluded,
    );
  }
  await source.copyFile("LICENSE", join(libraryRoot, "LICENSE"));
}

async function writeStarterSources(
  projectRoot: string,
  template: Template,
): Promise<void> {
  if (template !== "web") {
    const desktop = join(projectRoot, "Source", "Desktop");
    await Deno.mkdir(desktop, { recursive: true });
    await Deno.writeTextFile(join(desktop, "main.ts"), DESKTOP_STARTER);
  }
  if (template !== "desktop") {
    const web = join(projectRoot, "Source", "Web");
    await Deno.mkdir(web, { recursive: true });
    await Deno.writeTextFile(join(web, "main.ts"), WEB_STARTER);
    await Deno.writeTextFile(join(web, "index.html"), WEB_HTML);
  }
}

/** createStarterProject exported by Deno Raylib. */
export async function createStarterProject(
  options: InitOptions,
): Promise<void> {
  const projectRoot = options.directory;
  const source = packageSource(import.meta.url);
  const libraryRoot = join(projectRoot, "Raylib");
  const usesExistingClone = source.isRoot(libraryRoot);
  await Deno.mkdir(projectRoot, { recursive: true });

  for (
    const name of [
      "deno.json",
      "Raylib",
      "Source",
    ]
  ) {
    if (name === "Raylib" && usesExistingClone) continue;
    try {
      await Deno.stat(join(projectRoot, name));
      throw new Error(
        `Refusing to overwrite existing ${join(projectRoot, name)}`,
      );
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) throw error;
    }
  }

  console.log(
    `Creating a ${options.template} Deno Raylib project in ${projectRoot}`,
  );
  await installLibrary(source, libraryRoot);

  if (options.template !== "web") {
    await downloadNativeLibrary(projectRoot);
  }
  await writeStarterSources(projectRoot, options.template);

  await Deno.writeTextFile(
    join(projectRoot, "deno.json"),
    `${JSON.stringify(projectConfiguration(options.template), null, 2)}\n`,
  );
  const ignorePath = join(projectRoot, ".gitignore");
  let existingIgnore = "";
  try {
    existingIgnore = await Deno.readTextFile(ignorePath);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
  const ignoreEntries = new Set(existingIgnore.split(/\r?\n/));
  const additions = ["/Build/", "/Lib/"].filter((entry) =>
    !ignoreEntries.has(entry)
  );
  if (additions.length) {
    await Deno.writeTextFile(
      ignorePath,
      existingIgnore +
        (existingIgnore && !existingIgnore.endsWith("\n") ? "\n" : "") +
        `${additions.join("\n")}\n`,
    );
  }

  console.log("\nProject created.");
  if (options.template !== "web") {
    console.log("  Desktop: deno task desktop:run");
  }
  if (options.template !== "desktop") {
    console.log("  Web setup (once): deno task web:setup");
    console.log("  Web build/serve: deno task web:dev");
  }
}

async function main(): Promise<void> {
  try {
    await createStarterProject(parseInitOptions(Deno.args));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    Deno.exit(1);
  }
}

if (import.meta.main) await main();
