import fs from "fs/promises";
import { ReplayParser } from "@/features/worker/ReplayParser";
import init, * as RlMod from "../../../crate/pkg/rl_wasm";
import { NextApiRequest, NextApiResponse } from "next";
import wasmPath from "../../../crate/pkg/rl_wasm_bg.wasm";
import samplePath from "../../../dev/sample.replay";

async function compileWasm() {
  const data = await fs.readFile(`./.next/${wasmPath}`);
  return WebAssembly.compile(data);
}

const wasmInit = init(compileWasm());

const prefix = process.env.NODE_ENV === "production" ? "chunks/" : "";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  await wasmInit;
  const parser = new ReplayParser(RlMod);
  const fileData = await fs.readFile(`./.next/server/${prefix}${samplePath}`);
  const input = new Uint8Array(fileData);
  const out = parser.parse(input);
  res.status(200).json(out);
}
