// Port of raylib 6.0: examples/shapes/shapes_lines_bezier.c
import * as raylib from "raylib";

let start = new raylib.Vector2(100, 100);
let end = new raylib.Vector2(700, 350);
raylib.InitWindow(800, 450, "raylib [shapes] example - cubic-bezier lines");
raylib.SetTargetFPS(60);
while (!raylib.WindowShouldClose()) {
  if (raylib.IsMouseButtonDown(raylib.MouseButton.LEFT)) {
    start = raylib.GetMousePosition();
  }
  if (raylib.IsMouseButtonDown(raylib.MouseButton.RIGHT)) {
    end = raylib.GetMousePosition();
  }
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText(
    "LEFT/RIGHT mouse buttons set START/END points",
    15,
    20,
    20,
    raylib.Gray,
  );
  raylib.DrawLineBezier(start, end, 4, raylib.Blue);
  raylib.DrawCircleV(start, 4, raylib.Red);
  raylib.DrawCircleV(end, 4, raylib.Green);
  raylib.EndDrawing();
}
raylib.CloseWindow();
