import { Graph } from "./Graph";
import { Description } from "./Description";
import { TeamScores } from "./TeamScores";
import { PlayerStat, Replay } from "@/features/worker";
import { DownloadReplayJson } from "./DownloadReplayJson";

interface ReportProps {
  name: string;
  replay: Replay;
  stats: PlayerStat[];
}

export const Report = ({ replay, stats, name }: ReportProps) => {
  return (
    <div className="mt-8 flex flex-col space-y-6">
      <div className="text-center">
        <h2 className="mb-1 text-2xl font-semibold">{name}</h2>
        <h3 className="text-2xl">Score:</h3>
      </div>
      <TeamScores
        team0score={replay.properties.Team0Score}
        team1score={replay.properties.Team1Score}
      />
      <DownloadReplayJson />
      <Description
        game_type={replay.game_type}
        PlayerStats={stats}
        {...replay.properties}
      />
      <div className="flex flex-wrap place-content-center space-y-10">
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
      </div>
    </div>
  );
};
