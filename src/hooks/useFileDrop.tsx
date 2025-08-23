import { useIsomorphicLayoutEffect } from "@/hooks";
import { RefObject, useEffect, useRef, useState } from "react";

function containsFiles(e: DragEvent): boolean {
  const arr = e.dataTransfer?.items;
  return arr?.length === 1 && arr[0].kind === "file";
}

export interface FileDropProps {
  onFile: (file: File) => void | Promise<void>;
  enabled?: boolean;
  target?: RefObject<HTMLElement | null>;
}

export function useFileDrop({ onFile, enabled = true, target }: FileDropProps) {
  const [isHovering, setHovering] = useState(false);

  // keep count of drags: https://stackoverflow.com/a/21002544/433785
  const dragCount = useRef(0);

  // Latest ref pattern for props. This way we don't need to add and remove
  // event listeners every time one of them changes.
  const enabledRef = useRef(enabled);
  const onFileRef = useRef(onFile);
  useIsomorphicLayoutEffect(() => {
    enabledRef.current = enabled;
    onFileRef.current = (file: File) => {
      try {
        onFile(file);
      } finally {
        dragCount.current = 0;
      }
    };
  });

  useEffect(() => {
    if (target?.current === null) {
      return;
    }
    const elem = target ? target.current : document;

    function dragDrop(e: Event) {
      if (!(e instanceof DragEvent)) {
        return;
      }

      if (!enabledRef.current || !containsFiles(e)) {
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

        onFileRef.current(file);
      } else if (e.dataTransfer && e.dataTransfer.files) {
        const files = e.dataTransfer.files;
        if (files.length !== 1) {
          throw Error("unexpected one file drop");
        }

        onFileRef.current(files[0]);
      } else {
        throw Error("unexpected data transfer");
      }
    }

    function highlight(e: Event) {
      if (!(e instanceof DragEvent)) {
        return;
      }

      if (enabledRef.current && containsFiles(e)) {
        dragCount.current += 1;
        e.preventDefault();
        e.stopPropagation();
        setHovering(true);
      }
    }

    function unhighlight(e: Event) {
      if (!(e instanceof DragEvent)) {
        return;
      }

      if (enabledRef.current && containsFiles(e)) {
        dragCount.current -= 1;
        e.preventDefault();
        e.stopPropagation();
        setHovering(dragCount.current !== 0);
      }
    }

    // If you want to allow a drop, you must prevent the default handling by
    // cancelling both the dragenter and dragover events
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#specifying_drop_targets
    function dragover(e: Event) {
      e.preventDefault();
    }

    elem.addEventListener("drop", dragDrop, { capture: true });
    elem.addEventListener("dragenter", highlight, false);
    elem.addEventListener("dragleave", unhighlight, false);
    elem.addEventListener("dragover", dragover, false);

    return () => {
      elem.removeEventListener("drop", dragDrop, { capture: true });
      elem.removeEventListener("dragenter", highlight, false);
      elem.removeEventListener("dragleave", unhighlight, false);
      elem.removeEventListener("dragover", dragover, false);
    };
  }, [target]);

  return { isHovering };
}
