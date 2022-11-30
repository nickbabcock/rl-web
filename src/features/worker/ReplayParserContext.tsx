import React, { MutableRefObject, useEffect } from "react";
import { Remote, wrap, releaseProxy } from "comlink";
import { WasmWorker } from "./worker";

export type ReplayParserClient = Remote<WasmWorker>;

interface ReplayParserState {
  rawWorker: Worker;
  worker: ReplayParserClient;
}

type ContextState = MutableRefObject<ReplayParserState | undefined>;

export const ReplayParserContext = React.createContext<
  ContextState | undefined
>(undefined);
interface ReplayParserProviderProps {
  children: React.ReactNode;
}

export const ReplayParserProvider = ({
  children,
}: ReplayParserProviderProps) => {
  const workerRef = React.useRef<ReplayParserState>();

  useEffect(() => {
    const rawWorker = new Worker(new URL("./worker.ts", import.meta.url));
    const worker = wrap<WasmWorker>(rawWorker);
    workerRef.current = {
      worker,
      rawWorker,
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.worker[releaseProxy]();
        workerRef.current.rawWorker.terminate();
        workerRef.current = undefined;
      }
    };
  }, []);

  return (
    <ReplayParserContext.Provider value={workerRef}>
      {children}
    </ReplayParserContext.Provider>
  );
};
