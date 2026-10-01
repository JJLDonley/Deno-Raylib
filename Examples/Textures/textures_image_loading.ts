// Port of raylib 6.0: examples/textures/textures_image_loading.c
import { fromFileUrl } from "path/from-file-url";
import * as raylib from "raylib";

const asset = fromFileUrl(new URL("../Resources/checker.bmp", import.meta.url));
raylib.InitWindow(800, 450, "raylib [textures] example - image loading");
const texture = raylib.LoadTexture(asset);
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawTexture(
    texture,
    400 - texture.width / 2,
    225 - texture.height / 2,
    raylib.White,
  );
  raylib.DrawText(
    "A CC0 bitmap loaded from Examples/Resources",
    180,
    360,
    20,
    raylib.Gray,
  );
  raylib.EndDrawing();
}

raylib.UnloadTexture(texture);
raylib.CloseWindow();
