// Port of raylib 6.0: examples/core/core_basic_window.c
import * as raylib from "../../Raylib/raylib.ts";

const screenWidth = 800;
const screenHeight = 450;

raylib.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [core] example - basic window",
);
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText(
    "Congrats! You created your first window!",
    190,
    200,
    20,
    raylib.LightGray,
  );
  raylib.EndDrawing();
}

raylib.CloseWindow();
