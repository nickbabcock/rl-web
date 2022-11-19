import wasmModule from "../../crate/pkg/rl_wasm_bg.wasm?module";
import { ReplayParser } from "@/features/worker/ReplayParser";
import init, * as RlMod from "../../crate/pkg/rl_wasm";

export async function instantiateParser() {
  await init(wasmModule);
  return new ReplayParser(RlMod);
}
