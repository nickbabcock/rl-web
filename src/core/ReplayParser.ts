import { Replay, DecodedReplay } from "./Models";

interface RlModule {
  parse_replay: (arg0: Uint8Array) => string;
  parse_network_replay: (arg0: Uint8Array) => string;
}

export class ReplayParser {
  rl: RlModule;
  constructor(rl: RlModule) {
    this.rl = rl;
  }

  parse(data: Uint8Array): DecodedReplay {
    const raw = this.rl.parse_replay(data);
    const response = JSON.parse(raw);
    if (response && response.error) {
      throw new Error(response.error);
    }

    return {
      raw,
      replay: response as Replay
    };
  }

  parse_network(data: Uint8Array): string {
    let response = this.rl.parse_network_replay(data);
    if (response.length < 2048) {
      let json = JSON.parse(response);
      if (json && json.error) {
        throw new Error(json.error);
      }
    }

    return response;
  }
}
