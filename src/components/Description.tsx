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
  const seconds = NumFrames / RecordFPS;
  const minutes = Math.floor((seconds + 119) / 60);

  const blueSide = PlayerStats.filter(x => x.Team === 0)
    .map(x => (
      <TeamPlayer ClassName="rlBlue" OnlineID={x.OnlineID} Name={x.Name} />
    ))
    .reduce((acc, x) => [...acc, ", ", x], [] as (string | JSX.Element)[])!;

  const orangeSide = PlayerStats.filter(x => x.Team === 1)
    .map(x => (
      <TeamPlayer ClassName="rlOrange" OnlineID={x.OnlineID} Name={x.Name} />
    ))
    .reduce((acc, x) => [...acc, ", ", x], [] as (string | JSX.Element)[])!;

  let gameType;
  if (game_type.includes("Soccar")) {
    gameType = "soccar";
  } else {
    gameType = game_type;
  }

  return (
    <p>
      On {gameDate.toLocaleDateString()}, {blueSide} vs. {orangeSide} in a
      {blueSide.length}v{orangeSide.length} {gameType} match lasting {minutes}
      minutes.
    </p>
  );
};

export default Description;
