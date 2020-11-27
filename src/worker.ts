import { ReplayParser } from "./core/ReplayParser";
import { ReplayFile } from "./core/Models";
import { WorkerRequest, WorkerResponse } from "./core/Messaging";
import init, * as wasmMod from "../crate/pkg/rl_wasm";

interface LoadedReplay {
  name: string;
  data: Uint8Array;
}

let parser: ReplayParser | null = null;
let loadedReplay: LoadedReplay | null = null;

onmessage = async ({ data }: { data: WorkerRequest }) => {
  try {
    switch (data.kind) {
      case "LOAD":
        const wasmPath = require("../crate/pkg/rl_wasm_bg.wasm").default as string;
        await init(wasmPath);
        parser = new ReplayParser(wasmMod);
        sendMessage({ kind: "SUCCESS" });
        break;
      case "PRETTY_PRINT":
        if (loadedReplay) {
          parseReplay(loadedReplay, data.pretty);
        }
        break;
      case "NEW_FILE":
        if (data.file instanceof File) {
          await loadReplayFile(data.file, data.pretty);
        } else {
          await fetchReplayLoad(data.file, data.pretty);
        }
        break;
      case "PARSE_NETWORK":
        parseNetwork(data.pretty);
        break;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : err;
    sendMessage({ kind: "FAILED", msg });
  }
};

function sendMessage(msg: WorkerResponse, transfer?: Transferable[]) {
  // @ts-ignore
  postMessage(msg, transfer);
}

async function fetchReplayLoad(path: string, pretty: boolean) {
  let response = await fetch(path);
  let data = new Uint8Array(await response.arrayBuffer());
  parseReplay({ name: "sample", data }, pretty);
}

function parseReplay(loaded: LoadedReplay, pretty: boolean) {
  if (!parser) {
    throw Error("expected parser to be initialized before parsing");
  }

  const t0 = performance.now();
  const fn = pretty ? parser.parse_pretty : parser.parse;
  let replay = fn(loaded.data);
  const t1 = performance.now();

  let res: ReplayFile = {
    ...replay,
    name: loaded.name,
    parseMs: t1 - t0,
  };

  loadedReplay = loaded;
  sendMessage({ kind: "PARSED", replay: res });
}

async function loadReplayFile(file: File, pretty: boolean) {
  let data = await new Response(file)
    .arrayBuffer()
    .then((x) => new Uint8Array(x));
  parseReplay({ name: file.name, data }, pretty);
}

function parseNetwork(pretty: boolean) {
  if (loadedReplay && parser) {
    const t0 = performance.now();
    const replay = pretty
      ? parser.parse_network_pretty(loadedReplay.data)
      : parser.parse_network(loadedReplay.data);
    const t1 = performance.now();
    console.log(`${t1 - t0}ms`);
    sendMessage({ kind: "PARSED_NETWORK", buffer: replay.buffer }, [
      replay.buffer,
    ]);
  }
}
