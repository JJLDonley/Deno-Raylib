/** Native targets supported by the official raylib 6.0 release artifacts. */
export const NATIVE_TARGETS = {
  "windows-x86_64": {
    os: "windows",
    arch: "x86_64",
    denoTarget: "x86_64-pc-windows-msvc",
    libraryName: "raylib.dll",
    releaseAsset: "raylib-6.0_win64_msvc16.zip",
    archive: "zip",
    pointerSize: 8,
    longSize: 4,
    longFfiType: "i32",
  },
  "windows-aarch64": {
    os: "windows",
    arch: "aarch64",
    denoTarget: "aarch64-pc-windows-msvc",
    libraryName: "raylib.dll",
    releaseAsset: "raylib-6.0_winarm64_msvc16.zip",
    archive: "zip",
    pointerSize: 8,
    longSize: 4,
    longFfiType: "i32",
  },
  "linux-x86_64": {
    os: "linux",
    arch: "x86_64",
    denoTarget: "x86_64-unknown-linux-gnu",
    libraryName: "libraylib.so",
    releaseAsset: "raylib-6.0_linux_amd64.tar.gz",
    archive: "tar.gz",
    pointerSize: 8,
    longSize: 8,
    longFfiType: "i64",
  },
  "linux-aarch64": {
    os: "linux",
    arch: "aarch64",
    denoTarget: "aarch64-unknown-linux-gnu",
    libraryName: "libraylib.so",
    releaseAsset: "raylib-6.0_linux_arm64.tar.gz",
    archive: "tar.gz",
    pointerSize: 8,
    longSize: 8,
    longFfiType: "i64",
  },
  "darwin-x86_64": {
    os: "darwin",
    arch: "x86_64",
    denoTarget: "x86_64-apple-darwin",
    libraryName: "libraylib.dylib",
    releaseAsset: "raylib-6.0_macos.tar.gz",
    archive: "tar.gz",
    pointerSize: 8,
    longSize: 8,
    longFfiType: "i64",
  },
  "darwin-aarch64": {
    os: "darwin",
    arch: "aarch64",
    denoTarget: "aarch64-apple-darwin",
    libraryName: "libraylib.dylib",
    releaseAsset: "raylib-6.0_macos.tar.gz",
    archive: "tar.gz",
    pointerSize: 8,
    longSize: 8,
    longFfiType: "i64",
  },
} as const;

export type NativeTargetKey = keyof typeof NATIVE_TARGETS;
export type NativeTarget = (typeof NATIVE_TARGETS)[NativeTargetKey];

export function getNativeTarget(os: string, arch: string): NativeTarget {
  const key = `${os}-${arch}` as NativeTargetKey;
  const target = NATIVE_TARGETS[key];
  if (!target) {
    throw new Error(
      `Unsupported Deno-Raylib native target: ${os}/${arch}. Supported targets: ${
        Object.keys(NATIVE_TARGETS).join(", ")
      }`,
    );
  }
  return target;
}
