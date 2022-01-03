interface TeamPlayerProps {
  color: "blue" | "orange";
  onlineId: string;
  name: string;
}

export const TeamPlayer: React.FC<TeamPlayerProps> = ({
  color,
  onlineId,
  name,
}) => {
  if (onlineId && onlineId !== "0") {
    return (
      <span className="font-bold">
        <a
          target="_blank"
          className={color}
          href={`https://calculated.gg/players/${onlineId}/overview`}
        >
          {name}
        </a>
      </span>
    );
  } else {
    return <span className={color}>{name}</span>;
  }
};
