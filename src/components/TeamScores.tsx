import { h, Component } from "preact";

interface TeamScoresProps {
    team0score?: number;
    team1score?: number;
}

const TeamScores = ({ team0score, team1score}: TeamScoresProps) => (
    <div><span>{team0score || 0}</span> - <span>{team1score || 0}</span></div>
);

export default TeamScores;
