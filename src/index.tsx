import { render, h } from "preact";
import { ReplayParser } from "./core/ReplayParser";
import ReplayForm from "./ReplayForm";

let parser = new ReplayParser();

function newReplay(replay: File) {
  const reader = new FileReader();
  reader.onload = e => {
    if (reader.result && reader.result instanceof ArrayBuffer) {
      console.log(parser.parse(new Uint8Array(reader.result)));
    }
  };
  reader.readAsArrayBuffer(replay);
}

const rootElement = document.getElementById("app");
render(<ReplayForm newReplay={newReplay} />, rootElement);
