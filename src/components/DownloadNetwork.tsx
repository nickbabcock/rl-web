import { h, Component } from "preact";
import { ReplayParser } from "../core/ReplayParser";
import RlError from "./RlError";

interface DownloadState {
  loading: boolean;
  error: Error | null;
}

interface DownloadProps {
  parserMod: Promise<ReplayParser>;
  file: File;
  pretty: boolean;
}

export default class DownloadNetwork extends Component<
  DownloadProps,
  DownloadState
> {
  download: HTMLAnchorElement | null = null;

  constructor() {
    super();
    this.state = {
      loading: false,
      error: null
    };
  }

  clickDownload = () => {
    this.setState({
      loading: true,
      error: null
    });

    // This timeout is a poor man's web worker that allow the spinner
    // animation to spin while replay is parsed. Ideally the network
    // parser would be put on a web worker, but thus far I have not
    // been able to successfully share a WebAssembly.Module with
    // a web worker and have it instantiated.
    setTimeout(() => {
      this.props.parserMod.then(parser => {
        const reader = new FileReader();
        reader.onload = e => {
          if (reader.result && reader.result instanceof ArrayBuffer) {
            try {
              const t0 = performance.now();
              const data = new Uint8Array(reader.result);
              const replay = this.props.pretty ? parser.parse_network_pretty(data) : parser.parse_network(data);
              const t1 = performance.now();
              console.log(`${t1 - t0}ms`);

              const blob = new Blob([replay], {
                type: "application/json"
              });

              const fileName = `${this.props.file.name}.json`;
              this.download!.href = URL.createObjectURL(blob);
              this.download!.download = fileName;
              this.download!.click();
              URL.revokeObjectURL(this.download!.href);
            } catch (error) {
              this.setState({
                error: error
              });
            } finally {
              this.setState({
                loading: false
              });
            }
          }
        };
        reader.readAsArrayBuffer(this.props.file);
      });
    }, 10);
  };

  render(props: DownloadProps, { loading, error }: DownloadState) {
    return (
      <div className="downloadContainer">
        <span>
          <button
            disabled={loading}
            className={loading ? "disabled" : undefined}
            onClick={this.clickDownload}
          >
            Download full network data
          </button>
          <span
            style={{ display: loading ? "inline-flex" : "none" }}
            className="spinner"
          />
        </span>
        <a style={{ display: "none" }} ref={x => (this.download = x)} />
        <RlError error={error} />
      </div>
    );
  }
}
