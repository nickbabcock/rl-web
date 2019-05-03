import { h, Component } from "preact";

interface ReplayFormProps {
  newReplay: (replay: File) => void;
}

export default class ReplayForm extends Component<
  ReplayFormProps,
  {}
> {

  handleChange = (event: HTMLInputElement, props: ReplayFormProps) => {
    let target = event.target;
    let file = (target && target.files && target.files[0]) || null;
    if (!file) {
      return;
    }

    props.newReplay(file);
  };

  render(props: ReplayFormProps) {
    return (
      <label>
        Replay file:
        <input
          type="file"
          onChange={(e: HTMLInputElement) => this.handleChange(e, props)}
          accept=".replay"
        />
      </label>
    );
  }
}
