import React from "react";
import { ReplayParserContext } from "./ReplayParserContext";

export function useReplayParser() {
  const context = React.useContext(ReplayParserContext);
  if (context === undefined) {
    throw new Error(
      "useReplayParser must be used within a ReplayParserProvider"
    );
  }

  return React.useCallback(() => {
    if (context.current === undefined) {
      throw new Error("Replay parser is undefined");
    }
    return context.current.worker;
  }, [context]);
}
