import { Replay, ParsedReplay, ReplayJsonOptions } from "./types";
import * as wasmModule from "../../../crate/pkg/rl_wasm";
type RLMod = typeof wasmModule;

// The parser assumes that the wasm bundle has been fetched and compiled before
// any of these functions are executed
export class ReplayParser {
  private mod: RLMod;
  private replay: wasmModule.Replay | undefined;
  constructor(mod: RLMod) {
    this.mod = mod;
  }

  public parse(data: Uint8Array): ParsedReplay {
    this.replay = this.mod.parse(data);

    return {
      replay: JSON.parse(this.replay.header_json(false)) as Replay,
      networkErr: this.replay.network_err() ?? null,
    };
  }

  public replayJson({ pretty }: ReplayJsonOptions): Uint8Array<ArrayBuffer> {
    if (this.replay === undefined) {
      throw new Error("replay must be defined");
    }

    // wasm-bindgen copies the data into a new array that is not shared, but it
    // declares the more general ArrayBufferLike buffer type.
    return this.replay.full_json(pretty) as Uint8Array<ArrayBuffer>;
  }
}
