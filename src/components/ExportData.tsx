import { h, Component } from "preact";
import CopyHeader from "./CopyHeader";

interface ExportDataProps {
  raw: string;
  downloadNetworkCb: () => void;
  loading: boolean;
}

export default class ExportData extends Component<ExportDataProps, {}> {
  render({ raw, downloadNetworkCb, loading }: ExportDataProps) {
    return (
      <span>
        <CopyHeader header={raw} />
        <div className="downloadContainer">
          <span>
            <button
              className={loading ? "disabled" : undefined}
              disabled={loading}
              onClick={downloadNetworkCb}
            >
              Download full network data
            </button>
          </span>
        </div>
      </span>
    );
  }
}
