import { PlayerStat } from "@/features/worker";
import { extractDate } from "@/utils/dates";
import { TeamPlayer } from "./TeamPlayer";

interface DescriptionProps {
  PlayerStats: PlayerStat[];
  Date: string;
  game_type: string;
}

export const Description = ({
  PlayerStats,
  Date,
  game_type,
}: DescriptionProps) => {
  const gameDate = extractDate(Date);
  const blues = PlayerStats.filter((x) => x.Team == 0);
  const oranges = PlayerStats.filter((x) => x.Team == 1);

  const blueSide = blues
    .map((x) => (
      <TeamPlayer
        key={x.Name + x.OnlineID}
        color="blue"
        onlineId={x.OnlineID}
        name={x.Name}
      />
    ))
    .reduce((acc, x) => [...acc, ", ", x], [] as (string | JSX.Element)[])
    .slice(1)!;

  const orangeSide = oranges
    .map((x) => (
      <TeamPlayer
        key={x.Name + x.OnlineID}
        color="orange"
        onlineId={x.OnlineID}
        name={x.Name}
      />
    ))
    .reduce((acc, x) => [...acc, ", ", x], [] as (string | JSX.Element)[])
    .slice(1)!;

  let gameType;
  if (game_type.includes("Soccar")) {
    gameType = "soccar";
  } else {
    gameType = game_type;
  }

  return (
    <p data-test-id="description" className="mx-auto max-w-prose text-lg">
      On {gameDate.toLocaleDateString()}, {blueSide} vs. {orangeSide} in a{" "}
      {blues.length}v{oranges.length} {gameType} match.
    </p>
  );
};
