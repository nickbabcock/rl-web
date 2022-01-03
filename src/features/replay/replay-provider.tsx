import React, { MutableRefObject, useEffect } from "react";
import { Replay } from "@/features/worker";

interface ReplayState {
  replay: Replay | undefined;
  isWorking: boolean;
  networkErr: string | null;
  criticalErr: string | null;
}

type Action =
  | { kind: "start-parsing" }
  | { kind: "parsed-replay"; replay: Replay; networkErr: string | null }
  | { kind: "parse-failed"; error: string }
  | { kind: "start-json" }
  | { kind: "finish-json" }
  | { kind: "json-failed"; error: string };

type Dispatch = (action: Action) => void;

function replayReducer(state: ReplayState, action: Action): ReplayState {
  switch (action.kind) {
    case "start-parsing": {
      return {
        ...state,
        criticalErr: null,
        isWorking: true,
      };
    }
    case "parsed-replay": {
      return {
        ...state,
        replay: action.replay,
        networkErr: action.networkErr,
        isWorking: false,
      };
    }
    case "json-failed":
    case "parse-failed": {
      return {
        ...state,
        replay: undefined,
        networkErr: null,
        criticalErr: action.error,
        isWorking: false,
      };
    }
    case "start-json": {
      return {
        ...state,
        isWorking: true,
      };
    }
    case "finish-json": {
      return {
        ...state,
        isWorking: false,
      };
    }
  }
}

type ContextState = {
  dispatch: Dispatch;
  state: ReplayState;
};

const ReplayContext = React.createContext<ContextState | undefined>(undefined);

export const ReplayProvider: React.FC<{}> = ({ children }) => {
  const [state, dispatch] = React.useReducer(replayReducer, {
    replay: undefined,
    isWorking: false,
    networkErr: null,
    criticalErr: null,
  });

  return (
    <ReplayContext.Provider value={{ state, dispatch }}>
      {children}
    </ReplayContext.Provider>
  );
};

export function useReplay() {
  const context = React.useContext(ReplayContext);
  if (context === undefined) {
    throw new Error("useReplay must be used within a ReplayProvider");
  }
  return context;
}

export function useReplayData() {
  return useReplay().state;
}
