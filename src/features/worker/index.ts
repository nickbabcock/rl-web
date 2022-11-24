export { ReplayParserProvider } from "./ReplayParserContext";
export * from "./types";
export { type ParseInput } from "./engine";
export * from "./useReplayParser";

export const workerQueryOptions = Object.freeze({
  networkMode: "always",
  staleTime: Infinity,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const);
