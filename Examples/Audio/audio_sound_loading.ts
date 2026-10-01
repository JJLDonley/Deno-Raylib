// Port of raylib 6.0: examples/audio/audio_sound_loading.c
import { fromFileUrl } from "path/from-file-url";
import * as raylib from "raylib";

const asset = fromFileUrl(new URL("../Resources/tone.wav", import.meta.url));
raylib.InitWindow(
  800,
  450,
  "raylib [audio] example - sound loading and playing",
);
raylib.InitAudioDevice();
const sound = raylib.LoadSound(asset);
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  if (raylib.IsKeyPressed(raylib.KeyboardKey.SPACE)) raylib.PlaySound(sound);
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText(
    "Press SPACE to play the CC0 tone",
    200,
    200,
    24,
    raylib.Maroon,
  );
  raylib.EndDrawing();
}

raylib.UnloadSound(sound);
raylib.CloseAudioDevice();
raylib.CloseWindow();
