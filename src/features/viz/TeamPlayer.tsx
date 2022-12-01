import { PlayerStat } from "../worker";

interface TeamPlayerProps {
  color: "blue" | "orange";
  player: PlayerStat;
}

const playerUrl = (player: PlayerStat) => {
  const baseUrl = "https://ballchasing.com";
  if (
    player.Platform.value === "OnlinePlatform_Steam" &&
    player.OnlineID !== "0"
  ) {
    return `${baseUrl}/player/steam/${player.OnlineID}`;
  } else if (player.Platform.value === "OnlinePlatform_PS4") {
    return `${baseUrl}/player/ps4/${player.Name}`;
  } else {
    const url = new URL(baseUrl);
    url.searchParams.append("player-name", `"${player.Name}"`);
    return url.toString();
  }
};

export const TeamPlayer = ({ color, player }: TeamPlayerProps) => {
  const className = `${color}-team`;

  return (
    <span className="font-bold">
      <a
        target="_blank"
        rel="noreferrer"
        className={className}
        href={playerUrl(player)}
      >
        {player.Name}
      </a>
    </span>
  );
};
