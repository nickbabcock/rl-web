import { h, Component } from "preact";
import CopyHeader from "./CopyHeader";

interface ExportDataProps {
  raw: string;
  file: File;
  downloadNetworkCb: () => void;
  loading: boolean;
}

export default class ExportData extends Component<ExportDataProps, {}> {
  render({ raw, file, downloadNetworkCb, loading }: ExportDataProps) {
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
