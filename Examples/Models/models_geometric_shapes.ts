// Port of raylib 6.0: examples/models/models_geometric_shapes.c
import * as raylib from "raylib";

const camera = new raylib.Camera3D({
  position: new raylib.Vector3(0, 10, 10),
  target: new raylib.Vector3(0, 0, 0),
  up: new raylib.Vector3(0, 1, 0),
  fovy: 45,
  projection: raylib.CameraProjection.PERSPECTIVE,
});

raylib.InitWindow(800, 450, "raylib [models] example - geometric shapes");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.UpdateCamera(camera, raylib.CameraMode.ORBITAL);

  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.BeginMode3D(camera);
  raylib.DrawCube(new raylib.Vector3(-4, 0, 2), 2, 5, 2, raylib.Red);
  raylib.DrawCubeWires(new raylib.Vector3(-4, 0, 2), 2, 5, 2, raylib.Gold);
  raylib.DrawSphere(new raylib.Vector3(-1, 0, -2), 1, raylib.Green);
  raylib.DrawSphereWires(new raylib.Vector3(1, 0, 2), 2, 16, 16, raylib.Lime);
  raylib.DrawCylinder(new raylib.Vector3(4, 0, -2), 1, 2, 3, 4, raylib.SkyBlue);
  raylib.DrawCylinderWires(
    new raylib.Vector3(4.5, -1, 2),
    1,
    1,
    2,
    6,
    raylib.Brown,
  );
  raylib.DrawGrid(10, 1);
  raylib.EndMode3D();
  raylib.DrawFPS(10, 10);
  raylib.EndDrawing();
}

raylib.CloseWindow();
