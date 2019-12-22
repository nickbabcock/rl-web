import { h, Component } from "preact";
import { publishFile } from "../injector";

interface ReplayFormProps {
  loading: boolean;
}

export default class ReplayForm extends Component<ReplayFormProps, {}> {
  handleChange = (event: Event) => {
    let target = event.target as HTMLInputElement;
    let file = (target && target.files && target.files[0]) || null;
    if (!file) {
      return;
    }

    publishFile(file);
  };

  render({ loading }: ReplayFormProps) {
    const className = loading
      ? "sue-button button-primary disabled"
      : "sue-button button-primary";
    return (
      <button className={className} disabled={loading}>
        <label>
          Select Replay File
          <input type="file" onChange={this.handleChange} accept=".replay" />
        </label>
      </button>
    );
  }
}
