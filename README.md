# Deno Raylib

[![JSR](https://jsr.io/badges/@jjld/raylib)](https://jsr.io/@jjld/raylib)
[![JSR Score](https://jsr.io/badges/@jjld/raylib/score)](https://jsr.io/@jjld/raylib)
[![raylib 6.2](https://img.shields.io/badge/raylib-6.2-black)](https://www.raylib.com/)
[![Deno 2](https://img.shields.io/badge/Deno-2-black?logo=deno)](https://deno.com/)

Raylib 6.2 TypeScript bindings for Deno, with a faithful C-style API, focused
modules, cross-platform native builds, and a matching browser-facing API.

> [!IMPORTANT]
> Native desktop support exposes 940 functions from official binaries, plus two
> optional gesture-processing functions for custom native builds. The generated
> Emscripten backend currently exposes 827 functions; 115 callback and complex
> pointer APIs still require specialized browser marshalling.

## Features

- **Faithful API:** 942 generated bindings across `raylib.h`, `raymath.h`,
  `rcamera.h`, `rlgl.h`, and `rgestures.h`.
- **Focused modules:** use `Window.InitWindow`, `Shapes.DrawCircle`,
  `Model.LoadModel`, and other familiar raylib names without one large import.
- **Cross-platform:** Windows, Linux, and macOS on x64 and ARM64.
- **Release builder:** cross-compile an executable and package the correct
  official raylib 6.2 library in one command.
- **Callback support:** trace/file callbacks, plus thread-safe audio bridges
  with asynchronous registration and deadlock guards.
- **Web-ready structure:** a separate `Web` module tree with the same module and
  function names and correct wasm32 layouts.

## Quick start

Requires Deno 2.7.14 or newer.

### Upgrading from 6.0

Use raylib **6.2** native libraries with these bindings; the 6.0 libraries do
not export the new functions. For a checkout-based application, update the
`Raylib/` checkout and replace the host library in the application's `Lib/`
directory using the download helper from the application root:

```bash
# Linux/macOS
bash Raylib/Tools/blobs.sh 6.2
```

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File .\Raylib\Tools\blobs.ps1 -Version 6.2
```

These helpers are in Git checkouts, not copied starter libraries. For a copied
starter, create a separate 6.2 starter and replace the old library directory and
native library from it, preserving your `Source/` and application configuration.
Re-run `deno task web:setup` to refresh the Web archive, then rebuild the Web
output. The pinned Emscripten toolchain version is independent of raylib's
version.

The direct API follows the 6.2 header, including these breaking changes:

| Previous API                                      | 6.2 API                                                                                                                    |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `GetSplinePointBezierQuad`                        | `GetSplinePointBezierQuadratic`                                                                                            |
| `ImageDrawTriangleEx`                             | `ImageDrawTriangleGradient`                                                                                                |
| `ImageDraw(dst, src, srcRec, dstRec, tint)`       | `ImageDrawImagePro(dst, src, srcRec, dstRec, origin, rotation, tint)`; use a zero origin and rotation for the old behavior |
| `ImageDrawRectangleLines(dst, rec, thick, color)` | `ImageDrawRectangleLinesEx(dst, rec, thick, color)`                                                                        |
| `ChangeDirectory` returning boolean               | Integer status: `0` means success                                                                                          |
| `GetCharPressed()` returning a string             | Numeric Unicode codepoint; `0` when the queue is empty                                                                     |
| `DrawCircleGradient(x, y, radius, inner, outer)`  | `DrawCircleGradient(center: Vector2, radius, inner, outer)`                                                                |
| `SetGamepadMappings()` returning void             | Integer status returned by raylib                                                                                          |
| `ExportAutomationEventList()` returning void      | Boolean success returned by raylib                                                                                         |
| `ImageColorContrast` floating-point contrast      | Integer contrast                                                                                                           |
| Capsule arguments `slices, rings`                 | `rings, slices` for `DrawCapsule` and `DrawCapsuleWires`                                                                   |

`ImageDrawRectangleLines` now takes `dst, posX, posY, width, height, color`. The
new image, shape, path, and render-texture functions are also available in their
corresponding `Modules/` and `Web/` namespaces, subject to the Web bridge's
documented unsupported APIs.

`UpdateSound` names its final argument `frameCount`, matching the 6.2 header;
pass the number of audio frames, not the total interleaved channel samples.

`GetCharPressed()` returns a number on both desktop and Web. Only convert it
when you need text:
`if (codepoint !== 0) text += String.fromCodePoint(codepoint)`. The binding does
not convert codepoints to UTF-16 characters or strings.

### Creating a project

Web setup downloads a pinned Emscripten SDK archive without requiring Git. On
Windows, setup installs Emscripten's Python locally under the project's
`Lib/emsdk`; it does not require a system Python installation. Linux and macOS
require Python 3.10+ on PATH. Run setup from the application root with
`deno task web:setup`, then `deno task web:build`.

Before downloading, setup lists the toolchain and bundled runtimes, shows the
project-local destination, and asks for confirmation. Declining cancels setup.
Non-interactive setup requires explicit approval with
`deno run -A Raylib/Scripts/setup_emscripten.ts --yes` from the application
root, followed by `deno run -A Raylib/Scripts/prepare_web.ts`.

Create a starter containing both desktop and web targets:

```bash
deno run -A jsr:@jjld/raylib/init my-raylib-game
cd my-raylib-game
deno task check
deno task desktop:run
```

For the browser, run these commands from the same application directory:

```bash
deno task web:setup
deno task web:dev
```

Approve the toolchain download when prompted, then open the HTTP address printed
by the server. Do not open `index.html` directly with a `file://` URL. Later
runs only need `deno task web:dev`; `web:serve` alone serves the last build
without rebuilding it.

Choose a single target when preferred:

```bash
deno run -A jsr:@jjld/raylib/init my-desktop-game --template desktop
deno run -A jsr:@jjld/raylib/init my-web-game --template web
```

The initializer:

1. Creates a desktop, web, or combined source tree.
2. Keeps the complete library contained under the project's `Raylib/` directory
   instead of mixing library internals into the application root.
3. Downloads the host's official raylib 6.2 native library when desktop support
   is selected.
4. Creates a working `deno.json` with build, run, setup, and serve tasks.

The generated tasks are listed below. Single-target templates only include tasks
for their selected target.

| Task                          | Purpose                                       |
| ----------------------------- | --------------------------------------------- |
| `deno task check`             | Type-check the application's entrypoints.     |
| `deno task desktop:run`       | Run the native project during development.    |
| `deno task desktop:build`     | Build the current native target.              |
| `deno task desktop:build:all` | Package all six native targets.               |
| `deno task web:setup`         | Install Emscripten and raylib web files once. |
| `deno task web:build`         | Build `Source/Web` into `Build/Web`.          |
| `deno task web:serve`         | Serve the generated web directory.            |
| `deno task web:dev`           | Build and then serve the web project.         |

`deno task init` cannot bootstrap an empty directory because tasks only exist
after a `deno.json` has been created. The exported `jsr:@jjld/raylib/init`
command is the project initializer; afterward, all normal work uses the
generated tasks. From a checked-out Deno Raylib repository, the equivalent
convenience commands are `deno task init my-game`, `deno task web:init my-game`,
and `deno task desktop:init my-game`.

To keep a Git checkout inside an application, clone it as the application's
`Raylib/` directory and initialize the parent:

```bash
mkdir MyProject
git clone https://github.com/JJLDonley/Deno-Raylib.git MyProject/Raylib
cd MyProject/Raylib
deno task init ..
cd ..
deno task check
deno task desktop:build
deno task web:setup
deno task web:build
```

This reuses the existing checkout in place. The generated `deno.json`,
`Source/`, and `Lib/` belong to `MyProject/`; bindings, modules, web support,
and build tooling remain inside `MyProject/Raylib/`.

```text
MyProject/
├── Raylib/          # cloned library: Bindings, Raylib, Modules, Web, Scripts
├── Source/          # your Desktop/main.ts and Web/main.ts + index.html
├── Lib/             # downloaded native library and Web toolchain (ignored)
├── Build/           # Desktop executables and Web site (ignored)
└── deno.json        # imports and tasks referencing ./Raylib/
```

Application code imports `raylib`, `raylib/Modules`, or `raylib/Web` through the
root import map. Run application tasks from `MyProject/`; tasks inside the
checkout are for maintaining the library. Git is only needed for the initial
clone in this workflow. Setup and builds do not use Git.

The generated example follows the original raylib programming style:

```ts
import * as raylib from "raylib";

raylib.InitWindow(800, 450, "Deno Raylib");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText("Hello from Deno!", 24, 24, 24, raylib.Black);
  raylib.EndDrawing();
}

raylib.CloseWindow();
```

## Choose your API style

Deno Raylib provides two native import styles over the same bindings. They can
be mixed when useful, and neither changes the original raylib function names.

### Direct API

Use the generated import alias for the closest match to C raylib examples:

```ts
import * as raylib from "raylib";

raylib.DrawCircle(100, 100, 32, raylib.Red);
```

These snippets use the initializer's `deno.json` import map. Direct JSR imports
are also supported (`import * as raylib from "jsr:@jjld/raylib"`), but importing
the package alone does not install the native library or create a project.

`Raylib/raylib.ts` combines the bound direct surface from `raylib.h`,
`raymath.h`, `rcamera.h`, `rlgl.h`, and `rgestures.h`. Header-oriented entry
points remain available when a narrower import is useful:

```ts
import * as raylib from "jsr:@jjld/raylib/Raylib/raylib";
import * as raymath from "jsr:@jjld/raylib/Raylib/raymath";
import * as rcamera from "jsr:@jjld/raylib/Raylib/rcamera";
import * as rlgl from "jsr:@jjld/raylib/Raylib/rlgl";
import * as rgestures from "jsr:@jjld/raylib/Raylib/rgestures";
```

The official shared libraries expose the public gesture queries through the base
API. `ProcessGestureEvent()` and `UpdateGestures()` are also present in the
bindings, with `GestureEvent` and `TouchAction`, but need a custom native
library that exports those symbols. Calling them with an official native binary
throws an availability error; it does not prevent the rest of the bindings from
loading. Both functions work in the generated Web backend.

### Focused modules

Use modules for separation of concerns while retaining raylib naming:

```ts
import { Drawing, Text, Timing, Window } from "raylib/Modules";
import { Black, RayWhite } from "raylib";

Window.InitWindow(800, 450, "Deno Raylib Modules");
Timing.SetTargetFPS(60);

while (!Window.WindowShouldClose()) {
  Drawing.BeginDrawing();
  Drawing.ClearBackground(RayWhite);
  Text.DrawText("Small imports, familiar API", 24, 24, 24, Black);
  Drawing.EndDrawing();
}

Window.CloseWindow();
```

Import all modules as namespaces when preferred:

```ts
import { Drawing, Shapes, Timing, Window } from "raylib/Modules";
```

For a single local module, use
`import * as Window from
"raylib/Modules/Window.ts"`. The local prefix alias
requires the `.ts` extension; published JSR entrypoints such as
`jsr:@jjld/raylib/Modules/Window` do not.

### Complete module catalog

Focused modules keep the original function names: for example,
`Keyboard.GetCharPressed()`, `Events.PollInputEvents()`, and `Colors.Red`.
`Camera2D` contains 2D camera operations; `Camera3D` contains 3D operations,
including `UpdateCamera` and `UpdateCameraPro`. Use `Camera` for both, or
`CameraControls` for 3D update and movement helpers. The same grouping applies
under `Web/`.

| Area                 | Modules                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| Application          | `Application`, `Core`, `Window`, `Monitor`, `Screen`, `Events`, `Timing`, `Automation`                  |
| Platform             | `Clipboard`, `Cursor`, `Logging`, `Memory`, `Random`                                                    |
| Files and data       | `Files`, `Directories`, `Paths`, `DroppedFiles`, `Compression`, `Hashing`                               |
| Input                | `Input`, `Keyboard`, `Mouse`, `Gamepad`, `Touch`, `Gestures`                                            |
| Drawing              | `Graphics`, `Drawing`, `Blend`, `Scissor`, `Colors`, `RenderTexture`, `VR`                              |
| Images and textures  | `Assets`, `Image`, `Texture`, `TextureDrawing`, `Cubemap`                                               |
| Shapes and collision | `Shapes`, `Shapes2D`, `Shapes3D`, `Splines`, `Collision`, `Collision2D`, `Collision3D`                  |
| Text                 | `Text`, `Font`, `Glyph`                                                                                 |
| Models               | `Model`, `Mesh`, `Material`, `Animation`, `Skeleton`, `ModelCollision`                                  |
| Cameras              | `Camera`, `Camera2D`, `Camera3D`, `CameraControls`, `Coordinates`                                       |
| Shaders              | `Shaders`, `LowLevelShader`, `ShaderBuffer`                                                             |
| Audio                | `Audio`, `AudioDevice`, `Wave`, `Sound`, `Music`, `AudioStream`                                         |
| Mathematics          | `Math`, `ScalarMath`, `Vector2`, `Vector3`, `Vector4`, `Matrix`, `Quaternion`                           |
| Low-level rendering  | `Rlgl`, `ImmediateMode`, `RenderState`, `RenderBatch`, `VertexBuffer`, `Framebuffer`, `LowLevelTexture` |

The generated manifest verifies that every bound function belongs to at least
one module. Deprecated `Models` and `Windows` aliases remain available for
compatibility.

## Native platform support

| Platform | Architecture  | Deno target                 | Official raylib artifact | ABI   |
| -------- | ------------- | --------------------------- | ------------------------ | ----- |
| Windows  | x64           | `x86_64-pc-windows-msvc`    | `win64_msvc16`           | LLP64 |
| Windows  | ARM64         | `aarch64-pc-windows-msvc`   | `winarm64_msvc16`        | LLP64 |
| Linux    | x64           | `x86_64-unknown-linux-gnu`  | `linux_amd64`            | LP64  |
| Linux    | ARM64         | `aarch64-unknown-linux-gnu` | `linux_arm64`            | LP64  |
| macOS    | Intel         | `x86_64-apple-darwin`       | universal `macos`        | LP64  |
| macOS    | Apple Silicon | `aarch64-apple-darwin`      | universal `macos`        | LP64  |

The target table controls artifact selection and FFI type widths. Windows uses a
32-bit C `long`; Linux and macOS use a 64-bit C `long`. The generator rejects
future target-sized structure fields rather than silently generating layouts
from the maintainer's host ABI.

During `deno run`, the native library is loaded from `./Lib/`:

| Platform | Library           |
| -------- | ----------------- |
| Windows  | `raylib.dll`      |
| Linux    | `libraylib.so`    |
| macOS    | `libraylib.dylib` |

Run with `--allow-ffi --allow-read`, or use `-A` as in the generated project.

## Build native releases

The release builder compiles your entry point and downloads the matching
official raylib 6.2 library:

```bash
deno run -A Raylib/Scripts/build_native.ts --target windows-x86_64 --out-dir Build/Desktop Source/Desktop/main.ts
```

Output:

```text
Build/Desktop/windows-x86_64/
├── main.exe
└── Lib/
    └── raylib.dll
```

Standalone executables resolve `Lib` beside the executable, so they can be
launched from any working directory.

Build one target, several comma-separated targets, or every supported target:

```bash
# One target
deno run -A Raylib/Scripts/build_native.ts --target linux-x86_64 --out-dir Build/Desktop Source/Desktop/main.ts

# Selected targets and a custom output directory
deno run -A Raylib/Scripts/build_native.ts --target linux-x86_64,windows-x86_64 --out-dir releases Source/Desktop/main.ts

# All six native targets
deno task desktop:build:all
```

These commands run from the application root. Inside the library repository, the
equivalent builder task is `deno task build:native` with an explicit entrypoint.
Distribute the entire target directory, including its `Lib/` directory, not just
the executable. Application assets must also be included by your release
process; the native builder packages the executable and raylib library, not
arbitrary assets.

The builder works from Linux, Windows, or macOS. Cross-compilation validates and
packages a target, but native execution still requires the target operating
system or a compatible runner. Windows x64 executables can be tested directly
from WSL through Windows interoperability.

## Audio and callbacks

Raylib audio callbacks execute on its audio thread, which waits for JavaScript
while holding the audio mutex. Registration, attachment, and detachment
therefore use thread-safe callbacks and nonblocking FFI calls. All three must be
awaited.

Start playback before attaching callbacks. While any callback or processor is
attached (or registration is pending), synchronous audio operations throw a
clear error rather than risk deadlocking. Await detachment of **all** callbacks
and processors before querying, changing, loading, stopping, or unloading audio.
This guard also applies inside a callback: only process its supplied buffer
there. Yield the JavaScript event loop regularly so queued audio callbacks can
execute.

```ts
import { AudioStream } from "raylib/Modules";

AudioStream.PlayAudioStream(stream);
await AudioStream.SetAudioStreamCallback(stream, () => {
  // Fill the supplied audio buffer.
});

await AudioStream.SetAudioStreamCallback(stream, null);

const processor = await AudioStream.AttachAudioStreamProcessor(
  stream,
  () => {},
);
await AudioStream.DetachAudioStreamProcessor(stream, processor);
AudioStream.StopAudioStream(stream);
```

`AttachAudioMixedProcessor` and `DetachAudioMixedProcessor` are asynchronous for
the same reason. This changes processor attachment from the previous synchronous
wrapper: add `await` at both attachment call sites when upgrading. Advanced
users can still access the raw C ABI through `native`, which bypasses these
guards and requires managing callback lifetimes and thread safety themselves.

## Web

Browsers cannot use Deno FFI. `Web` is therefore a separate facade backed by an
Emscripten module, while preserving the native module and function names:

```ts
import { Application, Drawing, Shapes, Window } from "raylib/Web";

const background = new Drawing.Color(245, 245, 245, 255);
const accent = new Drawing.Color(230, 41, 55, 255);

await Application.Init({
  canvas: "#game",
  moduleUrl: new URL("./backend.mjs", import.meta.url),
});

Window.InitWindow(800, 450, "Deno Raylib Web");

await Application.Run({
  draw() {
    Drawing.BeginDrawing();
    Drawing.ClearBackground(background);
    Shapes.DrawCircle(100, 100, 20, accent);
    Drawing.EndDrawing();
  },
});
```

Put this code in `Source/Web/main.ts` and use a `<canvas id="game"></canvas>` in
`Source/Web/index.html`, loading `./app.js` with a module script. The starter
already supplies both files. `app.js` is the generated application bundle, not a
library source file; edit `main.ts` and rebuild.

To port desktop code, switch namespace imports from `raylib/Modules` to
`raylib/Web`, initialize the browser backend, and move each frame into
`Application.Run`. Do not use a blocking `while` loop in the browser. Matching
names do not guarantee identical platform capabilities: check the unsupported
API list (`unsupported`) in [`Web/Bridge/exports.json`](Web/Bridge/exports.json)
before porting pointer-heavy code.

Every native module has a matching `Web` module, and the test suite enforces all
942 function names. Browser-only lifecycle helpers—`Init`, `Run`, `Stop`, and
`Close`—live in `Web/Application`.

Web uses Emscripten's wasm32 ABI, where pointers and C `long` values are 32-bit.
Its pointer-bearing structures are generated separately and never reuse desktop
layouts.

### Build the WebAssembly runtime

Install the pinned local Emscripten SDK and prepare the official raylib 6.2 web
archive once:

```bash
deno task web:setup
```

Then build the Emscripten runtime and bundle an application into a separate
build directory:

```bash
deno task web:build
deno task web:serve
```

This copies `index.html` and produces `app.js`, `raylib_web.mjs`,
`raylib_web.wasm`, `web_structs.js`, and `backend.mjs` under `Build/Web/`; no
generated files are written into `Source/Web/`. Serve or deploy the entire
`Build/Web/` directory together. Asset files are not automatically copied from
your source tree; include them in the served directory at the paths your code
uses.

For library development only, run `deno task setup:web` and
`deno task build:web --source-dir Scripts/Web --out-dir Build/Web` from the
repository root. Omit `--source-dir` when only the reusable runtime files are
needed. The generated native Wasm bridge currently exposes 827 functions,
including normal windowing, input, drawing, mathematics, images, textures,
models, fonts, shaders, audio, and mutable structure APIs. The remaining 115
APIs use callbacks, variadic arguments, pointer arrays, raw buffers, or
out-parameters and require specialized browser marshalling. They remain explicit
`UnsupportedPlatformError` cases instead of unsafe generic wrappers.

Web adapters preserve the desktop wrapper signatures, including `TextCopy()` and
`MatrixDecompose()` object results. `LoadImageColors()` and `LoadImagePalette()`
return JavaScript-owned byte arrays: their Wasm allocations are released after
copying, so `UnloadImageColors()` and `UnloadImagePalette()` are compatibility
no-ops on Web. These copies remain valid across Wasm memory growth. Text
functions returning static storage are copied without freeing that storage;
allocated string results are copied and freed.

`Application.Init({ wasmUrl, assetBaseUrl })` can relocate the Wasm binary or
Emscripten runtime files. Relative URLs resolve beside `backend.mjs`;
`assetBaseUrl` is a directory, not a virtual-filesystem asset mount.
`Application.Stop()` ends the active loop; `Application.Close()` also detaches
the backend after shutdown. Await the `Application.Run()` promise to know when
shutdown has finished. Callback errors reject that promise, and concurrent loops
are rejected.

On desktop, memory-loaded music keeps an owned copy of its input bytes until
`UnloadMusicStream()`. Active automation lists and render batches stay
referenced until detached or unloaded. Continue to unload resources explicitly,
as in C.

APIs requiring persistent native pointers remain unsupported on Web, including
`SetAutomationEventList()`, `rlSetRenderBatchActive()`, `UnloadFontData()`,
`UnloadModelAnimations()`, `UnloadFileText()`, and `UnloadUTF8()`. In
particular, the bridge does not pass temporary copies to APIs that retain or
free pointers.

## Manual setup

Clone the repository and download the native library for the current host:

```bash
git clone https://github.com/JJLDonley/Deno-Raylib.git
cd Deno-Raylib
```

Linux or macOS:

```bash
chmod +x Tools/blobs.sh
./Tools/blobs.sh
```

Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\Tools\blobs.ps1
```

Expected native library layout:

```text
Lib/
├── raylib.dll       # Windows
├── libraylib.so     # Linux
└── libraylib.dylib  # macOS
```

Only the library for the current runtime platform is required.

## Development

The repository layout separates public APIs, generated internals, project
scripts, and local artifacts:

```text
Bindings/
├── Generators/
├── Headers/
└── Structs/
Raylib/             # public implementations organized by C header
Modules/            # native separation-of-concerns API
Web/                # matching browser API
Tools/              # repository maintenance and initializer
Scripts/            # contained native/Web build tooling and starter templates
Examples/           # runnable ports of the official raylib 6.2 examples
Lib/                # downloaded native/WebAssembly dependencies (ignored)
Tests/              # local tests and probes (ignored)
```

`Raylib/rlgl.ts`, `rcamera.ts`, `raymath.ts`, and `rgestures.ts` own their
header-specific wrappers. `Raylib/raylib.ts` implements the core API and
re-exports those entrypoints for a single combined import. `Bindings/` holds the
supporting FFI declarations, native layouts, structures, and loader; `Modules/`
groups the public API into namespaces without duplicating wrappers.

`Lib/` contains native libraries, the local Emscripten SDK, and downloaded web
archives. `Lib/` and `Tests/` are excluded from Git and JSR publication.

Run one of the ports from the repository root:

```bash
deno task example Examples/Core/core_basic_window.ts
```

See [`Examples/README.md`](Examples/README.md) for the current category totals
and porting conventions. The 33 ports include texture, model, shader, and audio
examples. Their original assets are free to use under
[CC0 1.0](Examples/Resources/LICENSE.md), including in commercial projects.

Refresh the pinned official headers and regenerate the bindings:

Header parsing requires a C compiler available as `cc`. It is only needed for
maintaining the bindings, not for native starter projects. Use
`deno task update:api --local` to parse the already-vendored headers offline.

```bash
deno task update:api
deno task generate
```

Validate the tracked package and examples before publishing:

```bash
deno fmt --check
deno lint
deno task examples:check
deno task check:headers
deno publish --dry-run --allow-dirty
```

The maintainer's local suite can additionally be run with `deno test -A Tests/`
when that directory is present. It is intentionally not included in a clone or
JSR package. Cross-compilation is not a substitute for execution: Linux and
Windows have been runtime-tested; macOS and ARM targets are compile-validated
only.

JSR releases are published with provenance by the GitHub Actions workflow when a
`v*` version tag is pushed. The tag must match the version in `deno.json`.

The public source is organized around `raylib.h`, `raymath.h`, `rcamera.h`,
`rlgl.h`, and `rgestures.h`. For generated files, update their generators rather
than editing generated output; the handwritten public wrappers are maintained in
`Raylib/`.

`check:headers` verifies all public function signatures and checks that the Deno
FFI descriptors agree with the generated struct layouts, including nested-struct
padding. It also runs in the release workflow.

## License

[MIT](LICENSE)
