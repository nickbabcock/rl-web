import { expose } from "comlink";
import * as ReplayModule from "./engine";

expose(ReplayModule);
export type WasmWorker = typeof ReplayModule;
