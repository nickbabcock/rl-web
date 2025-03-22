import { ReplayParser } from "./ReplayParser";
import wasmPath from "../../../crate/pkg/rl_wasm_bg.wasm";
import init, * as wasmModule from "../../../crate/pkg/rl_wasm";
import { timeit } from "./timeit";
import { formatFloat } from "@/utils/format";
import { ReplayJsonOptions } from "./types";
import { transfer } from "comlink";

let parser: ReplayParser | null = null;
export type ParseInput = File | string;

function getParser() {
  if (parser == null) {
    throw new Error("assumed parser is defined");
  }
  return parser;
}

let wasmInitialized: Promise<wasmModule.InitOutput> | undefined = undefined;
async function initializeWasm() {
  if (wasmInitialized === undefined) {
    wasmInitialized = timeit(() => init({ module_or_path: wasmPath })).then(
      ([out, elapsedMs]) => {
        console.log(`initialized wasm: ${formatFloat(elapsedMs)}ms`);
        return out;
      },
    );
  }
  await wasmInitialized;
}

export async function initialize() {
  await initializeWasm();
  return (parser = new ReplayParser(wasmModule));
}

export async function parse(input: ParseInput) {
  const parser = await initialize();

  const buffer =
    typeof input == "string"
      ? fetch(input).then((x) => x.arrayBuffer())
      : input.arrayBuffer();

  const data = new Uint8Array(await buffer);
  const [out, elapsedMs] = await timeit(() => parser.parse(data));
  console.log(`parse replay: ${formatFloat(elapsedMs)}ms`);
  return out;
}

export async function replayJson(options: ReplayJsonOptions) {
  const [data, elapsedMs] = await timeit(() => getParser().replayJson(options));
  console.log(`replay json: ${formatFloat(elapsedMs)}ms`);
  return transfer({ data }, [data.buffer]);
}
