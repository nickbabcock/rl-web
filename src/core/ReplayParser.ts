import { Replay } from "./Models";
// @ts-ignore
import rl from "../../crate/Cargo.toml";

export class ReplayParser {
  parse(data: Uint8Array): Replay {
    let response = JSON.parse(rl.parse_replay(data));
    if (response && response.error) {
      throw new Error(response.error);
    }

    return response as Replay;
  }
}
