import fs from "fs/promises";
import { ReplayParser } from "@/features/worker/ReplayParser";
import init, * as RlMod from "../../../crate/pkg/rl_wasm";
import { NextApiRequest, NextApiResponse } from "next";
import { Jomini } from "jomini";
import path from "path";

async function compileWasm() {
  // https://vercel.com/docs/concepts/functions/serverless-functions/runtimes#including-additional-files
  const file = path.join(process.cwd(), "crate", "pkg", "rl_wasm_bg.wasm");
  const data = await fs.readFile(file);
  return WebAssembly.compile(data);
}

const wasmInit = init(compileWasm());

async function initJomini() {
  //@ts-ignore
  const filePath = __non_webpack_require__.resolve("jomini/jomini.wasm");
  const data = await fs.readFile(filePath);
  const wasm = await WebAssembly.compile(data);
  return Jomini.initialize({ wasm });
}

const getJomini = initJomini();

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  await wasmInit;
  const jomini = await getJomini;
  jomini.parseText("hello=world");

  const parser = new ReplayParser(RlMod);
  const file = path.join(process.cwd(), "dev", "sample.replay");
  const fileData = await fs.readFile(file);
  const input = new Uint8Array(fileData);
  const out = parser.parse(input);
  res.status(200).json(out);
}
