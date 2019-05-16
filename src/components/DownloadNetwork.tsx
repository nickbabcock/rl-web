import { h, Component } from "preact";
import { ReplayParser } from "../core/ReplayParser";

interface DownloadState {
  loading: boolean;
}

interface DownloadProps {
  parserMod: Promise<ReplayParser>;
  file: File;
}

export default class DownloadNetwork extends Component<
  DownloadProps,
  DownloadState
> {
  download: HTMLAnchorElement | null = null;

  constructor() {
    super();
    this.state = {
      loading: false
    };
  }

  clickDownload = () => {
    this.setState({
      loading: true
    });

    setTimeout(() => {
      this.props.parserMod.then(parser => {
        const reader = new FileReader();
        reader.onload = e => {
          if (reader.result && reader.result instanceof ArrayBuffer) {
            const t0 = performance.now();
            let replay = parser.parse_network(new Uint8Array(reader.result));
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

            this.setState({
              loading: false
            });
          }
        };
        reader.readAsArrayBuffer(this.props.file);
      });
    }, 50);
  };

  render(props: DownloadProps, { loading }: DownloadState) {
    return (
      <div className="downloadContainer">
        <button
          disabled={loading}
          className={loading ? "disabled" : undefined}
          onClick={this.clickDownload}
        >
          Download full network data
        </button>
        <div>
          <span
            style={{ display: loading ? "inline-flex" : "none" }}
            className="spinner"
          />
        </div>
        <a style={{ display: "none" }} ref={x => (this.download = x)} />
      </div>
    );
  }
}
