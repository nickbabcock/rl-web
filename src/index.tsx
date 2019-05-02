import * as React from "react";
import { hydrate, render } from "react-dom";
import { ReplayParser } from "./core/ReplayParser";
import ReplayForm from "./ReplayForm";
import "./styles.css";

let parser = new ReplayParser();
parser.load();

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
let app = <ReplayForm newReplay={newReplay} />;
if (rootElement && rootElement.hasChildNodes()) {
  hydrate(app, rootElement);
} else {
  render(app, rootElement);
}
