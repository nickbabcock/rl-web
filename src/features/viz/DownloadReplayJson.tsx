import { useEffect, useState } from "react";
import { downloadData } from "@/utils/downloadData";
import { useReplayParser, workerQueryOptions } from "@/features/worker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParseMode } from "@/stores/uiStore";
import { useIsActionInFlight } from "@/hooks";
import { ReplayYield } from "../replay/replayStore";

interface DownloadReplayJsonProps {
  replay: ReplayYield;
}

export const DownloadReplayJson = ({ replay }: DownloadReplayJsonProps) => {
  const parser = useReplayParser();
  const [prettyPrint, setPrettyPrint] = useState(false);
  const workerBusy = useIsActionInFlight();
  const currentMode = useParseMode();

  const workerQuery = useQuery({
    queryKey: ["json", prettyPrint, replay.input.path()],
    ...workerQueryOptions,
    queryFn: async () => {
      const { data } = await parser().replayJson({ pretty: prettyPrint });
      downloadData(data, replay.input.jsonName());

      // I don't want this large data cached
      return null;
    },
    cacheTime: 0,
    enabled: false,
  });

  const edgeQuery = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams({
        pretty: prettyPrint.toString(),
      });
      const form = new FormData();
      form.append("file", replay.input.input);

      const resp = await fetch(`/api/json?${params}`, {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        throw new Error("edge runtime unable to return json");
      }
      downloadData(await resp.arrayBuffer(), replay.input.jsonName());
      return null;
    },
    cacheTime: 0,
  });

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
        className="btn border-2 border-gray-300 bg-gray-50 focus-visible:outline-blue-600 active:bg-gray-200 enabled:hover:border-blue-400 enabled:hover:bg-blue-50 disabled:opacity-40 dark:text-slate-700"
        disabled={workerBusy || replay.mode != currentMode}
        onClick={() => {
          currentMode === "local" ? workerQuery.refetch() : edgeQuery.mutate();
        }}
      >
        Convert Replay to JSON
      </button>
      <label>
        <input
          className="mr-1 rounded focus:outline focus:outline-2 focus:outline-blue-600"
          type="checkbox"
          checked={prettyPrint}
          onChange={(e) => togglePretty(e.target.checked)}
          disabled={workerBusy || replay.mode != currentMode}
        />
        Pretty print
      </label>
    </div>
  );
};
