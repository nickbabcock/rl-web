import { useFilePublisher } from "./useFilePublisher";
import { DropOverlay } from "./DropOverlay";
import { useClientValue, useIsActionInFlight } from "@/hooks";
import { DocumentIcon } from "@/components/icons/DocumentIcon";
import { FileInput } from "@/components/FileInput";

export const ReplayInput = () => {
  const busyWorker = useIsActionInFlight();
  const { mutate } = useFilePublisher();
  const isDeveloper = useClientValue(
    () => !!localStorage.getItem("developer"),
    false,
  );

  return (
    <div className="mx-auto w-full max-w-prose flex-col space-y-1">
      <DropOverlay onFile={mutate} enabled={!busyWorker} />

      <FileInput disabled={busyWorker} onChange={mutate}>
        <DocumentIcon className="w-10" />
        <p>
          Drag and drop or{" "}
          <span className="font-bold text-sky-700 dark:text-sky-400">
            browse for a replay file
          </span>{" "}
          to analyze
        </p>
      </FileInput>
      <div className="text-center">
        No replay?{" "}
        <button
          className="link disabled:cursor-not-allowed"
          disabled={busyWorker}
          onClick={() => mutate("/sample.replay")}
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
