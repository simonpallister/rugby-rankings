// Gender type for men's vs women's rugby
export type Gender = 'men' | 'women';

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
