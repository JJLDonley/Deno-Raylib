// Port of raylib 6.0: examples/textures/textures_image_generation.c
import * as raylib from "raylib";

raylib.InitWindow(
  800,
  450,
  "raylib [textures] example - procedural image generation",
);
const images = [
  raylib.GenImageGradientLinear(256, 256, 0, raylib.Red, raylib.Blue),
  raylib.GenImageGradientRadial(256, 256, 0.2, raylib.White, raylib.Black),
  raylib.GenImageChecked(256, 256, 32, 32, raylib.Red, raylib.Blue),
  raylib.GenImageCellular(256, 256, 32),
];
const textures = images.map((image) => raylib.LoadTextureFromImage(image));
for (const image of images) raylib.UnloadImage(image);
let current = 0;
raylib.SetTargetFPS(60);
while (!raylib.WindowShouldClose()) {
  if (raylib.IsKeyPressed(raylib.KeyboardKey.ONE)) current = 0;
  if (raylib.IsKeyPressed(raylib.KeyboardKey.TWO)) current = 1;
  if (raylib.IsKeyPressed(raylib.KeyboardKey.THREE)) current = 2;
  if (raylib.IsKeyPressed(raylib.KeyboardKey.FOUR)) current = 3;
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawTexture(textures[current], 272, 80, raylib.White);
  raylib.DrawText(
    "[1] LINEAR  [2] RADIAL  [3] CHECKED  [4] CELLULAR",
    60,
    405,
    20,
    raylib.DarkBlue,
  );
  raylib.EndDrawing();
}
for (const texture of textures) raylib.UnloadTexture(texture);
raylib.CloseWindow();
