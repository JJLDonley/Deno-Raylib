import { join } from "path";

const EMSCRIPTEN_VERSION = "6.0.10";
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

async function main(): Promise<void> {
  try {
    await Deno.stat(join(sdk, ".git"));
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
    await Deno.mkdir(join(projectRoot, "Lib"), { recursive: true });
    await run("git", [
      "clone",
      "--depth",
      "1",
      "https://github.com/emscripten-core/emsdk.git",
      sdk,
    ]);
  }

  if (Deno.build.os === "windows") {
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
