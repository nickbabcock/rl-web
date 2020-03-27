import { h, Component, Fragment } from "preact";
import Graph from "./Graph";
import Description from "./Description";
import TeamScores from "./TeamScores";
import { Replay, PlayerStat } from "../core/Models";

interface ReportProps {
  replay: Replay;
  stats: PlayerStat[];
}

export default class Report extends Component<ReportProps, {}> {
  render({ replay, stats }: ReportProps) {
    return (
      <Fragment>
        <TeamScores
          team0score={replay.properties.Team0Score}
          team1score={replay.properties.Team1Score}
        />
        <Description
          game_type={replay.game_type}
          PlayerStats={stats}
          {...replay.properties}
        />
        <Graph
          title={"Player Scores"}
          defaultMax={1000}
          valFn={(x) => x.Score}
          scores={stats}
        />
        <Graph
          title={"Player Goals"}
          defaultMax={4}
          valFn={(x) => x.Goals}
          scores={stats}
        />
        <Graph
          title={"Player Shots"}
          defaultMax={8}
          valFn={(x) => x.Shots}
          scores={stats}
        />
        <Graph
          title={"Player Saves"}
          defaultMax={4}
          valFn={(x) => x.Saves}
          scores={stats}
        />
        <Graph
          title={"Player Assists"}
          defaultMax={4}
          valFn={(x) => x.Assists}
          scores={stats}
        />
      </Fragment>
    );
  }
}
