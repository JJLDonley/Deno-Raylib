// Port of raylib 6.0: examples/shapes/shapes_rectangle_scaling.c
import * as raylib from "raylib";

const rec = new raylib.Rectangle(100, 100, 200, 80);
let scaling = false;
raylib.InitWindow(
  800,
  450,
  "raylib [shapes] example - rectangle scaling mouse",
);
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  const mouse = raylib.GetMousePosition();
  const handle = new raylib.Rectangle(
    rec.x + rec.width - 12,
    rec.y + rec.height - 12,
    24,
    24,
  );
  const ready = raylib.CheckCollisionPointRec(mouse, handle);
  if (ready && raylib.IsMouseButtonPressed(raylib.MouseButton.LEFT)) {
    scaling = true;
  }
  if (scaling) {
    rec.width = Math.max(25, mouse.x - rec.x);
    rec.height = Math.max(25, mouse.y - rec.y);
    if (raylib.IsMouseButtonReleased(raylib.MouseButton.LEFT)) scaling = false;
  }
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText(
    "Drag the bottom-right corner to scale",
    10,
    10,
    20,
    raylib.Gray,
  );
  raylib.DrawRectangleRec(rec, raylib.Fade(raylib.Green, 0.5));
  raylib.DrawRectangleLinesEx(rec, 1, raylib.Red);
  raylib.DrawRectangleRec(handle, ready ? raylib.Red : raylib.Maroon);
  raylib.EndDrawing();
}
raylib.CloseWindow();
