import { useState } from "react";
import { useDocumentFileDrop } from "./useDocumentFileDrop";
import classes from "./DropOverlay.module.css";

export const DropOverlay = () => {
  const [hover, setHover] = useState(false);
  useDocumentFileDrop({ setFileHover: setHover });

  return (
    <div
      className={`absolute top-0 left-0 bg-transparent transition z-10 ${
        hover &&
        `w-screen h-screen bg-gray-500/25 outline outline-blue-500/50 ${classes["overlay-outline"]}`
      }`}
    ></div>
  );
};
