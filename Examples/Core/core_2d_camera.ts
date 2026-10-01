// Port of raylib 6.0: examples/core/core_2d_camera.c
import * as raylib from "raylib";

const player = new raylib.Rectangle(400, 280, 40, 40);
const camera = new raylib.Camera2D({
  offset: new raylib.Vector2(400, 225),
  target: new raylib.Vector2(420, 300),
  rotation: 0,
  zoom: 1,
});
raylib.InitWindow(800, 450, "raylib [core] example - 2d camera");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  if (raylib.IsKeyDown(raylib.KeyboardKey.RIGHT)) player.x += 2;
  if (raylib.IsKeyDown(raylib.KeyboardKey.LEFT)) player.x -= 2;
  camera.target = new raylib.Vector2(player.x + 20, player.y + 20);
  if (raylib.IsKeyDown(raylib.KeyboardKey.A)) camera.rotation--;
  if (raylib.IsKeyDown(raylib.KeyboardKey.S)) camera.rotation++;
  camera.zoom = Math.max(
    0.1,
    Math.min(3, camera.zoom + raylib.GetMouseWheelMove() * 0.05),
  );
  if (raylib.IsKeyPressed(raylib.KeyboardKey.R)) {
    camera.zoom = 1;
    camera.rotation = 0;
  }
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.BeginMode2D(camera);
  raylib.DrawRectangle(-6000, 320, 13000, 8000, raylib.DarkGray);
  for (let x = -6000; x < 7000; x += 200) {
    raylib.DrawRectangle(x, 0, 100, 320, raylib.SkyBlue);
  }
  raylib.DrawRectangleRec(player, raylib.Red);
  raylib.DrawLine(
    Math.trunc(camera.target.x),
    -4500,
    Math.trunc(camera.target.x),
    4500,
    raylib.Green,
  );
  raylib.DrawLine(
    -8000,
    Math.trunc(camera.target.y),
    8000,
    Math.trunc(camera.target.y),
    raylib.Green,
  );
  raylib.EndMode2D();
  raylib.DrawText(
    "Right/Left: move  Wheel: zoom  A/S: rotate  R: reset",
    20,
    20,
    18,
    raylib.DarkGray,
  );
  raylib.EndDrawing();
}
raylib.CloseWindow();
