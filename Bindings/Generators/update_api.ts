// Refresh the vendored headers and parser output from an exact raylib release.
// deno-lint-ignore-file no-explicit-any

const VERSION = "6.0";
const headers = [
  "raylib.h",
  "raymath.h",
  "rcamera.h",
  "rlgl.h",
  "rgestures.h",
] as const;

const generatorDir = new URL("./", import.meta.url);
const headersDir = new URL("../Headers/", generatorDir);
const parserSource = new URL("./rlparser.c", generatorDir);
const tempDir = await Deno.makeTempDir({ prefix: "deno-raylib-api-" });

async function run(command: string, args: string[]) {
  const output = await new Deno.Command(command, { args }).output();
  if (!output.success) {
    throw new Error(
      `${command} failed: ${new TextDecoder().decode(output.stderr)}`,
    );
  }
}

try {
  for (const header of headers) {
    const response = await fetch(
      `https://raw.githubusercontent.com/raysan5/raylib/${VERSION}/src/${header}`,
    );
    if (!response.ok) {
      throw new Error(`Could not download ${header}: HTTP ${response.status}`);
    }
    await Deno.writeFile(
      new URL(header, headersDir),
      new Uint8Array(await response.arrayBuffer()),
    );
  }

  const parser = `${tempDir}/rlparser`;
  await run("cc", [parserSource.pathname, "-o", parser]);

  const parse = async (
    header: string,
    define: string,
    truncate?: string,
  ) => {
    const output = `${tempDir}/${header.replace(".h", ".json")}`;
    const args = [
      "--input",
      new URL(header, headersDir).pathname,
      "--output",
      output,
      "--format",
      "JSON",
      "--define",
      define,
    ];
    if (truncate) args.push("--truncate", truncate);
    await run(parser, args);
    return JSON.parse(await Deno.readTextFile(output));
  };

  const sources = [
    await parse("raylib.h", "RLAPI"),
    await parse("raymath.h", "RMAPI", "RAYMATH IMPLEMENTATION"),
    await parse("rcamera.h", "RLAPI", "CAMERA IMPLEMENTATION"),
    await parse("rlgl.h", "RLAPI", "RLGL IMPLEMENTATION"),
  ];

  // rlparser cannot resolve conditional field declarations in rlVertexBuffer.
  // Official desktop 6.0 builds use unsigned-int indices.
  const rlVertexBuffer = sources[3].structs.find(
    (value: any) => value.name === "rlVertexBuffer",
  );
  rlVertexBuffer.fields = [
    { type: "int", name: "elementCount", description: "Number of elements" },
    { type: "float *", name: "vertices", description: "Vertex positions" },
    { type: "float *", name: "texcoords", description: "Texture coordinates" },
    { type: "float *", name: "normals", description: "Vertex normals" },
    { type: "unsigned char *", name: "colors", description: "Vertex colors" },
    { type: "unsigned int *", name: "indices", description: "Vertex indices" },
    { type: "unsigned int", name: "vaoId", description: "Vertex array id" },
    {
      type: "unsigned int[5]",
      name: "vboId",
      description: "Vertex buffer ids",
    },
  ];

  const mergeByName = (key: string) => {
    const values = sources.flatMap((source) => source[key] ?? []);
    return [
      ...new Map(values.map((value: any) => [value.name, value])).values(),
    ];
  };

  const api = {
    defines: mergeByName("defines"),
    structs: mergeByName("structs"),
    aliases: mergeByName("aliases"),
    enums: mergeByName("enums"),
    callbacks: mergeByName("callbacks"),
    functions: mergeByName("functions"),
  };

  await Deno.writeTextFile(
    new URL("./raylib_api.json", generatorDir),
    `${JSON.stringify(api, null, 2)}\n`,
  );
  console.log(
    `Updated raylib ${VERSION}: ${api.functions.length} functions, ${api.structs.length} structs`,
  );
} finally {
  await Deno.remove(tempDir, { recursive: true });
}
