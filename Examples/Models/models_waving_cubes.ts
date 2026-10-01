// Port of raylib 6.0: examples/models/models_waving_cubes.c
import * as raylib from "raylib";

const camera = new raylib.Camera3D({
  position: new raylib.Vector3(30, 20, 30),
  target: new raylib.Vector3(0, 0, 0),
  up: new raylib.Vector3(0, 1, 0),
  fovy: 70,
  projection: raylib.CameraProjection.PERSPECTIVE,
});
raylib.InitWindow(800, 450, "raylib [models] example - waving cubes");
raylib.SetTargetFPS(60);
while (!raylib.WindowShouldClose()) {
  const time = raylib.GetTime();
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.BeginMode3D(camera);
  for (let x = 0; x < 15; x++) {
    for (let z = 0; z < 15; z++) {
      const y = Math.sin(time * 2 + x * 0.4 + z * 0.4) * 2;
      const position = new raylib.Vector3((x - 7) * 2, y, (z - 7) * 2);
      raylib.DrawCube(
        position,
        1.5,
        1.5,
        1.5,
        new raylib.Color(20 + x * 10, 80 + z * 8, 200, 255),
      );
      raylib.DrawCubeWires(
        position,
        1.5,
        1.5,
        1.5,
        raylib.Fade(raylib.Black, 0.2),
      );
    }
  }
  raylib.EndMode3D();
  raylib.DrawFPS(10, 10);
  raylib.EndDrawing();
}
raylib.CloseWindow();
