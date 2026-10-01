// Generates the original CC0 bitmap and audio assets used by the examples.

const directory = new URL("./", import.meta.url);

function bmp(
  width: number,
  height: number,
  pixel: (x: number, y: number) => [number, number, number],
): Uint8Array {
  const stride = Math.ceil(width * 3 / 4) * 4;
  const dataOffset = 54;
  const output = new Uint8Array(dataOffset + stride * height);
  const view = new DataView(output.buffer);
  output.set([0x42, 0x4d]);
  view.setUint32(2, output.length, true);
  view.setUint32(10, dataOffset, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, stride * height, true);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixel(x, height - 1 - y);
      const offset = dataOffset + y * stride + x * 3;
      output[offset] = b;
      output[offset + 1] = g;
      output[offset + 2] = r;
    }
  }
  return output;
}

function wav(): Uint8Array {
  const sampleRate = 44100;
  const seconds = 4;
  const samples = sampleRate * seconds;
  const output = new Uint8Array(44 + samples * 2);
  const view = new DataView(output.buffer);
  output.set(new TextEncoder().encode("RIFF"), 0);
  view.setUint32(4, output.length - 8, true);
  output.set(new TextEncoder().encode("WAVEfmt "), 8);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  output.set(new TextEncoder().encode("data"), 36);
  view.setUint32(40, samples * 2, true);
  const notes = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 261.63];
  for (let i = 0; i < samples; i++) {
    const local = i % (sampleRate / 2);
    const fade = Math.min(1, local / 400) *
      Math.min(1, (sampleRate / 2 - local) / 1200);
    const frequency = notes[Math.floor(i / (sampleRate / 2)) % notes.length];
    const value = Math.sin(2 * Math.PI * frequency * i / sampleRate) * fade *
      0.3;
    view.setInt16(44 + i * 2, Math.trunc(value * 32767), true);
  }
  return output;
}

await Deno.writeFile(
  new URL("checker.bmp", directory),
  bmp(128, 128, (x, y) => {
    const light = (Math.floor(x / 16) + Math.floor(y / 16)) % 2 === 0;
    return light ? [245, 203, 66] : [49, 87, 140];
  }),
);

await Deno.writeFile(
  new URL("sprite_sheet.bmp", directory),
  bmp(256, 64, (x, y) => {
    const frame = Math.floor(x / 64);
    const localX = x % 64;
    const palette: Array<[number, number, number]> = [
      [230, 41, 55],
      [0, 158, 47],
      [0, 121, 241],
      [200, 122, 255],
    ];
    if (localX < 10 || localX > 53 || y < 8 || y > 57) return [245, 245, 245];
    if (
      (localX > 20 && localX < 27 || localX > 37 && localX < 44) && y > 20 &&
      y < 28
    ) return [20, 20, 20];
    if (localX > 23 && localX < 41 && y > 40 && y < 45) return [255, 255, 255];
    return palette[frame];
  }),
);

await Deno.writeFile(new URL("tone.wav", directory), wav());
console.log("Generated checker.bmp, sprite_sheet.bmp, and tone.wav");
