import { ReplayParser } from "./core/ReplayParser";
import { ReplayFile } from "./core/Models";
import { WorkerRequest, WorkerResponse } from "./core/Messaging";

interface LoadedReplay {
  name: string;
  data: Uint8Array;
}

let parser: ReplayParser | null = null;
let loadedReplay: LoadedReplay | null = null;

onmessage = async (e) => {
  const action = e.data as WorkerRequest;
  try {
    switch (action.kind) {
      case "LOAD":
        const module = await import("../crate/pkg/rl_wasm");
        parser = new ReplayParser(module);

        // @ts-ignore
        postMessage({ kind: "SUCCESS" } as WorkerResponse);
        break;
      case "PRETTY_PRINT":
        if (loadedReplay) {
          parseReplay(loadedReplay, action.pretty);
        }
        break;
      case "NEW_FILE":
        if (action.file instanceof File) {
          await loadReplayFile(action.file, action.pretty);
        } else {
          await fetchReplayLoad(action.file, action.pretty);
        }
        break;
      case "PARSE_NETWORK":
        parseNetwork(action.pretty);
        break;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : err;

    // @ts-ignore
    postMessage({ kind: "FAILED", msg: msg } as WorkerResponse);
  }
};

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

  // @ts-ignore
  postMessage({ kind: "PARSED", replay: res } as WorkerResponse);
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

    postMessage(
      { kind: "PARSED_NETWORK", buffer: replay.buffer } as WorkerResponse,
      // @ts-ignore
      [replay.buffer]
    );
  }
}
