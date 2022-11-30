import { createPortal } from "react-dom";
import {
  DocumentFileDropProps,
  useDocumentFileDrop,
} from "./useDocumentFileDrop";
import classes from "./DropOverlay.module.css";
import { useIsClient } from "@/hooks";

export const DropHighlight = (props: DocumentFileDropProps) => {
  const { isHovering } = useDocumentFileDrop(props);
  return (
    <div
      className={`absolute top-0 left-0 z-10 bg-transparent transition duration-200 ${
        isHovering &&
        `h-full w-full bg-gray-500/25 outline outline-blue-500/50 ${classes["overlay-outline"]}`
      }`}
    ></div>
  );
};

export const DropOverlay = (props: DocumentFileDropProps) => {
  const isClient = useIsClient();
  if (isClient) {
    return createPortal(<DropHighlight {...props} />, document.body);
  } else {
    return null;
  }
};
