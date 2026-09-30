/**
 * Resolve the raylib shared library for development and compiled releases.
 *
 * `deno run` loads native files from the generated project `./Lib` directory.
 * A standalone executable uses a `Lib` directory beside the executable, so a
 * release can be launched from any working directory.
 */
export function resolveNativeLibraryPath(libraryName: string): string {
  if (!Deno.build.standalone) return `./Lib/${libraryName}`;

  const executable = Deno.execPath();
  const separator = Deno.build.os === "windows" ? "\\" : "/";
  const lastSeparator = Math.max(
    executable.lastIndexOf("/"),
    executable.lastIndexOf("\\"),
  );
  const directory = lastSeparator < 0
    ? "."
    : executable.slice(0, lastSeparator);
  return `${directory}${separator}Lib${separator}${libraryName}`;
}
