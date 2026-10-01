// Resource-backed animated texture-wave shader example.
import { fromFileUrl } from "path/from-file-url";
import * as raylib from "raylib";

const vertex = fromFileUrl(new URL("../Resources/basic.vs", import.meta.url));
const fragment = fromFileUrl(new URL("../Resources/waves.fs", import.meta.url));
const bitmap = fromFileUrl(
  new URL("../Resources/checker.bmp", import.meta.url),
);
raylib.InitWindow(800, 450, "raylib [shaders] example - texture waves");
const shader = raylib.LoadShader(vertex, fragment);
const texture = raylib.LoadTexture(bitmap);
const timeLocation = raylib.GetShaderLocation(shader, "time");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  const time = new Float32Array([raylib.GetTime()]);
  raylib.SetShaderValue(
    shader,
    timeLocation,
    new Uint8Array(time.buffer),
    raylib.ShaderUniformDataType.FLOAT,
  );
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.BeginShaderMode(shader);
  raylib.DrawTextureEx(
    texture,
    new raylib.Vector2(272, 97),
    0,
    2,
    raylib.White,
  );
  raylib.EndShaderMode();
  raylib.DrawText(
    "Animated shader uniform + CC0 bitmap",
    205,
    380,
    20,
    raylib.DarkGray,
  );
  raylib.EndDrawing();
}

raylib.UnloadTexture(texture);
raylib.UnloadShader(shader);
raylib.CloseWindow();
