import * as React from "react";

interface ReplayFormState {
  replayFile: string | undefined;
}

interface ReplayFormProps {
  newReplay: (replay: File) => void;
}

export default class ReplayForm extends React.Component<
  ReplayFormProps,
  ReplayFormState
> {
  state: ReplayFormState = { replayFile: undefined };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let target = event.target;
    let file = (target && target.files && target.files[0]) || null;
    if (!file) {
      return;
    }

    this.props.newReplay(file);
  };

  render() {
    return (
      <label>
        Replay file:
        <input
          type="file"
          value={this.state.replayFile}
          onChange={this.handleChange}
          accept=".replay"
        />
      </label>
    );
  }
}
