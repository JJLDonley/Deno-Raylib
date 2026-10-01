// Port of raylib 6.0: examples/core/core_delta_time.c
import * as raylib from "raylib";

const ball = new raylib.Vector2(400, 225);
raylib.InitWindow(800, 450, "raylib [core] example - delta time");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  const delta = raylib.GetFrameTime();
  const speed = 200 * delta;
  if (raylib.IsKeyDown(raylib.KeyboardKey.RIGHT)) ball.x += speed;
  if (raylib.IsKeyDown(raylib.KeyboardKey.LEFT)) ball.x -= speed;
  if (raylib.IsKeyDown(raylib.KeyboardKey.UP)) ball.y -= speed;
  if (raylib.IsKeyDown(raylib.KeyboardKey.DOWN)) ball.y += speed;
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText("Move the ball with arrow keys", 10, 10, 20, raylib.DarkGray);
  raylib.DrawText(
    `Frame time: ${(delta * 1000).toFixed(2)} ms`,
    10,
    40,
    20,
    raylib.Gray,
  );
  raylib.DrawCircleV(ball, 30, raylib.Maroon);
  raylib.EndDrawing();
}
raylib.CloseWindow();
