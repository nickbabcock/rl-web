import { Replay } from './Models';

export class ReplayParser {
  private rl: typeof import("../../crate/pkg/rl_wasm") | null;
  get isLoaded(): boolean {
    return this.rl !== null;
  }

  async load() {
    this.rl = await import("../../crate/pkg/rl_wasm");
  }

  parse(data: Uint8Array): Replay {
    if (!this.isLoaded) {
      throw new Error("Rocket league replay parser wasm bundle has not yet loaded");
    }

    let parser = this.rl!;
    let response = JSON.parse(parser.parse_replay(data));
    if (response && response.error) {
        throw new Error(response.error);
    }

    return response as Replay;
  }
}
