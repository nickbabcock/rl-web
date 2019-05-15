import { h, Component } from "preact";
import TeamPlayer from "./TeamPlayer";
import { PlayerStat } from "../core/Models";
import { extractDate } from "../core/Dates";

interface DescriptionProps {
  TeamSize: number;
  PlayerStats: PlayerStat[];
  Date: string;
  RecordFPS: number;
  NumFrames: number;
  game_type: string;
}

const Description = ({
  TeamSize,
  PlayerStats,
  Date,
  RecordFPS,
  NumFrames,
  game_type
}: DescriptionProps) => {
  const gameDate = extractDate(Date);
//  const seconds = NumFrames / RecordFPS;
 // const minutes = Math.floor((seconds + 119) / 60);

  const blues = PlayerStats.filter(x => x.Team == 0);
  const oranges = PlayerStats.filter(x => x.Team == 1);

  const blueSide = blues
    .map(x => (
      <TeamPlayer ClassName="rlBlue" OnlineID={x.OnlineID} Name={x.Name} />
    ))
    .reduce((acc, x) => [...acc, ", ", x], [] as (string | JSX.Element)[]).slice(1)!;

  const orangeSide = oranges
    .map(x => (
      <TeamPlayer ClassName="rlOrange" OnlineID={x.OnlineID} Name={x.Name} />
    ))
    .reduce((acc, x) => [...acc, ", ", x], [] as (string | JSX.Element)[]).slice(1)!;

  let gameType;
  if (game_type.includes("Soccar")) {
    gameType = "soccar";
  } else {
    gameType = game_type;
  }

  return (
    <p className="description">
      On {gameDate.toLocaleDateString()}, {blueSide} vs. {orangeSide} in a {blues.length}v{oranges.length} {gameType} match.
    </p>
  );
};

export default Description;
