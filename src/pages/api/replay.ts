import { instantiateParser } from "@/server/wasm";
import { getFileData } from "@/server/fileData";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const [fileData, parser] = await Promise.all([
    getFileData(req),
    instantiateParser(),
  ]);

  const input = new Uint8Array(fileData);
  let out = parser.parse(input);
  return new Response(JSON.stringify(out), {
    headers: {
      "content-type": "application/json",
    },
  });
}
