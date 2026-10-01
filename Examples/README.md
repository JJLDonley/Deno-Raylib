# Deno Raylib examples

These examples are TypeScript ports of the official
[raylib 6.0 examples](https://github.com/raysan5/raylib/tree/6.0/examples). The
directory and file names follow the upstream categories so that the C and
TypeScript versions are easy to compare.

Run an example from the repository root after generating `Lib/`:

```sh
deno run --allow-ffi --allow-read Examples/Core/core_basic_window.ts
```

The ports intentionally use the direct API from `Raylib/raylib.ts`. This keeps
function names and control flow close to the original C examples. Focused module
equivalents can be added separately without replacing these direct API ports.

## Porting status

| Category  | Ported |
| --------- | -----: |
| Core      |      6 |
| Shapes    |      3 |
| Text      |      1 |
| Models    |      1 |
| Textures  |      0 |
| Shaders   |      0 |
| Audio     |      0 |
| Others    |      0 |
| **Total** | **11** |

Asset-free examples are being ported first. Resource-dependent examples will
keep their files beneath the matching category directory.
