// Port of raylib 6.0: examples/shapes/shapes_logo_raylib.c
import * as raylib from "raylib";

raylib.InitWindow(
  800,
  450,
  "raylib [shapes] example - raylib logo using shapes",
);
raylib.SetTargetFPS(60);
while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawRectangle(272, 97, 256, 256, raylib.Black);
  raylib.DrawRectangle(288, 113, 224, 224, raylib.RayWhite);
  raylib.DrawText("raylib", 356, 225, 50, raylib.Black);
  raylib.DrawText("this is NOT a texture!", 350, 370, 10, raylib.Gray);
  raylib.EndDrawing();
}
raylib.CloseWindow();
