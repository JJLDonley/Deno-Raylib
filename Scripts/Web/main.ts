import { Application, Drawing, Shapes, Text, Timing, Window } from "raylib/Web";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

await Application.Init({
  canvas,
  moduleUrl: new URL("./backend.mjs", import.meta.url),
});

Window.InitWindow(800, 450, "Deno Raylib Web");
Timing.SetTargetFPS(60);

const background = new Drawing.Color(245, 245, 245, 255);
const accent = new Drawing.Color(230, 41, 55, 255);
const foreground = new Drawing.Color(30, 30, 30, 255);

await Application.Run({
  draw() {
    Drawing.BeginDrawing();
    Drawing.ClearBackground(background);
    Text.DrawText("Hello from Deno Raylib!", 24, 24, 28, foreground);
    Shapes.DrawCircle(400, 240, 64, accent);
    Drawing.EndDrawing();
  },
});
