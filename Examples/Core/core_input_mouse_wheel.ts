// Port of raylib 6.0: examples/core/core_input_mouse_wheel.c
import * as raylib from "raylib";

raylib.InitWindow(800, 450, "raylib [core] example - input mouse wheel");
raylib.SetTargetFPS(60);

let boxPositionY = 450 / 2 - 40;
const scrollSpeed = 4;

while (!raylib.WindowShouldClose()) {
  boxPositionY -= raylib.GetMouseWheelMove() * scrollSpeed;

  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawRectangle(800 / 2 - 40, boxPositionY, 80, 80, raylib.Maroon);
  raylib.DrawText(
    "Use mouse wheel to move the cube up and down!",
    10,
    10,
    20,
    raylib.Gray,
  );
  raylib.DrawText(
    `Box position Y: ${Math.trunc(boxPositionY)}`,
    10,
    40,
    20,
    raylib.LightGray,
  );
  raylib.EndDrawing();
}

raylib.CloseWindow();
