import { basename, join, resolve } from "path";

const VERSION = "6.0";
const ASSET = `raylib-${VERSION}_webassembly.zip`;
const DOWNLOAD_URL =
  `https://github.com/raysan5/raylib/releases/download/${VERSION}/${ASSET}`;
const destination = resolve("Lib", "Web");

async function extract(archive: string, output: string): Promise<void> {
  const command = Deno.build.os === "windows"
    ? new Deno.Command("powershell", {
      args: [
        "-NoProfile",
        "-Command",
        `Expand-Archive -LiteralPath '${
          archive.replaceAll("'", "''")
        }' -DestinationPath '${output.replaceAll("'", "''")}' -Force`,
      ],
    })
    : new Deno.Command("unzip", {
      args: ["-q", "-o", archive, "-d", output],
    });
  const result = await command.output();
  if (!result.success) {
    throw new Error(
      `Could not extract ${basename(archive)}: ${
        new TextDecoder().decode(result.stderr)
      }`,
    );
  }
}

async function main(): Promise<void> {
  const temporary = await Deno.makeTempDir({ prefix: "deno-raylib-web-" });
  try {
    const archive = join(temporary, ASSET);
    console.log(`Downloading the official raylib ${VERSION} web archive...`);
    const response = await fetch(DOWNLOAD_URL);
    if (!response.ok) {
      throw new Error(
        `Download failed: ${response.status} ${response.statusText}`,
      );
    }
    await Deno.writeFile(archive, new Uint8Array(await response.arrayBuffer()));
    await extract(archive, temporary);

    const releaseRoot = join(temporary, `raylib-${VERSION}_webassembly`);
    await Deno.mkdir(destination, { recursive: true });
    await Deno.copyFile(
      join(releaseRoot, "lib", "libraylib.web.a"),
      join(destination, "libraylib.web.a"),
    );
    for (const header of ["raylib.h", "raymath.h", "rlgl.h"]) {
      await Deno.copyFile(
        join(releaseRoot, "include", header),
        join(destination, header),
      );
    }
    console.log("Prepared the exact raylib 6.0 WebAssembly static library.");
    console.log("Location: Lib/Web/libraylib.web.a");
  } finally {
    await Deno.remove(temporary, { recursive: true });
  }
}

if (import.meta.main) await main();
