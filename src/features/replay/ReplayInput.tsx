import { useRef, KeyboardEvent } from "react";
import { useFilePublisher } from "./useFilePublisher";
import sampleReplay from "../../../dev/sample.replay";
import { DropOverlay } from "./DropOverlay";
import { useIsActionInFlight } from "@/hooks";
import { DocumentIcon } from "@/components/icons/DocumentIcon";
import { useState } from "react";
import { useEffect } from "react";

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
  const [isDeveloper, setIsDeveloper] = useState(false);

  useEffect(() => {
    setIsDeveloper(!!localStorage.getItem("developer"));
  }, []);

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
    <div className="mx-auto w-full max-w-prose flex-col space-y-1">
      <DropOverlay onFile={mutate} enabled={!busyWorker} />

      <label
        className={`${
          busyWorker ? "cursor-not-allowed saturate-0 " : "cursor-pointer"
        } flex items-center gap-1 rounded-md border-2 border-dashed border-slate-600 bg-slate-200 p-4 hover:bg-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 hover:dark:bg-slate-800`}
        tabIndex={busyWorker ? -1 : 0}
        onKeyUp={keyboardTrigger(labelFocus)}
      >
        <DocumentIcon className="w-10" />
        <p>
          Drag and drop or{" "}
          <span className="font-bold text-sky-700 dark:text-sky-400">
            browse for a replay file
          </span>{" "}
          to analyze
        </p>
        <input
          ref={fileInputRef}
          type="file"
          disabled={busyWorker}
          hidden
          onChange={handleChange}
          accept=".replay"
        />
      </label>
      <div className="text-center">
        No replay?{" "}
        <button
          className="link disabled:cursor-not-allowed"
          disabled={busyWorker}
          onClick={() => mutate(sampleReplay)}
        >
          View sample
        </button>
        {isDeveloper ? (
          <span>
            . Or{" "}
            <button
              className="link disabled:cursor-not-allowed"
              onClick={() => mutate("SERVER_SAMPLE")}
            >
              view sample on server
            </button>
          </span>
        ) : null}
      </div>
    </div>
  );
};
