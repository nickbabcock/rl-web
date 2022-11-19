import { useEffect, useRef, useState } from "react";
import { useFilePublisher, useIsWorkerBusy } from "./useFilePublisher";

// ref: https://css-tricks.com/snippets/javascript/test-if-dragenterdragover-event-contains-files/
function containsFiles(e: DragEvent): boolean {
  for (let i = 0; i < (e.dataTransfer?.types.length ?? 0); i++) {
    if (e.dataTransfer?.types[i] == "Files") {
      return true;
    }
  }
  return false;
}

export function useDocumentFileDrop() {
  const [isHovering, setHovering] = useState(false);
  const { mutate } = useFilePublisher();
  const busyWorker = useIsWorkerBusy();

  // So we don't need to add and remove event listeners every time the loading
  // state changes.
  const loadingRef = useRef(busyWorker);
  useEffect(() => {
    loadingRef.current = busyWorker;
  }, [busyWorker]);

  // keep count of drags: https://stackoverflow.com/a/21002544/433785
  const dragCount = useRef(0);

  useEffect(() => {
    const resetDragCount = {
      onSettled() {
        dragCount.current = 0;
      },
    };

    function dragDrop(e: DragEvent) {
      if (!containsFiles(e)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      setHovering(false);

      if (e.dataTransfer && e.dataTransfer.items) {
        const items = e.dataTransfer.items;
        if (items.length !== 1) {
          throw Error("unexpected one file drop");
        }
        const file = items[0].getAsFile();
        if (file === null) {
          throw Error("bad dropped file");
        }

        mutate(file, resetDragCount);
      } else if (e.dataTransfer && e.dataTransfer.files) {
        const files = e.dataTransfer.files;
        if (files.length !== 1) {
          throw Error("unexpected one file drop");
        }

        mutate(files[0], resetDragCount);
      } else {
        throw Error("unexpected data transfer");
      }
    }

    function highlight(e: DragEvent) {
      if (!loadingRef.current && containsFiles(e)) {
        dragCount.current += 1;
        e.preventDefault();
        e.stopPropagation();
        setHovering(true);
      }
    }

    function unhighlight(e: DragEvent) {
      if (!loadingRef.current && containsFiles(e)) {
        dragCount.current -= 1;
        e.preventDefault();
        e.stopPropagation();
        setHovering(dragCount.current !== 0);
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
  }, [mutate]);

  return { isHovering };
}
