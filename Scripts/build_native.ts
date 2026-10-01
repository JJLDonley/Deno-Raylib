/**
 * Cross-platform native Deno Raylib executable builder.
 *
 * @module
 */
import { basename, extname, join, resolve } from "path";
import {
  NATIVE_TARGETS,
  type NativeTarget,
  type NativeTargetKey,
} from "../Bindings/platforms.ts";

const RAYLIB_VERSION = "6.0";
const RELEASE_API =
  `https://api.github.com/repos/raysan5/raylib/releases/tags/${RAYLIB_VERSION}`;

interface Options {
  entry: string;
  outDir: string;
  targets: NativeTargetKey[];
}

function usage(): never {
  console.error(
    "Usage: deno run -A Scripts/build_native.ts --target <target|all> " +
      "[--out-dir dist] <entry.ts>",
  );
  console.error(`Targets: ${Object.keys(NATIVE_TARGETS).join(", ")}`);
  Deno.exit(2);
}

function parseOptions(args: string[]): Options {
  let selected = "";
  let outDir = "dist";
  let entry = "";

  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === "--target") selected = args[++index] ?? "";
    else if (argument === "--out-dir") outDir = args[++index] ?? "";
    else if (argument === "--help" || argument === "-h") usage();
    else if (argument.startsWith("-")) usage();
    else if (!entry) entry = argument;
    else usage();
  }

  if (!entry || !selected || !outDir) usage();
  const targets = selected === "all"
    ? Object.keys(NATIVE_TARGETS) as NativeTargetKey[]
    : selected.split(",") as NativeTargetKey[];
  for (const target of targets) {
    if (!(target in NATIVE_TARGETS)) usage();
  }
  return { entry: resolve(entry), outDir: resolve(outDir), targets };
}

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

async function extract(
  archive: string,
  destination: string,
  target: NativeTarget,
): Promise<void> {
  if (target.archive === "tar.gz") {
    // Official Unix archives contain symlink aliases that Windows cannot
    // reliably create. Read only the pinned release's real library member,
    // then write a regular file under the name expected by our loader.
    const libraryMemberName = target.os === "darwin"
      ? `libraylib.${RAYLIB_VERSION}.0.dylib`
      : `libraylib.so.${RAYLIB_VERSION}.0`;
    const listing = await new Deno.Command("tar", {
      args: ["-tzf", archive],
      stdout: "piped",
      stderr: "inherit",
    }).output();
    if (!listing.success) throw new Error("Could not list raylib archive");
    const members = new TextDecoder().decode(listing.stdout).split(/\r?\n/)
      .filter((member) => member.split("/").at(-1) === libraryMemberName);
    if (members.length !== 1) {
      throw new Error(`Expected one ${libraryMemberName} in ${archive}`);
    }
    const library = await new Deno.Command("tar", {
      args: ["-xOzf", archive, "--", members[0]],
      stdout: "piped",
      stderr: "inherit",
    }).output();
    if (!library.success || library.stdout.length === 0) {
      throw new Error(`Could not extract ${libraryMemberName} from ${archive}`);
    }
    await Deno.writeFile(join(destination, target.libraryName), library.stdout);
    return;
  }
  if (Deno.build.os === "windows") {
    const archiveLiteral = archive.replaceAll("'", "''");
    const destinationLiteral = destination.replaceAll("'", "''");
    await run("powershell", [
      "-NoProfile",
      "-Command",
      `Expand-Archive -LiteralPath '${archiveLiteral}' -DestinationPath '${destinationLiteral}' -Force`,
    ]);
    return;
  }
  await run("unzip", ["-q", archive, "-d", destination]);
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

async function main(): Promise<void> {
  const options = parseOptions(Deno.args);
  const response = await fetch(RELEASE_API, {
    headers: { "user-agent": "deno-raylib-native-builder" },
  });
  if (!response.ok) {
    throw new Error(`Could not fetch raylib release: ${response.statusText}`);
  }
  const release = await response.json() as {
    assets: Array<{ name: string; browser_download_url: string }>;
  };
  const temporary = await Deno.makeTempDir({ prefix: "deno-raylib-build-" });

  try {
    for (const key of options.targets) {
      const target = NATIVE_TARGETS[key];
      const asset = release.assets.find((item) =>
        item.name === target.releaseAsset
      );
      if (!asset) {
        throw new Error(`Missing release asset ${target.releaseAsset}`);
      }

      const targetDirectory = join(options.outDir, key);
      const libraryDirectory = join(targetDirectory, "Lib");
      await Deno.mkdir(libraryDirectory, { recursive: true });

      const executableBase = basename(
        options.entry,
        extname(options.entry),
      );
      const executable = join(
        targetDirectory,
        target.os === "windows" ? `${executableBase}.exe` : executableBase,
      );
      console.log(`Compiling ${key}...`);
      await run(Deno.execPath(), [
        "compile",
        "--target",
        target.denoTarget,
        "--allow-all",
        "--output",
        executable,
        options.entry,
      ]);

      const archive = join(temporary, asset.name);
      try {
        await Deno.stat(archive);
      } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) throw error;
        console.log(`Downloading ${asset.name}...`);
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
      }

      const extracted = join(temporary, key);
      await Deno.mkdir(extracted, { recursive: true });
      await extract(archive, extracted, target);
      const library = await findLibrary(extracted, target.libraryName);
      if (!library) {
        throw new Error(`${target.libraryName} was not found in ${asset.name}`);
      }
      await Deno.copyFile(library, join(libraryDirectory, target.libraryName));
      console.log(`Built ${targetDirectory}`);
    }
  } finally {
    await Deno.remove(temporary, { recursive: true });
  }
}

if (import.meta.main) await main();
