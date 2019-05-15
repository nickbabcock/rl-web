import { h, Component } from "preact";
import ReplayForm from "./ReplayForm";
import TeamScores from "./TeamScores";
import Description from "./Description";
import CopyHeader from "./CopyHeader";
import { Replay } from "../core/Models";
import Graph from "./Graph";

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
          <Description
            game_type={props.replay.game_type}
            {...props.replay.properties}
          />
          <CopyHeader header={JSON.stringify(props.replay)} />
          <Graph title={"Player Scores"} defaultMax={1000} valFn={(x) => x.Score} scores={props.replay.properties.PlayerStats} />
          <Graph title={"Player Goals"} defaultMax={4} valFn={(x) => x.Goals} scores={props.replay.properties.PlayerStats} />
          <Graph title={"Player Shots"} defaultMax={8} valFn={(x) => x.Shots} scores={props.replay.properties.PlayerStats} />
          <Graph title={"Player Saves"} defaultMax={4} valFn={(x) => x.Saves} scores={props.replay.properties.PlayerStats} />
          <Graph title={"Player Assists"} defaultMax={4} valFn={(x) => x.Assists} scores={props.replay.properties.PlayerStats} />
        </div>
      );
    }
  }
}
