import { h, Component, Fragment, createRef } from "preact";
import ReplayForm from "./ReplayForm";
import Report from "./Report";
import { ReplayFile } from "../core/Models";
import ExportData from "./ExportData";
import RlError from "./RlError";
import { subscribeFile } from "../injector";

interface AppState {
  wasmLoaded: boolean;
  replayFile: ReplayFile | undefined;
  prettyPrint: boolean;
  loading: boolean;
}

export default class App extends Component<{}, AppState> {
  downloadNetworkLink = createRef();
  replayWorker: Worker | null = null;
  state: AppState = {
    wasmLoaded: false,
    replayFile: undefined,
    prettyPrint: false,
    loading: false
  };

  // @ts-ignore
  workerMessage = e => {
    const [action, data] = e.data;
    if (action === "SUCCESS") {
      this.setState({
        ...this.state,
        wasmLoaded: true
      });
    } else if (action === "PARSED") {
      this.setState({
        ...this.state,
        loading: false,
        replayFile: data
      });
    } else if (action === "PARSED_NETWORK" && this.state.replayFile) {
      this.setState({ ...this.state, loading: false });
      const blob = new Blob([data], {
        type: "application/json"
      });

      const fileName = `${this.state.replayFile.file.name}.json`;
      const link = this.downloadNetworkLink.current;
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
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
    this.replayWorker = new Worker("../worker.ts");
    this.replayWorker.postMessage(["LOAD"]);

    this.replayWorker.onmessage = this.workerMessage;
    subscribeFile(data => {
      if (this.replayWorker) {
        this.replayWorker.postMessage([
          "NEW_FILE",
          {
            file: data,
            pretty: this.state.prettyPrint
          }
        ]);

        this.setState({ ...this.state, loading: true });
      }
    });

    this.importFromLocalStorage();
  }

  downloadNetwork = () => {
    if (this.replayWorker && this.state.replayFile) {
      this.replayWorker.postMessage([
        "PARSE_NETWORK",
        {
          file: this.state.replayFile.file,
          pretty: this.state.prettyPrint
        }
      ]);

      this.setState({ ...this.state, loading: true });
    }
  };

  togglePrettyPrint = (event: Event) => {
    let target = event.target as HTMLInputElement;
    let value = (target && target.checked) || false;
    localStorage.setItem("pretty-print", JSON.stringify(value));
    let valueChanged = value != this.state.prettyPrint;
    if (valueChanged) {
      this.setState({ ...this.state, prettyPrint: value });
      if (this.state.replayFile && this.replayWorker) {
        this.replayWorker.postMessage([
          "NEW_FILE",
          {
            file: this.state.replayFile.file,
            pretty: value
          }
        ]);
        this.setState({ ...this.state, loading: true });
      }
    }
  };

  render(_props: {}, { wasmLoaded, replayFile, prettyPrint }: AppState) {
    let wasmElement = null;
    if (wasmLoaded === true) {
      wasmElement = (
        <Fragment>
          <div>&#x2713; Replay parser successfully loaded. Enjoy!</div>
          <ReplayForm loading={this.state.loading} />
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
    } else if (wasmLoaded === false) {
      wasmElement = <div>&#x2573; Replay parse failed to load</div>;
    }

    let replayElement = null;
    if (replayFile) {
      if (replayFile.replay.properties.PlayerStats) {
        const stats = replayFile.replay.properties.PlayerStats;
        const { replay, parseMs, file, raw } = replayFile;
        replayElement = (
          <div>
            <div className="parse-span">{`parsed ${
              file.name
            } in ${parseMs.toFixed(2)}ms`}</div>
            <ExportData
              raw={raw}
              file={file}
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
          <div>Replay successfully parsed but no stats extracted</div>
        );
      }
    }

    return (
      <Fragment>
        <div className={this.state.loading ? "spinner" : "hidden"} />
        {wasmElement}
        {replayElement}
      </Fragment>
    );
  }
}
