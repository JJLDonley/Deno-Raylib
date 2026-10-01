# Deno Raylib examples

These examples are TypeScript ports of the official
[raylib 6.0 examples](https://github.com/raysan5/raylib/tree/6.0/examples). The
directory and file names follow the upstream categories so that the C and
TypeScript versions are easy to compare.

Run an example from the repository root after generating `Lib/`:

```sh
deno run --allow-ffi --allow-read Examples/Core/core_basic_window.ts
```

The ports intentionally use the repository's `raylib` import-map entrypoint:

```ts
import * as raylib from "raylib";
```

This keeps function names and control flow close to the original C examples
while exercising the same public direct API throughout the catalog. Focused
module equivalents can be added separately without replacing these direct API
ports.

## Porting status

| Category  | Ported |
| --------- | -----: |
| Core      |     11 |
| Shapes    |      8 |
| Text      |      2 |
| Models    |      4 |
| Textures  |      4 |
| Shaders   |      2 |
| Audio     |      2 |
| Others    |      0 |
| **Total** | **33** |

Resource-dependent examples use original assets under `Examples/Resources`.
Those assets are dedicated to the public domain under CC0 1.0 and can be
regenerated with `deno task examples:assets`.
