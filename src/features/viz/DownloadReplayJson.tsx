import { useEffect, useState } from "react";
import { downloadData } from "@/utils/downloadData";
import { useReplayParser } from "@/features/worker";
import { useReplay, useReplayData } from "@/features/replay";
import { logError } from "@/utils/logError";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const DownloadReplayJson = () => {
  const worker = useReplayParser();
  const { isWorking } = useReplayData();
  const { dispatch } = useReplay();
  const [prettyPrint, setPrettyPrint] = useState(false);

  const onClick = async () => {
    if (!worker.current) {
      throw new Error("worker must be defined");
    }

    try {
      dispatch({ kind: "start-json" });
      const { name, data } = await worker.current.worker.replayJson({
        pretty: prettyPrint,
      });
      downloadData(data, name);
      dispatch({ kind: "finish-json" });
    } catch (ex) {
      logError(ex);
      dispatch({ kind: "json-failed", error: getErrorMessage(ex) });
    }
  };

  const togglePretty = (pretty: boolean) => {
    localStorage.setItem("pretty-print", JSON.stringify(pretty));
    setPrettyPrint(pretty);
  };

  useEffect(() => {
    const doPretty = JSON.parse(
      localStorage.getItem("pretty-print") ?? "false"
    );
    setPrettyPrint(doPretty);
  }, []);

  return (
    <div className="grid place-items-center">
      <button disabled={isWorking} onClick={onClick}>
        Convert Replay to JSON
      </button>
      <label>
        <input
          type="checkbox"
          checked={prettyPrint}
          onChange={(e) => togglePretty(e.target.checked)}
          disabled={isWorking}
        />
        Pretty print
      </label>
      <style jsx>{`
        input {
          margin-inline-end: 0.3rem;
        }
      `}</style>
    </div>
  );
};
