// Port of raylib 6.0: examples/models/models_box_collisions.c
import * as raylib from "raylib";

const camera = new raylib.Camera3D({
  position: new raylib.Vector3(0, 10, 10),
  target: new raylib.Vector3(0, 1, 0),
  up: new raylib.Vector3(0, 1, 0),
  fovy: 45,
  projection: raylib.CameraProjection.PERSPECTIVE,
});
const player = new raylib.Vector3(0, 1, 2);
const enemyBox = new raylib.BoundingBox(
  new raylib.Vector3(-2, 0, -2),
  new raylib.Vector3(2, 2, 0),
);
raylib.InitWindow(800, 450, "raylib [models] example - box collisions");
raylib.SetTargetFPS(60);
while (!raylib.WindowShouldClose()) {
  if (raylib.IsKeyDown(raylib.KeyboardKey.RIGHT)) player.x += 0.2;
  if (raylib.IsKeyDown(raylib.KeyboardKey.LEFT)) player.x -= 0.2;
  if (raylib.IsKeyDown(raylib.KeyboardKey.DOWN)) player.z += 0.2;
  if (raylib.IsKeyDown(raylib.KeyboardKey.UP)) player.z -= 0.2;
  const playerBox = new raylib.BoundingBox(
    new raylib.Vector3(player.x - 0.5, player.y - 1, player.z - 0.5),
    new raylib.Vector3(player.x + 0.5, player.y + 1, player.z + 0.5),
  );
  const collision = raylib.CheckCollisionBoxes(playerBox, enemyBox);
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.BeginMode3D(camera);
  raylib.DrawCube(player, 1, 2, 1, collision ? raylib.Red : raylib.Green);
  raylib.DrawCubeWires(player, 1, 2, 1, raylib.DarkGreen);
  raylib.DrawCube(new raylib.Vector3(0, 1, -1), 4, 2, 2, raylib.Gray);
  raylib.DrawCubeWires(new raylib.Vector3(0, 1, -1), 4, 2, 2, raylib.DarkGray);
  raylib.DrawGrid(10, 1);
  raylib.EndMode3D();
  raylib.DrawText(
    collision ? "COLLISION" : "Move with arrow keys",
    10,
    40,
    20,
    collision ? raylib.Red : raylib.DarkGray,
  );
  raylib.DrawFPS(10, 10);
  raylib.EndDrawing();
}
raylib.CloseWindow();
