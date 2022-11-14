import { useEffect, useState } from "react";
import { downloadData } from "@/utils/downloadData";
import { useReplayParser } from "@/features/worker";
import { useReplay, useReplayData } from "@/features/replay";
import { logError } from "@/utils/logError";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const DownloadReplayJson = () => {
  const parser = useReplayParser();
  const { isWorking } = useReplayData();
  const { dispatch } = useReplay();
  const [prettyPrint, setPrettyPrint] = useState(false);

  const onClick = async () => {
    try {
      dispatch({ kind: "start-json" });
      const { name, data } = await parser().replayJson({
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
      <button
        className="btn dark:text-slate-700 bg-gray-50 active:bg-gray-200 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-blue-600 disabled:opacity-40 disabled:hover:border-blue-300 disabled:hover:bg-transparent"
        disabled={isWorking}
        onClick={onClick}
      >
        Convert Replay to JSON
      </button>
      <label>
        <input
          className="rounded mr-1 focus:outline focus:outline-2 focus:outline-blue-600"
          type="checkbox"
          checked={prettyPrint}
          onChange={(e) => togglePretty(e.target.checked)}
          disabled={isWorking}
        />
        Pretty print
      </label>
    </div>
  );
};
