export interface Team {
  id: string;
  name: string;
  abbreviation: string;
}

export interface Ranking {
  team: Team;
  pts: number;
  pos: number;
  previousPts: number;
  previousPos: number;
}

export interface Fixture {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  isRwc: boolean;
  noHome: boolean;
  date?: string;
}

export interface MatchOutcome {
  homeChange: number;
  awayChange: number;
  description: string;
}

export interface CalculatedRanking extends Ranking {
  change: number;
  positionChange: number;
}
