import { createPortal } from "react-dom";
import { useDocumentFileDrop } from "./useDocumentFileDrop";
import classes from "./DropOverlay.module.css";
import { useEffect, useState } from "react";

export const DropOverlay = () => {
  const { isHovering } = useDocumentFileDrop();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
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
