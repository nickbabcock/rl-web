import { useEffect, useRef } from "react";
import { useFilePublisher } from "./useFilePublisher";

// ref: https://css-tricks.com/snippets/javascript/test-if-dragenterdragover-event-contains-files/
function containsFiles(e: DragEvent): boolean {
  for (let i = 0; i < (e.dataTransfer?.types.length ?? 0); i++) {
    if (e.dataTransfer?.types[i] == "Files") {
      return true;
    }
  }
  return false;
}

interface DropProps {
  setFileHover: (hover: boolean) => void;
}

export function useDocumentFileDrop({ setFileHover }: DropProps) {
  const publishFile = useFilePublisher();

  // keep count of drags: https://stackoverflow.com/a/21002544/433785
  const dragCount = useRef(0);

  useEffect(() => {
    function dragDrop(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      setFileHover(false);

      if (e.dataTransfer && e.dataTransfer.items) {
        const items = e.dataTransfer.items;
        if (items.length !== 1) {
          throw Error("unexpected one file drop");
        }
        const file = items[0].getAsFile();
        if (file === null) {
          throw Error("bad dropped file");
        }

        publishFile(file);
      } else if (e.dataTransfer && e.dataTransfer.files) {
        const files = e.dataTransfer.files;
        if (files.length !== 1) {
          throw Error("unexpected one file drop");
        }

        publishFile(files[0]);
      } else {
        throw Error("unexpected data transfer");
      }
    }

    function highlight(e: DragEvent) {
      if (containsFiles(e)) {
        dragCount.current += 1;
        e.preventDefault();
        e.stopPropagation();
        setFileHover(true);
      }
    }

    function unhighlight(e: DragEvent) {
      if (containsFiles(e)) {
        dragCount.current -= 1;
        e.preventDefault();
        e.stopPropagation();
        if (dragCount.current === 0) {
          setFileHover(false);
        }
      }
    }

    // If you want to allow a drop, you must prevent the default handling by
    // cancelling both the dragenter and dragover events
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#specifying_drop_targets
    function dragover(e: DragEvent) {
      e.preventDefault();
    }

    document.addEventListener("drop", dragDrop, { capture: true });
    document.addEventListener("dragenter", highlight, false);
    document.addEventListener("dragleave", unhighlight, false);
    document.addEventListener("dragover", dragover, false);

    return () => {
      document.removeEventListener("drop", dragDrop, { capture: true });
      document.removeEventListener("dragenter", highlight, false);
      document.removeEventListener("dragleave", unhighlight, false);
      document.removeEventListener("dragover", dragover, false);
    };
  }, [setFileHover, publishFile]);
}
