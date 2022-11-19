interface TeamScoresProps {
  team0score?: number;
  team1score?: number;
}

export const TeamScores = ({ team0score, team1score }: TeamScoresProps) => (
  <div className="mb-4 flex flex-col place-items-center">
    <div className="text-7xl">
      <span className="blue-team font-bold">{team0score || 0}</span>
      <span> - </span>
      <span className="orange-team font-bold">{team1score || 0}</span>
    </div>
  </div>
);
