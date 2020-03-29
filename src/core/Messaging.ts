import { ReplayFile } from "./Models";

interface Load {
  kind: "LOAD";
}

interface PrettyPrint {
  kind: "PRETTY_PRINT";
  pretty: boolean;
}

interface NewFile {
  kind: "NEW_FILE";
  file: File | string;
  pretty: boolean;
}

interface ParseNetwork {
  kind: "PARSE_NETWORK";
  pretty: boolean;
}

export type WorkerRequest = Load | PrettyPrint | NewFile | ParseNetwork;

interface Success {
  kind: "SUCCESS";
}

interface Failed {
  kind: "FAILED";
  msg: string;
}

interface Parsed {
  kind: "PARSED";
  replay: ReplayFile;
}

interface ParsedNetwork {
  kind: "PARSED_NETWORK";
  buffer: Uint8Array;
}

export type WorkerResponse = Success | Failed | Parsed | ParsedNetwork;
