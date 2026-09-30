#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-6.0}"
OUT_DIR="${2:-Lib}"

ROOT="$(pwd)"
TMP="$ROOT/_raylib_tmp"
BLOBS="$ROOT/$OUT_DIR"

rm -rf "$TMP"
mkdir -p "$TMP" "$BLOBS"

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
  find "$TMP" \( -type f -o -type l \) -name "$LIB_BASE*" |
    sort |
    head -n 1
)"

if [ -z "$FOUND" ]; then
  echo "Library not found: $LIB_BASE"
  exit 1
fi

REAL_FOUND="$(readlink -f "$FOUND")"

case "$REAL_FOUND" in
  "$TMP"/*) ;;
  *) echo "Refusing symlink outside temp dir: $FOUND -> $REAL_FOUND"; exit 1 ;;
esac

echo "Found: $FOUND"

rm -f "$BLOBS/$LIB_BASE" "$BLOBS/$LIB_BASE".*

case "$OS" in
  linux)
    REAL_NAME="$(basename "$REAL_FOUND")"
    cp "$REAL_FOUND" "$BLOBS/$REAL_NAME"

    if [ "$REAL_NAME" != "$LIB_BASE" ]; then
      ln -s "$REAL_NAME" "$BLOBS/$LIB_BASE"
    fi
    ;;

  darwin)
    REAL_NAME="$(basename "$REAL_FOUND")"
    cp "$REAL_FOUND" "$BLOBS/$REAL_NAME"

    if [ "$REAL_NAME" != "$LIB_BASE" ]; then
      ln -s "$REAL_NAME" "$BLOBS/$LIB_BASE"
    fi
    ;;

  windows)
    cp "$REAL_FOUND" "$BLOBS/$LIB_BASE"
    ;;
esac

rm -rf "$TMP"

echo "Done:"
ls -l "$BLOBS"
