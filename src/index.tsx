import { render, h } from "preact";
import { ReplayParser } from "./core/ReplayParser";
import App from "./components/App";

let parser = new ReplayParser();
const mainElement = document.getElementById("main")!;
const appElement = document.getElementById("app")!;

function newReplay(replay: File) {
  const reader = new FileReader();
  reader.onload = e => {
    if (reader.result && reader.result instanceof ArrayBuffer) {
      let replay = parser.parse(new Uint8Array(reader.result));
      render(
        <App newReplay={newReplay} replay={replay} />,
        mainElement,
        appElement
      );
    }
  };
  reader.readAsArrayBuffer(replay);
}

render(<App newReplay={newReplay} />, mainElement, appElement);
