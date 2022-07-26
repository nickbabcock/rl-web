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

  return (
    <div className="flex gap-4 mx-auto">
      <label
        className={`btn ${
          isWorking ? " saturate-50 " : ""
        } bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600 active:bg-blue-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-blue-600`}
        tabIndex={isWorking ? -1 : 0}
        onKeyUp={keyboardTrigger(labelFocus)}
      >
        Select file
        <input
          ref={fileInputRef}
          type="file"
          disabled={isWorking}
          hidden
          onChange={handleChange}
          accept=".replay"
        />
      </label>
      <button
        className="btn dark:text-slate-700 bg-gray-50 active:bg-gray-200 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-blue-600 disabled:opacity-40 disabled:hover:border-blue-300 disabled:hover:bg-transparent"
        onClick={loadSample}
      >
        Load sample replay
      </button>
    </div>
  );
};
