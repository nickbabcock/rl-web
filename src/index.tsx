import { render, h } from "preact";
import { publishFile } from "./injector";
import App from "./components/App";

const appElement = document.getElementById("app")!;
const dragHoverElement = document.getElementById("drag-hover")!;

function dragDrop(ev: DragEvent) {
  ev.preventDefault();
  dragHoverElement.classList.add("hidden");

  if (ev.dataTransfer && ev.dataTransfer.items) {
    const items = ev.dataTransfer.items;
    if (items.length !== 1) {
      throw Error("unexpected one file drop");
    }
    const file = items[0].getAsFile();
    if (file === null) {
      throw Error("bad dropped file");
    }

    publishFile(file);
  } else if (ev.dataTransfer && ev.dataTransfer.files) {
    const files = ev.dataTransfer.files;
    if (files.length !== 1) {
      throw Error("unexpected one file drop");
    }

    publishFile(files[0]);
  } else {
    throw Error("unexpected data transfer");
  }
}

function dragOverHandler(ev: Event) {
  ev.preventDefault();
  dragHoverElement.classList.remove("hidden");
}

function dragLeaveHandler() {
  dragHoverElement.classList.add("hidden");
}

document.addEventListener("drop", dragDrop, false);
document.addEventListener("dragover", dragOverHandler, false);
document.addEventListener("dragleave", dragLeaveHandler, false);

render(<App />, appElement);
