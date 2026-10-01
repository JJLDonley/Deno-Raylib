// Port of raylib 6.0: examples/text/text_input_box.c
import * as raylib from "raylib";

const box = new raylib.Rectangle(200, 180, 400, 50);
let name = "";
raylib.InitWindow(800, 450, "raylib [text] example - input box");
raylib.SetTargetFPS(60);
while (!raylib.WindowShouldClose()) {
  const active = raylib.CheckCollisionPointRec(raylib.GetMousePosition(), box);
  if (active) {
    let key = raylib.GetCharPressed();
    while (key.charCodeAt(0) > 0) {
      const code = key.charCodeAt(0);
      if (code >= 32 && code <= 125 && name.length < 31) name += key;
      key = raylib.GetCharPressed();
    }
    if (raylib.IsKeyPressed(raylib.KeyboardKey.BACKSPACE)) {
      name = name.slice(0, -1);
    }
  }
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText("PLACE MOUSE OVER INPUT BOX!", 240, 140, 20, raylib.Gray);
  raylib.DrawRectangleRec(box, raylib.LightGray);
  raylib.DrawRectangleLinesEx(box, 2, active ? raylib.Red : raylib.DarkGray);
  raylib.DrawText(name, 210, 192, 20, raylib.Maroon);
  raylib.DrawText(
    `INPUT CHARS: ${name.length}/31`,
    315,
    250,
    20,
    raylib.DarkGray,
  );
  raylib.EndDrawing();
}
raylib.CloseWindow();
