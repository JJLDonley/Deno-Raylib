// Port of raylib 6.0: examples/textures/textures_logo_raylib.c
import * as raylib from "raylib";

raylib.InitWindow(
  800,
  450,
  "raylib [textures] example - texture from generated image",
);
const image = raylib.GenImageColor(256, 256, raylib.RayWhite);
raylib.ImageDrawRectangle(image, 0, 0, 256, 256, raylib.Black);
raylib.ImageDrawRectangle(image, 16, 16, 224, 224, raylib.RayWhite);
raylib.ImageDrawText(image, "raylib", 68, 112, 50, raylib.Black);
const texture = raylib.LoadTextureFromImage(image);
raylib.UnloadImage(image);
raylib.SetTargetFPS(60);
while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawTexture(texture, 272, 97, raylib.White);
  raylib.DrawText("this IS a texture!", 360, 370, 10, raylib.Gray);
  raylib.EndDrawing();
}
raylib.UnloadTexture(texture);
raylib.CloseWindow();
