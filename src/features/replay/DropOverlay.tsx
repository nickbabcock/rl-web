import { createPortal } from "react-dom";
import { FileDropProps, useFileDrop } from "@/hooks";
import classes from "./DropOverlay.module.css";
import { useIsClient } from "@/hooks";

export const DropHighlight = (props: FileDropProps) => {
  const { isHovering } = useFileDrop(props);
  return (
    <div
      className={`absolute top-0 left-0 z-10 outline-blue-500/50 transition-all duration-200 ${
        isHovering
          ? `h-full w-full bg-blue-500/25 outline-solid ${classes["overlay-outline"]}`
          : "bg-transparent"
      }`}
    ></div>
  );
};

export const DropOverlay = (props: FileDropProps) => {
  const isClient = useIsClient();
  if (isClient) {
    return createPortal(<DropHighlight {...props} />, document.body);
  } else {
    return null;
  }
};
