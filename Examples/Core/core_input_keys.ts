// Port of raylib 6.0: examples/core/core_input_keys.c
import * as raylib from "../../Raylib/raylib.ts";

const screenWidth = 800;
const screenHeight = 450;
const ballPosition = new raylib.Vector2(screenWidth / 2, screenHeight / 2);

raylib.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - keyboard input",
);
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  if (raylib.IsKeyDown(raylib.KeyboardKey.RIGHT)) ballPosition.x += 2;
  if (raylib.IsKeyDown(raylib.KeyboardKey.LEFT)) ballPosition.x -= 2;
  if (raylib.IsKeyDown(raylib.KeyboardKey.UP)) ballPosition.y -= 2;
  if (raylib.IsKeyDown(raylib.KeyboardKey.DOWN)) ballPosition.y += 2;

  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText("move the ball with arrow keys", 10, 10, 20, raylib.DarkGray);
  raylib.DrawCircleV(ballPosition, 50, raylib.Maroon);
  raylib.EndDrawing();
}

raylib.CloseWindow();
