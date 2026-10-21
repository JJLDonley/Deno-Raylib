#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-6.2}"
OUT_DIR="${2:-Lib}"

ROOT="$(pwd)"
TMP="$(mktemp -d -t deno-raylib.XXXXXXXX)"
trap 'rm -rf -- "$TMP"' EXIT
case "$OUT_DIR" in
  /*) BLOBS="$OUT_DIR" ;;
  *) BLOBS="$ROOT/$OUT_DIR" ;;
esac
mkdir -p "$BLOBS"

UNAME="$(uname -s)"
ARCH="$(uname -m)"

case "$UNAME" in
  Linux*)   OS="linux" ;;
  Darwin*)  OS="darwin" ;;
  MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
  *) echo "Unsupported OS: $UNAME"; exit 1 ;;
esac

case "$ARCH" in
  x86_64|amd64) ARCH="x64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *) echo "Unsupported arch: $ARCH"; exit 1 ;;
esac

echo "Detected: $OS/$ARCH"

API="https://api.github.com/repos/raysan5/raylib/releases/tags/$VERSION"
ASSETS="$(curl -fsSL "$API")"

case "$OS" in
  windows)
    if [ "$ARCH" = "x64" ]; then
      PATTERN="raylib-${VERSION}_win64_msvc16\\.zip"
    else
      PATTERN="raylib-${VERSION}_winarm64_msvc16\\.zip"
    fi
    LIB_BASE="raylib.dll"
    ;;
  linux)
    if [ "$ARCH" = "x64" ]; then
      PATTERN="raylib-${VERSION}_linux_amd64\\.tar\\.gz"
    else
      PATTERN="raylib-${VERSION}_linux_arm64\\.tar\\.gz"
    fi
    LIB_BASE="libraylib.so"
    ;;
  darwin)
    PATTERN="raylib-${VERSION}_macos\\.tar\\.gz"
    LIB_BASE="libraylib.dylib"
    ;;
esac

URL="$(
  echo "$ASSETS" |
    grep browser_download_url |
    grep -E "$PATTERN" |
    cut -d '"' -f 4 |
    head -n 1
)"

if [ -z "$URL" ]; then
  echo "No matching raylib release asset found for $OS/$ARCH"
  exit 1
fi

FILE="$TMP/$(basename "$URL")"

echo "Downloading: $URL"
curl -fL "$URL" -o "$FILE"

echo "Extracting..."
case "$FILE" in
  *.zip)    unzip -q "$FILE" -d "$TMP" ;;
  *.tar.gz) tar -xzf "$FILE" -C "$TMP" ;;
  *) echo "Unsupported archive: $FILE"; exit 1 ;;
esac

FOUND="$(
  find "$TMP" -type f \( -name "$LIB_BASE" -o -name 'libraylib.so.*' -o -name 'libraylib.*.dylib' \) |
    sort |
    head -n 1
)"

if [ -z "$FOUND" ]; then
  echo "Library not found: $LIB_BASE"
  exit 1
fi

REAL_FOUND="$FOUND"

case "$REAL_FOUND" in
  "$TMP"/*) ;;
  *) echo "Refusing symlink outside temp dir: $FOUND -> $REAL_FOUND"; exit 1 ;;
esac

echo "Found: $FOUND"

cp "$REAL_FOUND" "$TMP/installed-library"
# Replace the link itself if an older install used symlinks. Keep older versioned
# libraries intact and never delete an application's pre-existing temp directory.
mv -f "$TMP/installed-library" "$BLOBS/$LIB_BASE"

echo "Done:"
ls -l "$BLOBS"
