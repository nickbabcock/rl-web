import { UseMutateFunction } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// ref: https://css-tricks.com/snippets/javascript/test-if-dragenterdragover-event-contains-files/
function containsFiles(e: DragEvent): boolean {
  for (let i = 0; i < (e.dataTransfer?.types.length ?? 0); i++) {
    if (e.dataTransfer?.types[i] == "Files") {
      return true;
    }
  }
  return false;
}

export interface DocumentFileDropProps {
  onFile: UseMutateFunction<unknown, unknown, File | any>;
  enabled: boolean;
}

export function useDocumentFileDrop({
  onFile,
  enabled,
}: DocumentFileDropProps) {
  const [isHovering, setHovering] = useState(false);

  // Latest ref pattern for props. This way we don't need to add and remove
  // event listeners every time one of them changes.
  const enabledRef = useRef(enabled);
  const onFileRef = useRef(onFile);
  useLayoutEffect(() => {
    enabledRef.current = enabled;
    onFileRef.current = onFile;
  });

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

        onFileRef.current(file, resetDragCount);
      } else if (e.dataTransfer && e.dataTransfer.files) {
        const files = e.dataTransfer.files;
        if (files.length !== 1) {
          throw Error("unexpected one file drop");
        }

        onFileRef.current(files[0], resetDragCount);
      } else {
        throw Error("unexpected data transfer");
      }
    }

    function highlight(e: DragEvent) {
      if (!enabledRef.current && containsFiles(e)) {
        dragCount.current += 1;
        e.preventDefault();
        e.stopPropagation();
        setHovering(true);
      }
    }

    function unhighlight(e: DragEvent) {
      if (!enabledRef.current && containsFiles(e)) {
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
  }, []);

  return { isHovering };
}
