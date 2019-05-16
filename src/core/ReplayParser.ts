import { Replay, DecodedReplay } from "./Models";
// @ts-ignore
import rl from "../../crate/Cargo.toml";

export class ReplayParser {
  parse(data: Uint8Array): DecodedReplay {
    const raw = rl.parse_replay(data);
    const response = JSON.parse(raw);
    if (response && response.error) {
      throw new Error(response.error);
    }

    return {
        raw,
        replay: response as Replay,
    }
  }
}
