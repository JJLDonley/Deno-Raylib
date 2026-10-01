// Port of raylib 6.0: examples/core/core_window_should_close.c
import * as raylib from "raylib";

raylib.InitWindow(800, 450, "raylib [core] example - window should close");
raylib.SetExitKey(raylib.KeyboardKey.NULL);
raylib.SetTargetFPS(60);
let requested = false;
let exit = false;

while (!exit) {
  if (
    raylib.WindowShouldClose() || raylib.IsKeyPressed(raylib.KeyboardKey.ESCAPE)
  ) requested = true;
  if (requested && raylib.IsKeyPressed(raylib.KeyboardKey.Y)) exit = true;
  if (requested && raylib.IsKeyPressed(raylib.KeyboardKey.N)) requested = false;
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  if (requested) {
    raylib.DrawRectangle(0, 100, 800, 200, raylib.Black);
    raylib.DrawText(
      "Are you sure you want to exit? [Y/N]",
      120,
      200,
      30,
      raylib.White,
    );
  } else {
    raylib.DrawText(
      "Try to close the window or press ESC",
      120,
      200,
      30,
      raylib.DarkGray,
    );
  }
  raylib.EndDrawing();
}
raylib.CloseWindow();
