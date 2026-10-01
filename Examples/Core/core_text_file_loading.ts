// Port of raylib 6.0: examples/core/core_text_file_loading.c
import { fromFileUrl } from "path/from-file-url";
import * as raylib from "raylib";

const asset = fromFileUrl(new URL("../Resources/message.txt", import.meta.url));
const message = raylib.LoadFileText(asset);
raylib.InitWindow(800, 450, "raylib [core] example - text file loading");
raylib.SetTargetFPS(60);
while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText(
    "Text loaded through raylib's file API:",
    40,
    60,
    24,
    raylib.Maroon,
  );
  message.split("\n").forEach((line, index) =>
    raylib.DrawText(line, 40, 120 + index * 30, 20, raylib.DarkGray)
  );
  raylib.EndDrawing();
}
raylib.CloseWindow();
