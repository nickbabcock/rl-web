import { Replay, DecodedReplay } from "./Models";
import {
  parse_replay_header,
  parse_replay_network,
  parse_replay_header_pretty,
  parse_replay_network_pretty
} from "../../crate/pkg/rl_wasm";

// The parser assumes that the wasm bundle has been fetched and compiled before
// any of these functions are executed
export class ReplayParser {
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
    this._parse(data, parse_replay_header);
  parse_pretty = (data: Uint8Array): DecodedReplay =>
    this._parse(data, parse_replay_header_pretty);
  parse_network = (data: Uint8Array): Uint8Array =>
    this._parse_network(data, parse_replay_network);
  parse_network_pretty = (data: Uint8Array): Uint8Array =>
    this._parse_network(data, parse_replay_network_pretty);
}
