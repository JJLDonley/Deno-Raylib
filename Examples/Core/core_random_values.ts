// Port of raylib 6.0: examples/core/core_random_values.c
import * as raylib from "raylib";

raylib.InitWindow(800, 450, "raylib [core] example - generate random values");
raylib.SetTargetFPS(60);

let framesCounter = 0;
let randomValue = raylib.GetRandomValue(-8, 5);

while (!raylib.WindowShouldClose()) {
  framesCounter++;
  if (framesCounter >= 120) {
    framesCounter = 0;
    randomValue = raylib.GetRandomValue(-8, 5);
  }

  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText(
    "Every 2 seconds a new random value is generated:",
    130,
    100,
    20,
    raylib.Maroon,
  );
  raylib.DrawText(`${randomValue}`, 360, 180, 80, raylib.LightGray);
  raylib.EndDrawing();
}

raylib.CloseWindow();
