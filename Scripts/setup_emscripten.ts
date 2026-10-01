import { join } from "path";

const EMSCRIPTEN_VERSION = "6.0.10";
const EMSDK_REVISION = "e566f7bdcc7735f44037911c24b87a58a3c93145";
const EMSDK_PYTHON_VERSION = "3.13.3";
const EMSDK_PACKAGES_URL =
  "https://storage.googleapis.com/webassembly/emscripten-releases-builds/deps";
const projectRoot = Deno.cwd();
const sdk = join(projectRoot, "Lib", "emsdk");

async function run(command: string, args: string[]): Promise<void> {
  const result = await new Deno.Command(command, {
    args,
    stdin: "null",
    stdout: "inherit",
    stderr: "inherit",
  }).output();
  if (!result.success) {
    throw new Error(`${command} exited with code ${result.code}`);
  }
}

async function ensureWindowsPython(): Promise<void> {
  const installation = join(
    sdk,
    "python",
    `${EMSDK_PYTHON_VERSION}_64bit`,
  );
  const executable = join(installation, "python.exe");
  const versionMarker = join(installation, ".emsdk_version");
  try {
    await Deno.stat(executable);
    if (
      (await Deno.readTextFile(versionMarker)).trim() ===
        `python-${EMSDK_PYTHON_VERSION}-64bit`
    ) return;
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }

  const architecture = Deno.build.arch === "x86_64"
    ? "amd64"
    : Deno.build.arch === "aarch64"
    ? "arm64"
    : undefined;
  if (!architecture) {
    throw new Error(
      `Emscripten's bundled Windows Python does not support ${Deno.build.arch}`,
    );
  }

  const asset = `python-${EMSDK_PYTHON_VERSION}-0-win-${architecture}.zip`;
  const temporary = await Deno.makeTempDir({ prefix: "deno-raylib-python-" });
  try {
    console.log(
      "Installing the project-local Python required by Emscripten...",
    );
    const response = await fetch(`${EMSDK_PACKAGES_URL}/${asset}`);
    if (!response.ok) {
      throw new Error(
        `Could not download ${asset}: ${response.status} ${response.statusText}`,
      );
    }
    const archive = join(temporary, asset);
    await Deno.writeFile(
      archive,
      new Uint8Array(await response.arrayBuffer()),
    );
    await Deno.mkdir(installation, { recursive: true });
    await run("powershell", [
      "-NoProfile",
      "-Command",
      `$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue'; Expand-Archive -LiteralPath '${
        archive.replaceAll("'", "''")
      }' -DestinationPath '${installation.replaceAll("'", "''")}' -Force`,
    ]);
    await Deno.stat(executable);
    await Deno.writeTextFile(
      versionMarker,
      `python-${EMSDK_PYTHON_VERSION}-64bit\n`,
    );
  } finally {
    await Deno.remove(temporary, { recursive: true });
  }
}

async function main(): Promise<void> {
  for (const argument of Deno.args) {
    if (argument !== "--yes") throw new Error(`Unknown option: ${argument}`);
  }
  console.log(
    `Web setup will download/install Emscripten ${EMSCRIPTEN_VERSION}, including its Node.js runtime${
      Deno.build.os === "windows" || Deno.build.os === "darwin"
        ? " and Python runtime"
        : " (requires Python 3.10+ already installed)"
    }.\nDestination: ${sdk}\nFiles stay inside this project's Lib directory. No system installation or permanent PATH changes are made.\nExisting SDK installations will be reused where possible.`,
  );
  if (!Deno.args.includes("--yes")) {
    if (!Deno.stdin.isTerminal()) {
      throw new Error(
        "Installation requires confirmation in an interactive terminal. For automation, explicitly approve with --yes.",
      );
    }
    if (!confirm("Allow these downloads and installations?")) {
      console.log("Setup cancelled. No files were installed.");
      Deno.exit(1);
    }
  }
  try {
    await Deno.stat(join(sdk, "emsdk.py"));
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
    const temporary = await Deno.makeTempDir({ prefix: "deno-raylib-emsdk-" });
    try {
      console.log(`Downloading Emscripten SDK scripts (${EMSDK_REVISION})...`);
      const response = await fetch(
        `https://codeload.github.com/emscripten-core/emsdk/tar.gz/${EMSDK_REVISION}`,
      );
      if (!response.ok) {
        throw new Error(
          `Could not download Emscripten SDK: ${response.status} ${response.statusText}`,
        );
      }
      const archive = join(temporary, "emsdk.tar.gz");
      await Deno.writeFile(
        archive,
        new Uint8Array(await response.arrayBuffer()),
      );
      await Deno.mkdir(sdk, { recursive: true });
      // tar ships with supported Windows versions, Linux, and macOS.
      await run("tar", ["-xzf", archive, "--strip-components=1", "-C", sdk]);
      await Deno.stat(join(sdk, "emsdk.py"));
    } finally {
      await Deno.remove(temporary, { recursive: true });
    }
  }

  if (Deno.build.os === "windows") {
    await ensureWindowsPython();
    const emsdk = join(sdk, "emsdk.bat");
    await run("cmd", ["/d", "/c", emsdk, "install", EMSCRIPTEN_VERSION]);
    await run("cmd", ["/d", "/c", emsdk, "activate", EMSCRIPTEN_VERSION]);
  } else {
    const emsdk = join(sdk, "emsdk");
    await run(emsdk, ["install", EMSCRIPTEN_VERSION]);
    await run(emsdk, ["activate", EMSCRIPTEN_VERSION]);
  }
  console.log(`Emscripten ${EMSCRIPTEN_VERSION} is ready in ${sdk}`);
}

if (import.meta.main) await main();
