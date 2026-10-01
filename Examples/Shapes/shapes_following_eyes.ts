// Port of raylib 6.0: examples/shapes/shapes_following_eyes.c
import * as raylib from "raylib";

const eyes = [new raylib.Vector2(320, 220), new raylib.Vector2(480, 220)];
raylib.InitWindow(800, 450, "raylib [shapes] example - following eyes");
raylib.SetTargetFPS(60);
while (!raylib.WindowShouldClose()) {
  const mouse = raylib.GetMousePosition();
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  for (const eye of eyes) {
    const dx = mouse.x - eye.x;
    const dy = mouse.y - eye.y;
    const distance = Math.hypot(dx, dy) || 1;
    const ratio = Math.min(24, distance) / distance;
    const pupil = new raylib.Vector2(eye.x + dx * ratio, eye.y + dy * ratio);
    raylib.DrawCircleGradient(
      Math.trunc(eye.x),
      Math.trunc(eye.y),
      70,
      raylib.LightGray,
      raylib.Gray,
    );
    raylib.DrawCircleV(pupil, 24, raylib.Black);
    raylib.DrawCircleV(
      new raylib.Vector2(pupil.x - 7, pupil.y - 7),
      6,
      raylib.RayWhite,
    );
  }
  raylib.DrawText("Move the mouse around", 300, 360, 20, raylib.DarkGray);
  raylib.EndDrawing();
}
raylib.CloseWindow();
