// Port of raylib 6.0: examples/models/models_loading.c
import { fromFileUrl } from "path/from-file-url";
import * as raylib from "raylib";

const asset = fromFileUrl(new URL("../Resources/pyramid.obj", import.meta.url));
const camera = new raylib.Camera3D({
  position: new raylib.Vector3(4, 3, 4),
  target: new raylib.Vector3(0, 1, 0),
  up: new raylib.Vector3(0, 1, 0),
  fovy: 45,
  projection: raylib.CameraProjection.PERSPECTIVE,
});
raylib.InitWindow(800, 450, "raylib [models] example - model loading");
const model = raylib.LoadModel(asset);
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.UpdateCamera(camera, raylib.CameraMode.ORBITAL);
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.BeginMode3D(camera);
  raylib.DrawModel(model, new raylib.Vector3(0, 0, 0), 1, raylib.White);
  raylib.DrawGrid(10, 1);
  raylib.EndMode3D();
  raylib.DrawText("Original CC0 OBJ + MTL asset", 10, 40, 20, raylib.DarkGray);
  raylib.DrawFPS(10, 10);
  raylib.EndDrawing();
}

raylib.UnloadModel(model);
raylib.CloseWindow();
