// Port of raylib 6.0: examples/shapes/shapes_bouncing_ball.c
import * as raylib from "../../Raylib/raylib.ts";

const screenWidth = 800;
const screenHeight = 450;
const ballPosition = new raylib.Vector2(screenWidth / 2, screenHeight / 2);
const ballSpeed = new raylib.Vector2(5, 4);
const ballRadius = 20;
let paused = false;
let framesCounter = 0;

raylib.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [shapes] example - bouncing ball",
);
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  if (raylib.IsKeyPressed(raylib.KeyboardKey.SPACE)) paused = !paused;

  if (!paused) {
    ballPosition.x += ballSpeed.x;
    ballPosition.y += ballSpeed.y;
    if (
      ballPosition.x >= screenWidth - ballRadius || ballPosition.x <= ballRadius
    ) ballSpeed.x *= -1;
    if (
      ballPosition.y >= screenHeight - ballRadius ||
      ballPosition.y <= ballRadius
    ) ballSpeed.y *= -1;
  } else {
    framesCounter++;
  }

  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawCircleV(ballPosition, ballRadius, raylib.Maroon);
  raylib.DrawText(
    "PRESS SPACE to PAUSE BALL MOVEMENT",
    10,
    screenHeight - 25,
    20,
    raylib.LightGray,
  );
  if (paused && Math.trunc(framesCounter / 30) % 2 === 0) {
    raylib.DrawText("PAUSED", 350, 200, 30, raylib.Gray);
  }
  raylib.DrawFPS(10, 10);
  raylib.EndDrawing();
}

raylib.CloseWindow();
