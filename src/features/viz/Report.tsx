import { Graph } from "./Graph";
import { Description } from "./Description";
import { TeamScores } from "./TeamScores";
import { DownloadReplayJson } from "./DownloadReplayJson";
import { ReplayYield } from "../replay/replayStore";

interface ReportProps {
  replay: ReplayYield;
}

export const Report = ({ replay }: ReportProps) => {
  const stats = replay.data.properties.PlayerStats;
  return (
    <div className="mt-8 flex flex-col space-y-6">
      <div className="text-center">
        <h2 className="mb-1 text-2xl font-semibold">{replay.input.name()}</h2>
        <h3 className="text-2xl">Score:</h3>
      </div>
      <TeamScores
        team0score={replay.data.properties.Team0Score}
        team1score={replay.data.properties.Team1Score}
      />
      <DownloadReplayJson replay={replay} />
      {stats !== undefined ? (
        <Description
          gameType={replay.data.game_type}
          PlayerStats={stats}
          {...replay.data.properties}
        />
      ) : null}
      {stats !== undefined ? (
        <div className="flex flex-wrap place-content-center gap-10">
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
      ) : null}
    </div>
  );
};
