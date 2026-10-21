// Refresh the vendored headers and parser output from an exact raylib release.
// deno-lint-ignore-file no-explicit-any
import { fromFileUrl } from "path/from-file-url";

const VERSION = "6.2";
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
  if (Deno.args.some((arg) => arg !== "--local")) {
    throw new Error("Only --local is supported");
  }
  for (const header of headers) {
    if (Deno.args.includes("--local")) continue;
    const response = await fetch(
      `https://raw.githubusercontent.com/raysan5/raylib/${VERSION}/src/${header}`,
    );
    if (!response.ok) {
      throw new Error(`Could not download ${header}: HTTP ${response.status}`);
    }
    // Normalize trailing whitespace without changing the upstream declarations.
    await Deno.writeTextFile(
      new URL(header, headersDir),
      (await response.text()).replace(/[\t ]+$/gm, ""),
    );
  }

  const parser = `${tempDir}/rlparser${
    Deno.build.os === "windows" ? ".exe" : ""
  }`;
  await run("cc", [fromFileUrl(parserSource), "-o", parser]);

  const parse = async (
    header: string,
    define: string,
    truncate?: string,
    input?: string,
  ) => {
    const output = `${tempDir}/${header.replace(".h", ".json")}`;
    const args = [
      "--input",
      input ?? fromFileUrl(new URL(header, headersDir)),
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

  // rgestures lacks RLAPI annotations and uses anonymous types. Parse those
  // declarations directly: rlparser does not support this header's grammar.
  const gestureHeader = await Deno.readTextFile(
    new URL("rgestures.h", headersDir),
  );
  const maxTouches = gestureHeader.match(/#define MAX_TOUCH_POINTS\s+(\d+)/)
    ?.[1];
  if (!maxTouches) throw new Error("Missing rgestures MAX_TOUCH_POINTS");
  const declarations = gestureHeader.split("RGESTURES IMPLEMENTATION")[0];
  const eventBody = declarations.match(
    /typedef struct \{([^}]+)\} GestureEvent;/,
  )?.[1];
  const actionBody = declarations.match(/typedef enum \{([^}]+)\} TouchAction;/)
    ?.[1];
  if (!eventBody || !actionBody) {
    throw new Error("rgestures type declarations changed");
  }
  const fields = [...eventBody.matchAll(/^\s*(\w+) (\w+)(?:\[(\w+)\])?;/gm)]
    .map(([, type, name, count]) => ({
      type: count
        ? `${type}[${count === "MAX_TOUCH_POINTS" ? maxTouches : count}]`
        : type,
      name,
    }));
  let actionValue = -1;
  const values = [
    ...actionBody.matchAll(/(TOUCH_ACTION_\w+)(?:\s*=\s*(\d+))?/g),
  ].map(([, name, value]) => ({
    name,
    value: value === undefined ? ++actionValue : (actionValue = Number(value)),
  }));
  const internalFunctions = [
    ...declarations.matchAll(
      /^void (ProcessGestureEvent|UpdateGestures)\(([^)]+)\);\s*\/\/\s*(.*)$/gm,
    ),
  ].map(([, name, params, description]) => ({
    name,
    description,
    returnType: "void",
    nativeOptional: true,
    ...(params === "void" ? {} : {
      params: params.split(",").map((param) => {
        const [type, name] = param.trim().split(/\s+/);
        return { type, name };
      }),
    }),
  }));
  if (
    fields.length !== 4 || values.length !== 4 || internalFunctions.length !== 2
  ) throw new Error("Unexpected rgestures declarations; review parser");
  const gestures = {
    structs: [{
      name: "GestureEvent",
      description: "Gesture input event",
      fields,
    }],
    enums: [{ name: "TouchAction", description: "Touch actions", values }],
    functions: internalFunctions,
  };
  sources.push(gestures);

  // rlparser cannot resolve conditional field declarations in rlVertexBuffer.
  // Official desktop 6.2 builds use unsigned-int indices.
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
