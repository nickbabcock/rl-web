import { h, Component } from "preact";
import CopyHeader from "./CopyHeader";
import DownloadNetwork from "./DownloadNetwork";
import { ReplayParser } from "../core/ReplayParser";

interface ExportDataProps {
  raw: string;
  file: File;
  parserMod: Promise<ReplayParser>;
}

interface ExportDataState {
  prettyRaw: string | null;
  checked: boolean;
}

export default class ExportData extends Component<
  ExportDataProps,
  ExportDataState
> {
  componentDidMount() {
    if (localStorage.hasOwnProperty("pretty-print")) {
      try {
        const value = JSON.parse(
          localStorage.getItem("pretty-print") || "false"
        );
        this.setState({ checked: value });
      } catch (e) {}
    }
  }

  componentDidUpdate(prevProps: ExportDataProps, prevState: ExportDataState) {
    if (this.state.checked && !this.state.prettyRaw) {
      this.props.parserMod.then(parser => {
        const reader = new FileReader();
        reader.onload = re => {
          if (reader.result && reader.result instanceof ArrayBuffer) {
            const data = new Uint8Array(reader.result);
            const prettyRaw = parser.parse_pretty(data).raw;
            this.setState({ prettyRaw });
          }
        };
        reader.readAsArrayBuffer(this.props.file);
      });
    }
  }

  handleChange = (event: Event) => {
    let target = event.target as HTMLInputElement;
    let value = (target && target.checked) || false;
    localStorage.setItem("pretty-print", JSON.stringify(value));
    this.setState({ checked: value });
  };

  render(
    { raw, file, parserMod }: ExportDataProps,
    { checked, prettyRaw }: ExportDataState
  ) {
    return (
      <span>
        <CopyHeader header={checked && prettyRaw ? prettyRaw : raw} />
        <DownloadNetwork file={file} parserMod={parserMod} pretty={checked} />
        <label>
          <input
            type="checkbox"
            id="pretty-print-checkbox"
            checked={checked}
            onChange={this.handleChange}
          />
          Pretty print output
        </label>
      </span>
    );
  }
}
