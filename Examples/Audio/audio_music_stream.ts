// Port of raylib 6.0: examples/audio/audio_music_stream.c
import { fromFileUrl } from "path/from-file-url";
import * as raylib from "raylib";

const asset = fromFileUrl(new URL("../Resources/tone.wav", import.meta.url));
raylib.InitWindow(800, 450, "raylib [audio] example - music stream");
raylib.InitAudioDevice();
const music = raylib.LoadMusicStream(asset);
raylib.PlayMusicStream(music);
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.UpdateMusicStream(music);
  const length = raylib.GetMusicTimeLength(music);
  const played = raylib.GetMusicTimePlayed(music);
  const progress = length > 0 ? played / length : 0;
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText("Streaming a CC0 WAV asset", 250, 170, 24, raylib.DarkGray);
  raylib.DrawRectangle(150, 230, 500, 24, raylib.LightGray);
  raylib.DrawRectangle(150, 230, Math.trunc(500 * progress), 24, raylib.Maroon);
  raylib.EndDrawing();
}

raylib.UnloadMusicStream(music);
raylib.CloseAudioDevice();
raylib.CloseWindow();
