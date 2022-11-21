import { createPortal } from "react-dom";
import {
  DocumentFileDropProps,
  useDocumentFileDrop,
} from "./useDocumentFileDrop";
import classes from "./DropOverlay.module.css";
import { useEffect, useState } from "react";

export const DropOverlay = (props: DocumentFileDropProps) => {
  const { isHovering } = useDocumentFileDrop(props);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (hasMounted) {
    return createPortal(
      <div
        className={`absolute top-0 left-0 z-10 bg-transparent transition duration-200 ${
          isHovering &&
          `h-full w-full bg-gray-500/25 outline outline-blue-500/50 ${classes["overlay-outline"]}`
        }`}
      ></div>,
      document.body
    );
  } else {
    return null;
  }
};
