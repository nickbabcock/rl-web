import { h, Component } from "preact";

interface ReplayDateProps {
    gameDate: string;
}

const ReplayDate = ({ gameDate }: ReplayDateProps) => (
    <div>{gameDate}</div>
);

export default ReplayDate;
