// Port of raylib 6.0: examples/core/core_input_mouse.c
import * as raylib from "raylib";

raylib.InitWindow(800, 450, "raylib [core] example - mouse input");
raylib.SetTargetFPS(60);

let ballColor = raylib.DarkBlue;

while (!raylib.WindowShouldClose()) {
  const ballPosition = raylib.GetMousePosition();

  if (raylib.IsMouseButtonPressed(raylib.MouseButton.LEFT)) {
    ballColor = raylib.Maroon;
  }
  if (raylib.IsMouseButtonPressed(raylib.MouseButton.MIDDLE)) {
    ballColor = raylib.Lime;
  }
  if (raylib.IsMouseButtonPressed(raylib.MouseButton.RIGHT)) {
    ballColor = raylib.DarkBlue;
  }

  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawCircleV(ballPosition, 40, ballColor);
  raylib.DrawText(
    "move ball with mouse and click mouse button to change color",
    10,
    10,
    20,
    raylib.DarkGray,
  );
  raylib.EndDrawing();
}

raylib.CloseWindow();
