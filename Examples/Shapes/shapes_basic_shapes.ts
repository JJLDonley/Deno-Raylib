// Port of raylib 6.0: examples/shapes/shapes_basic_shapes.c
import * as raylib from "raylib";

raylib.InitWindow(800, 450, "raylib [shapes] example - basic shapes drawing");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText(
    "some basic shapes available on raylib",
    20,
    20,
    20,
    raylib.DarkGray,
  );
  raylib.DrawCircle(800 / 4, 120, 35, raylib.DarkBlue);
  raylib.DrawRectangle(800 / 4 * 2 - 60, 100, 120, 60, raylib.Red);
  raylib.DrawRectangleGradientH(
    800 / 4 * 3 - 60,
    100,
    120,
    60,
    raylib.Maroon,
    raylib.Gold,
  );
  raylib.DrawTriangle(
    new raylib.Vector2(800 / 4, 220),
    new raylib.Vector2(800 / 4 - 60, 320),
    new raylib.Vector2(800 / 4 + 60, 320),
    raylib.Violet,
  );
  raylib.DrawPoly(new raylib.Vector2(800 / 4 * 2, 260), 6, 80, 0, raylib.Brown);
  raylib.DrawCircleGradient(800 / 4 * 3, 260, 60, raylib.Green, raylib.SkyBlue);
  raylib.DrawLine(18, 42, 782, 42, raylib.Black);
  raylib.EndDrawing();
}

raylib.CloseWindow();
