import { instantiateParser } from "@/server/wasm";
import { getFileData } from "@/server/fileData";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const pretty =
    url.searchParams.has("pretty") && url.searchParams.get("pretty") != "0";
  const [fileData, parser] = await Promise.all([
    getFileData(req),
    instantiateParser(),
  ]);

  const input = new Uint8Array(fileData);
  let _ = parser.parse(input);
  const out = parser.replayJson({ pretty });
  return new Response(out, {
    headers: {
      "content-type": "application/json",
    },
  });
}
