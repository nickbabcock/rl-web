import { useRef, KeyboardEvent } from "react";
import { useFilePublisher } from "./useFilePublisher";
import sampleReplay from "../../../dev/sample.replay";
import { DropOverlay } from "./DropOverlay";
import { useIsActionInFlight } from "@/hooks";

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
  const busyWorker = useIsActionInFlight();
  const { mutate } = useFilePublisher();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      mutate(e.currentTarget.files[0]);
    }
  };

  const labelFocus = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mx-auto flex gap-4">
      <DropOverlay onFile={mutate} enabled={!busyWorker} />

      <label
        className={`btn ${
          busyWorker ? " saturate-50 " : ""
        } border-2 border-blue-500 bg-blue-600 text-white hover:border-blue-400 hover:bg-blue-500 focus-visible:outline-blue-600 active:bg-blue-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-blue-600`}
        tabIndex={busyWorker ? -1 : 0}
        onKeyUp={keyboardTrigger(labelFocus)}
      >
        Select file
        <input
          ref={fileInputRef}
          type="file"
          disabled={busyWorker}
          hidden
          onChange={handleChange}
          accept=".replay"
        />
      </label>
      <button
        className="btn border-2 border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-blue-600 active:bg-gray-200 disabled:opacity-40 disabled:hover:border-blue-300 disabled:hover:bg-transparent dark:text-slate-700"
        onClick={() => mutate(sampleReplay)}
      >
        View sample
      </button>
    </div>
  );
};
