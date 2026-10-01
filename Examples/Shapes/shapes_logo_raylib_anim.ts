// Port of raylib 6.0: examples/shapes/shapes_logo_raylib_anim.c
import * as raylib from "raylib";

raylib.InitWindow(800, 450, "raylib [shapes] example - raylib logo animation");
raylib.SetTargetFPS(60);
let frame = 0;

while (!raylib.WindowShouldClose()) {
  frame++;
  const progress = Math.min(1, frame / 180);
  const side = Math.trunc(16 + 240 * progress);
  const letters = Math.min(6, Math.trunc(Math.max(0, frame - 180) / 12));
  const alpha = frame > 400 ? Math.max(0, 1 - (frame - 400) / 60) : 1;
  if (raylib.IsKeyPressed(raylib.KeyboardKey.R)) frame = 0;
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  const ink = raylib.Fade(raylib.Black, alpha);
  raylib.DrawRectangle(272, 97, side, 16, ink);
  raylib.DrawRectangle(272, 97, 16, side, ink);
  raylib.DrawRectangle(272, 337, side, 16, ink);
  raylib.DrawRectangle(512, 97, 16, side, ink);
  if (frame >= 180) {
    raylib.DrawRectangle(
      288,
      113,
      224,
      224,
      raylib.Fade(raylib.RayWhite, alpha),
    );
    raylib.DrawText("raylib".slice(0, letters), 356, 225, 50, ink);
  }
  if (alpha === 0) raylib.DrawText("[R] REPLAY", 340, 200, 20, raylib.Gray);
  raylib.EndDrawing();
}
raylib.CloseWindow();
