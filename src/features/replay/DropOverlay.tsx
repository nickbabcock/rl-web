import { useState } from "react";
import { useDocumentFileDrop } from "./useDocumentFileDrop";

export const DropOverlay: React.FC<{}> = () => {
  const [hover, setHover] = useState(false);
  useDocumentFileDrop({ setFileHover: setHover });

  return (
    <div className={hover ? "hover" : undefined}>
      <style jsx>{`
        div {
          position: absolute;
          top: 0;
          left: 0;
          background-color: transparent;
          z-index: 100;
        }

        .hover {
          background-color: rgba(var(--secondary-light), 0.5);
          outline: rgb(var(--secondary-light)) solid 2em;
          outline-offset: -2em;
          width: 100vw;
          height: 100vh;
        }
      `}</style>
    </div>
  );
};
