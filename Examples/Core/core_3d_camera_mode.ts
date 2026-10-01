// Port of raylib 6.0: examples/core/core_3d_camera_mode.c
import * as raylib from "raylib";

const camera = new raylib.Camera3D({
  position: new raylib.Vector3(0, 10, 10),
  target: new raylib.Vector3(0, 0, 0),
  up: new raylib.Vector3(0, 1, 0),
  fovy: 45,
  projection: raylib.CameraProjection.PERSPECTIVE,
});
const cubePosition = new raylib.Vector3(0, 0, 0);

raylib.InitWindow(800, 450, "raylib [core] example - 3d camera mode");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.UpdateCamera(camera, raylib.CameraMode.ORBITAL);

  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.BeginMode3D(camera);
  raylib.DrawCube(cubePosition, 2, 2, 2, raylib.Red);
  raylib.DrawCubeWires(cubePosition, 2, 2, 2, raylib.Maroon);
  raylib.DrawGrid(10, 1);
  raylib.EndMode3D();
  raylib.DrawText(
    "Welcome to the third dimension!",
    10,
    40,
    20,
    raylib.DarkGray,
  );
  raylib.DrawFPS(10, 10);
  raylib.EndDrawing();
}

raylib.CloseWindow();
