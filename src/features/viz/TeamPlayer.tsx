interface TeamPlayerProps {
  color: "blue" | "orange";
  onlineId: string;
  name: string;
}

export const TeamPlayer = ({ color, onlineId, name }: TeamPlayerProps) => {
  if (onlineId && onlineId !== "0") {
    return (
      <span className="font-bold">
        <a
          target="_blank"
          rel="noreferrer"
          className={`${color}-team`}
          href={`https://calculated.gg/players/${onlineId}/overview`}
        >
          {name}
        </a>
      </span>
    );
  } else {
    return <span className={`${color}-team`}>{name}</span>;
  }
};
