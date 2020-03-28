import { h, Component } from "preact";
import { publishFile } from "../injector";

export default class LoadSample extends Component<{}, {}> {
  sampleClick = (event: Event) => {
    publishFile("/sample.replay");
  };

  render() {
    return <button onClick={this.sampleClick}>Load Sample Replay</button>;
  }
}
