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

const dragHoverElement = document.getElementById("drag-hover")!;
function dragDrop(ev: DragEvent) {
  ev.preventDefault();
  dragHoverElement.style.display = "none";

  if (ev.dataTransfer && ev.dataTransfer.items) {
    const items = ev.dataTransfer.items;
    if (items.length !== 1) {
      throw Error("unexpected one file drop");
    }
    const file = items[0].getAsFile();
    if (file === null) {
      throw Error("bad dropped file");
    }

    newReplay(file);
  } else if (ev.dataTransfer && ev.dataTransfer.files) {
    const files = ev.dataTransfer.files;
    if (files.length !== 1) {
      throw Error("unexpected one file drop");
    }
    newReplay(files[0]);
  } else {
    throw Error("unexpected data transfer");
  }
}

function dragOverHandler(ev: Event) {
  ev.preventDefault();
  dragHoverElement.style.display = "inherit";
}

function dragLeaveHandler() {
  dragHoverElement.style.display = "none";
}

document.addEventListener("drop", dragDrop, false);
document.addEventListener("dragover", dragOverHandler, false);
document.addEventListener("dragleave", dragLeaveHandler, false);

render(<App newReplay={newReplay} />, mainElement, appElement);
