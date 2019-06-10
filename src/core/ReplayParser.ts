import { Replay, DecodedReplay } from "./Models";

interface RlModule {
  parse_replay_network: (arg0: Uint8Array) => string;
  parse_replay_header: (arg0: Uint8Array) => string;
  parse_replay_network_pretty: (arg0: Uint8Array) => string;
  parse_replay_header_pretty: (arg0: Uint8Array) => string;
}

export class ReplayParser {
  rl: RlModule;
  constructor(rl: RlModule) {
    this.rl = rl;
  }

  _parse(data: Uint8Array, fn: (arg0: Uint8Array) => string) {
    const raw = fn(data);
    const response = JSON.parse(raw);
    if (response && response.error) {
      throw new Error(response.error);
    }

    return {
      raw,
      replay: response as Replay
    };
  }

  _parse_network(data: Uint8Array, fn: (arg0: Uint8Array) => string) {
    let response = fn(data);
    if (response.length < 2048) {
      let json = JSON.parse(response);
      if (json && json.error) {
        throw new Error(json.error);
      }
    }

    return response;
  }

  parse = (data: Uint8Array): DecodedReplay =>
    this._parse(data, this.rl.parse_replay_header);
  parse_pretty = (data: Uint8Array): DecodedReplay =>
    this._parse(data, this.rl.parse_replay_header_pretty);
  parse_network = (data: Uint8Array): string =>
    this._parse_network(data, this.rl.parse_replay_network);
  parse_network_pretty = (data: Uint8Array): string =>
    this._parse_network(data, this.rl.parse_replay_network_pretty);
}
