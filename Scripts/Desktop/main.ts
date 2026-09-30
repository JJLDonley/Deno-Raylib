import * as raylib from "raylib";

raylib.InitWindow(800, 450, "Deno Raylib Desktop");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RayWhite);
  raylib.DrawText("Hello from Deno Raylib!", 24, 24, 28, raylib.Black);
  raylib.DrawCircle(400, 240, 64, raylib.Red);
  raylib.EndDrawing();
}

raylib.CloseWindow();
