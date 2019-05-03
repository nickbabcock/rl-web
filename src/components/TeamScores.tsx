import { h, Component } from "preact";

interface TeamScoresProps {
  team0score?: number;
  team1score?: number;
}

const TeamScores = ({ team0score, team1score }: TeamScoresProps) => (
  <div className="teamScores">
    <div className="teamScoreLabel">Team Score:</div>
    <strong className="rlBlue">{team0score || 0}</strong>
    <span> - </span>
    <strong className="rlOrange">{team1score || 0}</strong>
  </div>
);

export default TeamScores;
