import { join, resolve } from "path";
import { fromFileUrl } from "path/from-file-url";
import {
  getNativeTarget,
  type NativeTargetKey,
} from "../Bindings/platforms.ts";

const VERSION = "6.0";
const TEMPLATES = ["desktop", "web", "both"] as const;
export type Template = (typeof TEMPLATES)[number];

export interface InitOptions {
  directory: string;
  template: Template;
}

function usage(): never {
  console.log(`Create a Deno Raylib starter project.

Usage:
  deno run -A jsr:@jjld/raylib/init [directory] [--template desktop|web|both]
`);
  Deno.exit(0);
}

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
      `deno run -A Scripts/build_native.ts --target ${target} --out-dir Build/Desktop Source/Desktop/main.ts`;
    tasks["desktop:build:all"] =
      "deno run -A Scripts/build_native.ts --target all --out-dir Build/Desktop Source/Desktop/main.ts";
  }
  if (web) {
    tasks["web:setup"] =
      "deno run -A Scripts/setup_emscripten.ts && deno run -A Scripts/prepare_web.ts";
    tasks["web:build"] =
      "deno run -A Scripts/build_web.ts --source-dir Source/Web --out-dir Build/Web";
    tasks["web:serve"] =
      "deno run --allow-net --allow-read --allow-sys jsr:@std/http@1.1.4/file-server Build/Web";
    tasks["web:dev"] = "deno task web:build && deno task web:serve";
  }
  if (template === "desktop") tasks.dev = "deno task desktop:run";
  if (template === "web") tasks.dev = "deno task web:dev";

  return {
    tasks,
    compilerOptions: {
      types: ["./Bindings/global.d.ts"],
      lib: ["deno.ns", "dom", "dom.iterable", "esnext"],
    },
    imports: {
      path: "jsr:@std/path@1.1.4",
      "path/from-file-url": "jsr:@std/path@1.1.4/from-file-url",
      raylib: "./Raylib/raylib.ts",
      "raylib/Modules": "./Modules/mod.ts",
      "raylib/Web": "./Web/mod.ts",
      "raylib/": "./",
    },
  };
}

async function installLibrary(
  packageRoot: string,
  projectRoot: string,
  template: Template,
): Promise<void> {
  for (const directory of ["Bindings", "Raylib", "Modules", "Web"]) {
    await copyRecursive(
      join(packageRoot, directory),
      join(projectRoot, directory),
      directory === "Bindings" ? new Set(["Generators"]) : new Set(),
    );
  }

  const scripts = new Set<string>();
  if (template !== "web") scripts.add("build_native.ts");
  if (template !== "desktop") {
    scripts.add("build_web.ts");
    scripts.add("setup_emscripten.ts");
    scripts.add("prepare_web.ts");
  }
  await Deno.mkdir(join(projectRoot, "Scripts"), { recursive: true });
  for (const script of scripts) {
    await Deno.copyFile(
      join(packageRoot, "Scripts", script),
      join(projectRoot, "Scripts", script),
    );
  }
}

export async function createStarterProject(
  options: InitOptions,
): Promise<void> {
  const projectRoot = options.directory;
  const packageRoot = fromFileUrl(new URL("../", import.meta.url));
  await Deno.mkdir(projectRoot, { recursive: true });

  for (
    const name of [
      "deno.json",
      "Bindings",
      "Raylib",
      "Modules",
      "Web",
      "Scripts",
      "Source",
    ]
  ) {
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
  await installLibrary(packageRoot, projectRoot, options.template);

  if (options.template !== "web") {
    await downloadNativeLibrary(projectRoot);
    await copyRecursive(
      join(packageRoot, "Scripts", "Desktop"),
      join(projectRoot, "Source", "Desktop"),
    );
  }
  if (options.template !== "desktop") {
    await copyRecursive(
      join(packageRoot, "Scripts", "Web"),
      join(projectRoot, "Source", "Web"),
    );
  }

  await Deno.writeTextFile(
    join(projectRoot, "deno.json"),
    `${JSON.stringify(projectConfiguration(options.template), null, 2)}\n`,
  );
  await Deno.writeTextFile(
    join(projectRoot, ".gitignore"),
    "Build/\nLib/\nTests/\n",
  );

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
