import { ReplayParser } from "./core/ReplayParser";
import { ReplayFile } from "./core/Models";
import * as rl_wasm from "../crate/pkg/rl_wasm";

interface LoadedReplay {
  name: string;
  data: Uint8Array;
}

let parser: ReplayParser | null = null;
let loadedReplay: LoadedReplay | null = null;

onmessage = function(e) {
  const [action, data] = e.data;
  switch (action) {
    case "LOAD":
      try {
        rl_wasm
          .default("rl_wasm_bg.wasm")
          .then(x => {
            parser = new ReplayParser(rl_wasm);

            // @ts-ignore
            postMessage(["SUCCESS"]);
          })
          .catch(err => {
            // @ts-ignore
            postMessage(["FAILED", err.message]);
          });
      } catch (err) {
        // @ts-ignore
        postMessage(["FAILED", err.message]);
      }
      break;
    case "PRETTY_PRINT":
      if (loadedReplay) {
        innerMost(loadedReplay, data.pretty);
      }
      break;
    case "NEW_FILE":
      if (data.file instanceof File) {
        loadReplay(data.file, data.pretty);
      } else if (typeof data.file === "string") {
        fetchReplayLoad(data.file, data.pretty);
      }
      break;
    case "PARSE_NETWORK":
      parseNetwork(data.pretty);
      break;
  }
};

function fetchReplayLoad(path: string, pretty: boolean) {
  fetch(path)
    .then(x => x.arrayBuffer())
    .then(x => innerLoad("sample", pretty, x))
    .catch(err => {
      // @ts-ignore
      postMessage(["FAILED", err.message]);
    });
}

function innerMost(loaded: LoadedReplay, pretty: boolean) {
  try {
    if (!parser) {
      return;
    }
    const t0 = performance.now();
    const fn = pretty ? parser.parse_pretty : parser.parse;
    let replay = fn(loaded.data);
    const t1 = performance.now();

    let res: ReplayFile = {
      ...replay,
      name: loaded.name,
      parseMs: t1 - t0
    };

    // @ts-ignore
    postMessage(["PARSED", res]);
  } catch (err) {
    // @ts-ignore
    postMessage(["FAILED", err.message]);
  }
}

function innerLoad(name: string, pretty: boolean, buffer: ArrayBuffer) {
  const arr = new Uint8Array(buffer);
  loadedReplay = {
    name,
    data: arr
  };
  innerMost(loadedReplay, pretty);
}

function loadReplay(file: File, pretty: boolean) {
  new Response(file)
    .arrayBuffer()
    .then(buf => innerLoad(file.name, pretty, buf))
    .catch(err => {
      // @ts-ignore
      postMessage(["FAILED", err.message]);
    });
}

function parseNetwork(pretty: boolean) {
  if (loadedReplay && parser) {
    try {
      const t0 = performance.now();
      const replay = pretty
        ? parser.parse_network_pretty(loadedReplay.data)
        : parser.parse_network(loadedReplay.data);
      const t1 = performance.now();
      console.log(`${t1 - t0}ms`);

      // @ts-ignore
      postMessage(["PARSED_NETWORK", replay]);
    } catch (err) {
      // @ts-ignore
      postMessage(["FAILED", err.message]);
    }
  }
}
