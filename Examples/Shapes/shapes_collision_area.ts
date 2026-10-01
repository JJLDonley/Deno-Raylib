// Port of raylib 6.0: examples/shapes/shapes_collision_area.c
import * as raylib from "raylib";

const screenWidth = 800;
const screenHeight = 450;
const boxA = new raylib.Rectangle(10, screenHeight / 2 - 50, 200, 100);
const boxB = new raylib.Rectangle(
  screenWidth / 2 - 30,
  screenHeight / 2 - 30,
  60,
  60,
);

raylib.InitWindow(
  screenWidth,
  screenHeight,
  "raylib [shapes] example - collision area",
);
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  boxA.width += 1;
  if (boxA.width >= screenWidth) boxA.width = 10;

  const collision = raylib.GetCollisionRec(boxA, boxB);
  const hasCollision = collision.width > 0 && collision.height > 0;

  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawRectangleRec(boxA, raylib.Gold);
  raylib.DrawRectangleRec(boxB, raylib.Blue);
  if (hasCollision) {
    raylib.DrawRectangleRec(collision, raylib.Lime);
    raylib.DrawText(
      "COLLISION!",
      screenWidth / 2 - 60,
      screenHeight / 2 - 10,
      20,
      raylib.Black,
    );
  }
  raylib.DrawText("Press ESC to exit", 10, 10, 20, raylib.DarkGray);
  raylib.EndDrawing();
}

raylib.CloseWindow();
