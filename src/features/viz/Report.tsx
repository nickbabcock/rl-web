import { Graph } from "./Graph";
import { Description } from "./Description";
import { TeamScores } from "./TeamScores";
import { PlayerStat, Replay } from "@/features/worker";
import { DownloadReplayJson } from "./DownloadReplayJson";

interface ReportProps {
  replay: Replay;
  stats: PlayerStat[];
}

export const Report: React.FC<ReportProps> = ({ replay, stats }) => {
  return (
    <>
      <TeamScores
        team0score={replay.properties.Team0Score}
        team1score={replay.properties.Team1Score}
      />
      <DownloadReplayJson/>
      <Description
        game_type={replay.game_type}
        PlayerStats={stats}
        {...replay.properties}
      />
      <Graph
        key="Player Scores"
        title="Player Scores"
        defaultMax={1000}
        valFn={(x) => x.Score}
        scores={stats}
      />
      <Graph
        key="Player Goals"
        title="Player Goals"
        defaultMax={4}
        valFn={(x) => x.Goals}
        scores={stats}
      />
      <Graph
        key="Player Shots"
        title="Player Shots"
        defaultMax={8}
        valFn={(x) => x.Shots}
        scores={stats}
      />
      <Graph
        key="Player Saves"
        title="Player Saves"
        defaultMax={4}
        valFn={(x) => x.Saves}
        scores={stats}
      />
      <Graph
        key="Player Assists"
        title="Player Assists"
        defaultMax={4}
        valFn={(x) => x.Assists}
        scores={stats}
      />
    </>
  );
};
