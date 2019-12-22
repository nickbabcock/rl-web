import { ReplayParser } from "./core/ReplayParser";
import { ReplayFile } from "./core/Models";
import * as rl_wasm from "../crate/pkg/rl_wasm";

let parser: ReplayParser | null = null;
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
        postMessage(["FAILED", err.message]);
      }
      break;
    case "NEW_FILE":
      loadReplay(data.file, data.pretty);
      break;
    case "PARSE_NETWORK":
      parseNetwork(data.file, data.pretty);
      break;
  }
};

function loadReplay(file: File, pretty: boolean) {
  const reader = new FileReader();
  reader.onload = e => {
    if (reader.result && reader.result instanceof ArrayBuffer) {
      try {
        const t0 = performance.now();
        if (!parser) {
          return;
        }

        const fn = pretty ? parser.parse_pretty : parser.parse;
        let replay = fn(new Uint8Array(reader.result));
        const t1 = performance.now();

        let res: ReplayFile = {
          ...replay,
          file,
          parseMs: t1 - t0
        };

        // @ts-ignore
        postMessage(["PARSED", res]);
      } catch (error) {
        postMessage(["FAILED", err.message]);
      }
    }
  };
  reader.readAsArrayBuffer(file);
}

function parseNetwork(file: File, pretty: boolean) {
  const reader = new FileReader();
  reader.onload = e => {
    if (reader.result && reader.result instanceof ArrayBuffer) {
      try {
        const t0 = performance.now();
        if (!parser) {
          return;
        }

        const data = new Uint8Array(reader.result);
        const replay = pretty
          ? parser.parse_network_pretty(data)
          : parser.parse_network(data);
        const t1 = performance.now();
        console.log(`${t1 - t0}ms`);

        // @ts-ignore
        postMessage(["PARSED_NETWORK", replay]);
      } catch (error) {
        postMessage(["FAILED", err.message]);
      }
    }
  };

  reader.readAsArrayBuffer(file);
}
