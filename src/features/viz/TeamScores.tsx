interface TeamScoresProps {
  team0score?: number;
  team1score?: number;
}

export const TeamScores: React.FC<TeamScoresProps> = ({
  team0score,
  team1score,
}) => (
  <div className="flex-col place-items-center my-4">
    <div className="text-2xl">Team Score:</div>
    <div className="text-7xl">
      <span className="blue font-bold">{team0score || 0}</span>
      <span> - </span>
      <span className="orange font-bold">{team1score || 0}</span>
    </div>
  </div>
);
