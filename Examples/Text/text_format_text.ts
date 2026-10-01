// Port inspired by raylib's text formatting examples.
import * as raylib from "../../Raylib/raylib.ts";

raylib.InitWindow(800, 450, "raylib [text] example - text formatting");
raylib.SetTargetFPS(60);

let score = 100020;
let hiscore = 200450;
let lives = 5;

while (!raylib.WindowShouldClose()) {
  if (raylib.IsKeyPressed(raylib.KeyboardKey.SPACE)) {
    score += 100;
    hiscore = Math.max(hiscore, score);
    lives = Math.max(0, lives - 1);
  }

  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText(`Score: ${score}`, 200, 80, 20, raylib.Red);
  raylib.DrawText(`HiScore: ${hiscore}`, 200, 120, 20, raylib.Green);
  raylib.DrawText(`Lives: ${lives}`, 200, 160, 40, raylib.Blue);
  raylib.DrawText(
    "Press SPACE to update the values",
    200,
    240,
    20,
    raylib.DarkGray,
  );
  raylib.EndDrawing();
}

raylib.CloseWindow();
