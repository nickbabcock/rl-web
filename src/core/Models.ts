export interface Replay {
  major_version: number;
  minor_version: number;
  net_version: number | null;
  game_type: string;
  properties: HeaderProperties;
}

export interface HeaderProperties {
  TeamSize: number;
  Team0Score: number;
  Team1Score: number;
  Goals: Goal[];
}

export interface Goal {
  PlayerName: string;
  frame: number;
  PlayerTeam: number;
}
