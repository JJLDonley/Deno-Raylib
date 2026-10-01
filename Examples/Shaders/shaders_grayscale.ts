// Resource-backed grayscale shader example.
import { fromFileUrl } from "path/from-file-url";
import * as raylib from "raylib";

const vertex = fromFileUrl(new URL("../Resources/basic.vs", import.meta.url));
const fragment = fromFileUrl(
  new URL("../Resources/grayscale.fs", import.meta.url),
);
const bitmap = fromFileUrl(
  new URL("../Resources/checker.bmp", import.meta.url),
);
raylib.InitWindow(800, 450, "raylib [shaders] example - grayscale texture");
const shader = raylib.LoadShader(vertex, fragment);
const texture = raylib.LoadTexture(bitmap);
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.BeginShaderMode(shader);
  raylib.DrawTextureEx(
    texture,
    new raylib.Vector2(272, 97),
    0,
    2,
    raylib.White,
  );
  raylib.EndShaderMode();
  raylib.DrawText(
    "CC0 bitmap through a custom grayscale shader",
    155,
    380,
    20,
    raylib.DarkGray,
  );
  raylib.EndDrawing();
}

raylib.UnloadTexture(texture);
raylib.UnloadShader(shader);
raylib.CloseWindow();
