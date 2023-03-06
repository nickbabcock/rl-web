import { ParseMode } from "@/stores/uiStore";
import { create } from "zustand";
import { ParsedReplay, ParseInput, Replay } from "../worker";

class ReplayInput {
  constructor(public readonly input: ParseInput) {}
  path = () => {
    if (typeof this.input === "string") {
      return this.input;
    } else {
      return this.input.name;
    }
  };

  name = () => {
    const path = this.path();
    return path.slice(path.lastIndexOf("/") + 1);
  };

  jsonName = () => this.name().replace(".replay", ".json");
}

interface ParseRequest {
  input: ParseInput;
}

interface ParseArg {
  input: ReplayInput;
}

type ParseResult =
  | {
      kind: "success";
    }
  | {
      kind: "error";
      error: unknown;
    };

type ParseState = { kind: "initial" } | (ParseArg & ParseResult);

export interface ReplayYield extends ParseArg {
  data: Replay;
  networkErr: string | null;
  mode: ParseMode;
}

interface ReplayStore {
  latest: ParseState;
  parsed: ReplayYield | null;
  actions: {
    parseError: (error: unknown, req: ParseRequest) => void;
    parsed: (data: ParsedReplay, mode: ParseMode, req: ParseRequest) => void;
  };
}

const useReplayStore = create<ReplayStore>()((set) => ({
  latest: { kind: "initial" },
  parsed: null,
  actions: {
    parseError: (error, { input }) =>
      set(() => ({
        latest: { kind: "error", error, input: new ReplayInput(input) },
      })),
    parsed: ({ replay, ...rest }, mode, { input }) => {
      set(() => ({
        latest: { kind: "success", input: new ReplayInput(input) },
        parsed: { data: replay, ...rest, mode, input: new ReplayInput(input) },
      }));
    },
  },
}));

export const useReplayActions = () => useReplayStore((state) => state.actions);
export const useParsedReplay = () => useReplayStore((state) => state.parsed);
export const useLatestParse = () => useReplayStore((state) => state.latest);
