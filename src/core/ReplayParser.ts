import { Replay, DecodedReplay } from "./Models";
import * as rl_mod from "../../crate/pkg/rl_wasm";
type RLMod = typeof rl_mod;

// The parser assumes that the wasm bundle has been fetched and compiled before
// any of these functions are executed
export class ReplayParser {
    mod: RLMod;
    constructor(mod: RLMod) {
        this.mod = mod;
    }

  _parse(data: Uint8Array, fn: (arg0: Uint8Array) => string) {
    const raw = fn(data);
    const response = JSON.parse(raw);

    return {
      raw,
      replay: response as Replay
    };
  }

  _parse_network(data: Uint8Array, fn: (arg0: Uint8Array) => Uint8Array) {
    return fn(data);
  }

  parse = (data: Uint8Array): DecodedReplay =>
    this._parse(data, this.mod.parse_replay_header);
  parse_pretty = (data: Uint8Array): DecodedReplay =>
    this._parse(data, this.mod.parse_replay_header_pretty);
  parse_network = (data: Uint8Array): Uint8Array =>
    this._parse_network(data, this.mod.parse_replay_network);
  parse_network_pretty = (data: Uint8Array): Uint8Array =>
    this._parse_network(data, this.mod.parse_replay_network_pretty);
}
