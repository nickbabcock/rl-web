import { useEffect, useState } from "react";
import { downloadData } from "@/utils/downloadData";
import { useReplayParser } from "@/features/worker";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  inputAtom,
  jsonNameAtom,
  parsedRawNameAtom,
  successModeAtom,
  useIsWorkerBusy,
} from "../replay/useFilePublisher";
import { useAtomValue } from "jotai";
import { parsingModeAtom } from "@/components/ParsingToggle";

export const DownloadReplayJson = () => {
  const parser = useReplayParser();
  const [prettyPrint, setPrettyPrint] = useState(false);
  const workerBusy = useIsWorkerBusy();
  const currentMode = useAtomValue(parsingModeAtom);
  const successMode = useAtomValue(successModeAtom);
  const rawName = useAtomValue(parsedRawNameAtom);
  const jsonName = useAtomValue(jsonNameAtom);
  const input = useAtomValue(inputAtom);

  const { refetch: workerQuery } = useQuery({
    queryKey: ["json", prettyPrint, currentMode, rawName],
    queryFn: async () => {
      if (rawName === undefined || jsonName === undefined) {
        throw new Error("expected raw and json name to be defined");
      }

      const { data } = await parser().replayJson({
        pretty: prettyPrint,
      });
      downloadData(data, jsonName);
      return null;
    },
    networkMode: currentMode === "local" ? "always" : "online",
    enabled: false,
    cacheTime: 0,
    staleTime: Infinity,
  });

  const { mutate: edgeQuery } = useMutation({
    mutationFn: async () => {
      if (
        input === undefined ||
        rawName === undefined ||
        jsonName === undefined
      ) {
        throw new Error("expected raw and json name to be defined");
      }

      const params = new URLSearchParams({
        pretty: prettyPrint.toString(),
      });
      console.log(input);
      const form = new FormData();
      form.append("file", input);

      const resp = await fetch(`/api/json?${params}`, {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        throw new Error("edge runtime unable to return json");
      }
      downloadData(await resp.arrayBuffer(), jsonName);
      return null;
    },
    networkMode: currentMode === "local" ? "always" : "online",
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
        className="btn border-2 border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-blue-600 active:bg-gray-200 disabled:opacity-40 disabled:hover:border-blue-300 disabled:hover:bg-transparent dark:text-slate-700"
        disabled={workerBusy || successMode != currentMode}
        onClick={() => (currentMode === "local" ? workerQuery() : edgeQuery())}
      >
        Convert Replay to JSON
      </button>
      <label>
        <input
          className="mr-1 rounded focus:outline focus:outline-2 focus:outline-blue-600"
          type="checkbox"
          checked={prettyPrint}
          onChange={(e) => togglePretty(e.target.checked)}
          disabled={workerBusy || successMode != currentMode}
        />
        Pretty print
      </label>
    </div>
  );
};
