// Port of raylib 6.0: examples/core/core_scissor_test.c
import * as raylib from "raylib";

let width = 300;
raylib.InitWindow(800, 450, "raylib [core] example - scissor test");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  width = Math.max(0, width + raylib.GetMouseWheelMove() * 10);
  const x = Math.trunc((800 - width) / 2);
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.Red);
  raylib.BeginScissorMode(x, 0, Math.trunc(width), 450);
  raylib.ClearBackground(raylib.Blue);
  raylib.DrawText(
    "Move the mouse wheel to change the scissor area",
    140,
    200,
    20,
    raylib.White,
  );
  raylib.EndScissorMode();
  raylib.DrawRectangleLinesEx(
    new raylib.Rectangle(x, 0, width, 450),
    1,
    raylib.Black,
  );
  raylib.EndDrawing();
}
raylib.CloseWindow();
