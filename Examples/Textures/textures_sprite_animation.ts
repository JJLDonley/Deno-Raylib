// Port of raylib 6.0: examples/textures/textures_sprite_animation.c
import { fromFileUrl } from "path/from-file-url";
import * as raylib from "raylib";

const asset = fromFileUrl(
  new URL("../Resources/sprite_sheet.bmp", import.meta.url),
);
raylib.InitWindow(800, 450, "raylib [textures] example - sprite animation");
const texture = raylib.LoadTexture(asset);
const frame = new raylib.Rectangle(0, 0, 64, 64);
let currentFrame = 0;
let framesCounter = 0;
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  if (++framesCounter >= 12) {
    framesCounter = 0;
    currentFrame = (currentFrame + 1) % 4;
    frame.x = currentFrame * 64;
  }
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawTexture(texture, 272, 80, raylib.Fade(raylib.White, 0.35));
  raylib.DrawTextureRec(
    texture,
    frame,
    new raylib.Vector2(368, 250),
    raylib.White,
  );
  raylib.DrawText(`FRAME ${currentFrame + 1}/4`, 330, 340, 20, raylib.DarkGray);
  raylib.EndDrawing();
}

raylib.UnloadTexture(texture);
raylib.CloseWindow();
