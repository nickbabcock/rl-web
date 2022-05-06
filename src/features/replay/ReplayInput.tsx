import { useRef, KeyboardEvent } from "react";
import { useReplayData } from "./replay-provider";
import { useFilePublisher } from "./useFilePublisher";
import sampleReplay from "../../../dev/sample.replay";

export function keyboardTrigger(fn: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.isPropagationStopped()) {
      e.stopPropagation();
      fn();
    }
  };
}

export const ReplayInput = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const publishFile = useFilePublisher();
  const { isWorking } = useReplayData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      publishFile(e.currentTarget.files[0]);
    }
  };

  const labelFocus = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const loadSample = () => {
    publishFile(sampleReplay);
  };

  const labelClazz = `btn${isWorking ? " disabled" : ""}`;
  return (
    <div className="grid gap">
      <div>
        Drag and drop a replay file onto this page or{" "}
        <label
          className={labelClazz}
          tabIndex={isWorking ? -1 : 0}
          onKeyUp={keyboardTrigger(labelFocus)}
        >
          select file
          <input
            ref={fileInputRef}
            type="file"
            disabled={isWorking}
            hidden
            onChange={handleChange}
            accept=".replay"
          />
        </label>
      </div>
      <button onClick={loadSample}>Load sample replay</button>

      <style jsx>{`
        label {
          background-color: rgb(0, 120, 231);
          vertical-align: baseline;
          color: #fff;
        }

        .disabled {
          filter: saturate(20%);
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: max-content auto;
          }
        }

        button {
          margin-inline-end: auto;
        }
      `}</style>
    </div>
  );
};
