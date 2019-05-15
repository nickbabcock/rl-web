import { h, Component } from "preact";

interface ReplayFormProps {
  newReplay: (replay: File) => void;
}

export default class ReplayForm extends Component<ReplayFormProps, {}> {
  handleChange = (event: Event) => {
    let target = event.target as HTMLInputElement;
    let file = (target && target.files && target.files[0]) || null;
    if (!file) {
      return;
    }

    this.props.newReplay(file);
  };

  render(props: ReplayFormProps) {
    return (
      <label className="sue-button button-primary">
        Select Replay File
        <input type="file" onChange={this.handleChange} accept=".replay" />
      </label>
    );
  }
}
