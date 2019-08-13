import { h, Component } from "preact";
import ReplayForm from "./ReplayForm";
import TeamScores from "./TeamScores";
import Description from "./Description";
import { ReplayFile } from "../core/Models";
import Graph from "./Graph";
import { ReplayParser } from "../core/ReplayParser";
import ExportData from "./ExportData";
import RlError from "./RlError";

interface AppProps {
  newReplay: (replay: File) => void;
  replayFile?: ReplayFile;
  parserMod: Promise<ReplayParser>;
  parseError?: Error;
}

export default class App extends Component<AppProps, {}> {
  render({ newReplay, replayFile, parserMod, parseError }: AppProps) {
    if (!replayFile && !parseError) {
      return (
        <div>
          <ReplayForm newReplay={newReplay} />
        </div>
      );
    } else if (parseError) {
      return (
        <div>
          <ReplayForm newReplay={newReplay} />
          <RlError error={parseError} />
        </div>
      );
    } else if (replayFile!.replay.properties.PlayerStats) {
      const { replay, parseMs, file, raw } = replayFile!;
      const stats = replay.properties.PlayerStats!;
      return (
        <div>
          <ReplayForm newReplay={newReplay} />
          <span className="parse-span">{`parsed ${
            file.name
          } in ${parseMs.toFixed(2)}ms`}</span>
          <hr />
          <TeamScores
            team0score={replay.properties.Team0Score}
            team1score={replay.properties.Team1Score}
          />
          <ExportData raw={raw} file={file} parserMod={parserMod} />
          <Description game_type={replay.game_type} PlayerStats={stats} {...replay.properties} />
          <Graph
            title={"Player Scores"}
            defaultMax={1000}
            valFn={x => x.Score}
            scores={stats}
          />
          <Graph
            title={"Player Goals"}
            defaultMax={4}
            valFn={x => x.Goals}
            scores={stats}
          />
          <Graph
            title={"Player Shots"}
            defaultMax={8}
            valFn={x => x.Shots}
            scores={stats}
          />
          <Graph
            title={"Player Saves"}
            defaultMax={4}
            valFn={x => x.Saves}
            scores={stats}
          />
          <Graph
            title={"Player Assists"}
            defaultMax={4}
            valFn={x => x.Assists}
            scores={stats}
          />
        </div>
      );
    } else {
      const error = !replayFile!.replay.properties.PlayerStats ? "Player stats missing from replay" : "Unknown error";
      return (
        <div>
          <ReplayForm newReplay={newReplay} />
          <RlError error={new Error(error)} />
        </div>
      );
    }
  }
}
