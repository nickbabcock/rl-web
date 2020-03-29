import { h, Component, Fragment, createRef } from "preact";
import LoadSample from "./LoadSample";
import ReplayForm from "./ReplayForm";
import Report from "./Report";
import { ReplayFile } from "../core/Models";
import ExportData from "./ExportData";
import RlError from "./RlError";
import { subscribeFile } from "../injector";
import { WorkerRequest, WorkerResponse } from "../core/Messaging";

interface AppState {
  wasmLoaded: boolean;
  replayFile: ReplayFile | undefined;
  prettyPrint: boolean;
  loading: boolean;
  error: string | undefined;
}

export default class App extends Component<{}, AppState> {
  downloadNetworkLink = createRef();
  replayWorker: Worker | null = null;
  state: AppState = {
    wasmLoaded: false,
    replayFile: undefined,
    prettyPrint: false,
    loading: false,
    error: undefined,
  };

  workerMessage = ({ data }: { data: WorkerResponse }) => {
    switch (data.kind) {
      case "SUCCESS":
        this.setState({
          ...this.state,
          wasmLoaded: true,
        });
        break;
      case "PARSED":
        this.setState({
          ...this.state,
          loading: false,
          replayFile: data.replay,
        });
        break;
      case "PARSED_NETWORK":
        if (this.state.replayFile) {
          this.setState({ ...this.state, loading: false });
          const blob = new Blob([data.buffer], {
            type: "application/json",
          });

          const fileName = `${this.state.replayFile.name}.json`;
          const link = this.downloadNetworkLink.current;
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(link.href);
        }
        break;
      case "FAILED":
        this.setState({ ...this.state, error: data.msg });
        break;
    }
  };

  importFromLocalStorage = () => {
    if (localStorage.hasOwnProperty("pretty-print")) {
      try {
        const value = JSON.parse(
          localStorage.getItem("pretty-print") || "false"
        );
        this.setState({ ...this.state, prettyPrint: value });
      } catch (e) {}
    }
  };

  componentDidMount() {
    this.replayWorker = new Worker("../worker.js", { type: "module" });
    this.replayWorker.postMessage({ kind: "LOAD" } as WorkerRequest);

    this.replayWorker.onmessage = this.workerMessage;
    subscribeFile((data) => {
      if (this.replayWorker) {
        this.replayWorker.postMessage({
          kind: "NEW_FILE",
          file: data,
          pretty: this.state.prettyPrint,
        } as WorkerRequest);

        this.setState({ ...this.state, loading: true });
      }
    });

    this.importFromLocalStorage();
  }

  downloadNetwork = () => {
    if (this.replayWorker && this.state.replayFile) {
      this.replayWorker.postMessage({
        kind: "PARSE_NETWORK",
        pretty: this.state.prettyPrint,
      } as WorkerRequest);

      this.setState({ ...this.state, loading: true });
    }
  };

  togglePrettyPrint = (event: Event) => {
    let target = event.target as HTMLInputElement;
    let value = (target && target.checked) || false;
    localStorage.setItem("pretty-print", JSON.stringify(value));
    let valueChanged = value != this.state.prettyPrint;
    if (valueChanged) {
      if (this.state.replayFile && this.replayWorker) {
        this.replayWorker.postMessage({
          kind: "PRETTY_PRINT",
          pretty: value,
        } as WorkerRequest);
        this.setState({ ...this.state, loading: true, prettyPrint: value });
      } else {
        this.setState({ ...this.state, prettyPrint: value });
      }
    }
  };

  render(_props: {}, { wasmLoaded, replayFile, prettyPrint, error }: AppState) {
    let wasmElement = null;
    if (wasmLoaded === true) {
      wasmElement = (
        <Fragment>
          <div>&#x2713; Replay parser successfully loaded. Enjoy!</div>
          <ReplayForm loading={this.state.loading} />
          <LoadSample />
          <label>
            <input
              type="checkbox"
              id="pretty-print-checkbox"
              checked={prettyPrint}
              onChange={this.togglePrettyPrint}
              disabled={this.state.loading}
            />
            Pretty print output
          </label>
        </Fragment>
      );
    }

    let replayElement = null;
    if (replayFile) {
      if (replayFile.replay.properties.PlayerStats) {
        const stats = replayFile.replay.properties.PlayerStats;
        const { replay, parseMs, name, raw } = replayFile;
        replayElement = (
          <div>
            <div className="parse-span">{`parsed ${name} in ${parseMs.toFixed(
              2
            )}ms`}</div>
            <ExportData
              raw={raw}
              loading={this.state.loading}
              downloadNetworkCb={this.downloadNetwork}
            />
            <a className="hidden" ref={this.downloadNetworkLink} />
            <hr />
            <Report replay={replay} stats={stats} />
          </div>
        );
      } else {
        replayElement = (
          <RlError error="Replay successfully parsed but no stats extracted" />
        );
      }
    }

    let errorElement = null;
    if (error) {
      errorElement = <RlError error={error} />;
    }

    return (
      <Fragment>
        {errorElement}
        <div className={this.state.loading ? "spinner" : "hidden"} />
        {wasmElement}
        {replayElement}
      </Fragment>
    );
  }
}
