# Deno Raylib

[![JSR](https://jsr.io/badges/@jjld/raylib)](https://jsr.io/@jjld/raylib)
[![JSR Score](https://jsr.io/badges/@jjld/raylib/score)](https://jsr.io/@jjld/raylib)
[![raylib 6.0](https://img.shields.io/badge/raylib-6.0-black)](https://www.raylib.com/)
[![Deno 2](https://img.shields.io/badge/Deno-2-black?logo=deno)](https://deno.com/)

Complete raylib 6.0 TypeScript bindings for Deno, with a faithful C-style API,
focused modules, cross-platform native builds, and a matching browser-facing
API.

> [!IMPORTANT]
> Native desktop support exposes all 921 functions. The generated Emscripten
> backend currently exposes 812 functions; 109 callback and complex pointer APIs
> still require specialized browser marshalling.

## Features

- **Faithful API:** 921 generated bindings across `raylib.h`, `raymath.h`,
  `rcamera.h`, `rlgl.h`, and `rgestures.h`.
- **Focused modules:** use `Window.InitWindow`, `Shapes.DrawCircle`,
  `Model.LoadModel`, and other familiar raylib names without one large import.
- **Cross-platform:** Windows, Linux, and macOS on x64 and ARM64.
- **Release builder:** cross-compile an executable and package the correct
  official raylib 6.0 library in one command.
- **Safe callbacks:** thread-safe, nonblocking trace, file, and audio callbacks.
- **Web-ready structure:** a separate `Web` module tree with the same module and
  function names and correct wasm32 layouts.

## Quick start

Requires Deno 2.7.14 or newer.

Create a starter containing both desktop and web targets:

```bash
deno run -A jsr:@jjld/raylib/init my-raylib-game
cd my-raylib-game
```

Choose a single target when preferred:

```bash
deno run -A jsr:@jjld/raylib/init my-desktop-game --template desktop
deno run -A jsr:@jjld/raylib/init my-web-game --template web
```

The initializer:

1. Creates a desktop, web, or combined source tree.
2. Keeps the complete library contained under the project's `Raylib/` directory
   instead of mixing library internals into the application root.
3. Downloads the host's official raylib 6.0 native library when desktop support
   is selected.
4. Creates a working `deno.json` with build, run, setup, and serve tasks.

The generated tasks are:

| Task                      | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `deno task desktop:run`   | Run the native project during development.    |
| `deno task desktop:build` | Build the current native target.              |
| `deno task web:setup`     | Install Emscripten and raylib web files once. |
| `deno task web:build`     | Build `Source/Web` into `Build/Web`.          |
| `deno task web:serve`     | Serve the generated web directory.            |
| `deno task web:dev`       | Build and then serve the web project.         |

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
```

This reuses the existing checkout in place. The generated `deno.json`,
`Source/`, and `Lib/` belong to `MyProject/`; bindings, modules, web support,
and build tooling remain inside `MyProject/Raylib/`.

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

Use the root export for the closest match to C raylib examples:

```ts
import * as raylib from "jsr:@jjld/raylib";

raylib.DrawCircle(100, 100, 32, raylib.Red);
```

`Raylib/raylib.ts` includes the complete direct surface from `raylib.h`,
`raymath.h`, `rcamera.h`, `rlgl.h`, and `rgestures.h`. Header-oriented entry
points remain available when a narrower import is useful:

```ts
import * as raylib from "jsr:@jjld/raylib/Raylib/raylib";
import * as raymath from "jsr:@jjld/raylib/Raylib/raymath";
import * as rcamera from "jsr:@jjld/raylib/Raylib/rcamera";
import * as rlgl from "jsr:@jjld/raylib/Raylib/rlgl";
import * as rgestures from "jsr:@jjld/raylib/Raylib/rgestures";
```

The official shared libraries expose the public `rgestures` functions through
the base API. Internal event-processing functions from that header are not
exported by the official DLL, shared object, or dylib.

### Focused modules

Use modules for separation of concerns while retaining raylib naming:

```ts
import * as Drawing from "jsr:@jjld/raylib/Modules/Drawing";
import * as Text from "jsr:@jjld/raylib/Modules/Text";
import * as Timing from "jsr:@jjld/raylib/Modules/Timing";
import * as Window from "jsr:@jjld/raylib/Modules/Window";
import { Black, RayWhite } from "jsr:@jjld/raylib";

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
import { Drawing, Shapes, Timing, Window } from "jsr:@jjld/raylib/Modules";
```

### Complete module catalog

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
official raylib 6.0 library:

```bash
deno task build:native --target windows-x86_64 main.ts
```

Output:

```text
dist/windows-x86_64/
├── main.exe
└── Lib/
    └── raylib.dll
```

Standalone executables resolve `Lib` beside the executable, so they can be
launched from any working directory.

Build one target, several comma-separated targets, or every supported target:

```bash
# One target
deno task build:native --target linux-x86_64 main.ts

# Selected targets and a custom output directory
deno task build:native \
  --target linux-x86_64,windows-x86_64 \
  --out-dir releases \
  main.ts

# All six native targets
deno task build:native --target all main.ts
```

The builder works from Linux, Windows, or macOS. Cross-compilation validates and
packages a target, but native execution still requires the target operating
system or a compatible runner. Windows x64 executables can be tested directly
from WSL through Windows interoperability.

## Audio and callbacks

Raylib audio callbacks execute on its audio thread. Deno Raylib registers them
through Deno's thread-safe, nonblocking FFI path so they do not deadlock the
main event loop.

Await callback registration and processor removal, and detach processors before
stopping or unloading their stream:

```ts
import * as AudioStream from "jsr:@jjld/raylib/Modules/AudioStream";

const callback = await AudioStream.SetAudioStreamCallback(stream, () => {
  // Fill the supplied audio buffer.
});

await AudioStream.SetAudioStreamCallback(stream, null);

const processor = AudioStream.AttachAudioStreamProcessor(stream, () => {});
await AudioStream.DetachAudioStreamProcessor(stream, processor);
```

`DetachAudioMixedProcessor` is asynchronous for the same reason. Advanced users
can still access the raw C ABI through `native`.

## Web

Browsers cannot use Deno FFI. `Web` is therefore a separate facade backed by an
Emscripten module, while preserving the native module and function names:

```ts
import { Application, Drawing, Shapes, Window } from "jsr:@jjld/raylib/Web";

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

Every native module has a matching `Web` module, and the test suite enforces all
921 function names. Browser-only lifecycle helpers—`Init`, `Run`, `Stop`, and
`Close`—live in `Web/Application`.

Web uses Emscripten's wasm32 ABI, where pointers and C `long` values are 32-bit.
Its pointer-bearing structures are generated separately and never reuse desktop
layouts.

### Build the WebAssembly runtime

Install the pinned local Emscripten SDK and prepare the official raylib 6.0 web
archive once:

```bash
deno task setup:web
```

Then build the Emscripten runtime and bundle an application into a separate
build directory:

```bash
deno task build:web --source-dir Scripts/Web --out-dir Build/Web
```

This copies `index.html` and produces `app.js`, `raylib_web.mjs`,
`raylib_web.wasm`, `web_structs.js`, and `backend.mjs` under `Build/Web/`; no
generated files are written into `Scripts/Web/`. Omit `--source-dir` when only
the reusable runtime files are needed. The generated native Wasm bridge
currently exposes 812 functions, including normal windowing, input, drawing,
mathematics, images, textures, models, fonts, shaders, audio, and mutable
structure APIs. The remaining 109 APIs use callbacks, variadic arguments,
pointer arrays, raw buffers, or out-parameters and require specialized browser
marshalling. They remain explicit `UnsupportedPlatformError` cases instead of
unsafe generic wrappers.

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
Raylib/             # complete direct API
Modules/            # native separation-of-concerns API
Web/                # matching browser API
Tools/              # repository maintenance and initializer
Scripts/            # files copied into starter projects
Examples/           # runnable ports of the official raylib 6.0 examples
Lib/                # downloaded native/WebAssembly dependencies (ignored)
Tests/              # local tests and probes (ignored)
```

`Lib/` contains native libraries, the local Emscripten SDK, and downloaded web
archives. `Lib/` and `Tests/` are excluded from Git and JSR publication.

Run one of the ports from the repository root:

```bash
deno task example Examples/Core/core_basic_window.ts
```

See [`Examples/README.md`](Examples/README.md) for the current category totals
and porting conventions.

Refresh the pinned official headers and regenerate the bindings:

```bash
deno task update:api
deno task generate
```

Validate formatting, bindings, callbacks, and every native compilation target:

```bash
deno fmt --check
deno lint
deno task test
deno task check:targets
deno publish --dry-run --allow-dirty
```

JSR releases are published with provenance by the GitHub Actions workflow when a
version tag such as `v6.0.4` is pushed. The tag must match the version in
`deno.json`.

The generated source covers `raylib.h`, `raymath.h`, `rcamera.h`, `rlgl.h`, and
`rgestures.h`. Do not edit generated bindings or module files directly; update
their generators instead.

## License

[MIT](LICENSE)
