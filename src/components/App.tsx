import { h, Component } from "preact";
import ReplayForm from "./ReplayForm";
import TeamScores from "./TeamScores";
import PlayerScores from "./PlayerScores";
import ReplayDate from "./ReplayDate";
import { Replay } from "../core/Models";

interface AppProps {
  newReplay: (replay: File) => void;
  replay?: Replay;
}

export default class App extends Component<AppProps, {}> {
  render(props: AppProps) {
    if (!props.replay) {
      return (
        <div>
          <ReplayForm newReplay={props.newReplay} />
        </div>
      );
    } else {
      return (
        <div>
          <ReplayForm newReplay={props.newReplay} />
          <hr />
          <TeamScores
            team0score={props.replay.properties.Team0Score}
            team1score={props.replay.properties.Team1Score}
          />
          <ReplayDate gameDate={props.replay.properties.Date} />
          <PlayerScores scores={props.replay.properties.PlayerStats} />
        </div>
      );
    }
  }
}
