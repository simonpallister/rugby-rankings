import { Ranking, Fixture, Team, Gender } from "@/types";

export interface WRRankingEntry {
  team: {
    id: number;
    name: string;
    abbreviation: string;
  };
  pts: number;
  pos: number;
  previousPts: number;
  previousPos: number;
}

export interface WRRankingsResponse {
  entries: WRRankingEntry[];
  label: string;
  effective: {
    millis: number;
    gmtOffset: number;
    label: string;
  };
}

export interface WRMatch {
  matchId?: string;
  id?: number;
  time: {
    label: string;
    millis: number;
  };
  teams: Array<{
    id: number;
    name: string;
    abbreviation: string;
    score?: number;
  }>;
  status: string;
  venue?: {
    name: string;
    city: string;
    country: string;
  };
  events?: Array<{
    id: number;
    label: string;
    rankingsWeight: number;
  }>;
}

export interface WRFixturesResponse {
  content: WRMatch[];
}

/**
 * Transform World Rugby rankings API response to internal format
 */
export function transformRankings(data: WRRankingsResponse): Ranking[] {
  return data.entries.map((entry) => ({
    team: {
      id: entry.team.id.toString(),
      name: entry.team.name,
      abbreviation: entry.team.abbreviation,
    },
    pts: entry.pts,
    pos: entry.pos,
    previousPts: entry.previousPts,
    previousPos: entry.previousPos,
  }));
}

/**
 * Transform World Rugby fixtures API response to internal format
 */
export function transformFixtures(
  data: WRFixturesResponse,
  rankingsTime: number,
  rankedTeamIds: Set<string>
): Fixture[] {
  return data.content
    .filter((match) => {
      // Only include future matches or matches that happened after the rankings date
      return (
        match.status !== "C" || match.time.millis > rankingsTime
      );
    })
    .filter((match) => {
      // Only include matches with two teams
      return match.teams.length === 2;
    })
    .filter((match) => {
      // Only include matches where both teams are in the rankings (international test matches)
      const team1Id = match.teams[0].id.toString();
      const team2Id = match.teams[1].id.toString();
      return rankedTeamIds.has(team1Id) && rankedTeamIds.has(team2Id);
    })
    .map((match) => {
      const homeTeam: Team = {
        id: match.teams[0].id.toString(),
        name: match.teams[0].name,
        abbreviation: match.teams[0].abbreviation,
      };

      const awayTeam: Team = {
        id: match.teams[1].id.toString(),
        name: match.teams[1].name,
        abbreviation: match.teams[1].abbreviation,
      };

      const isRwc = match.events?.some((e) => e.rankingsWeight === 2) || false;

      return {
        id: match.matchId || match.id?.toString() || `${match.time.millis}`,
        homeTeam,
        awayTeam,
        homeScore: match.teams[0].score ?? null,
        awayScore: match.teams[1].score ?? null,
        isRwc,
        noHome: false, // This would need venue detection logic
        date: new Date(match.time.millis).toISOString(),
      };
    });
}

/**
 * Fetch rankings from World Rugby API (server-side)
 * @param gender - 'men' or 'women'
 * @param date - Optional date string in YYYY-MM-DD format to fetch historical rankings
 */
export async function fetchRankings(
  gender: Gender = 'men',
  date?: string
): Promise<{
  rankings: Ranking[];
  effectiveTime: string;
}> {
  // Use 'mru' for men's rugby, 'wru' for women's rugby
  const rankingType = gender === 'men' ? 'mru' : 'wru';

  // Build URL with optional date parameter
  let url = `https://api.wr-rims-prod.pulselive.com/rugby/v3/rankings/${rankingType}?language=en&client=pulse`;
  if (date) {
    url += `&date=${date}`;
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${gender}'s rankings${date ? ` for ${date}` : ''}`);
  }

  const data: WRRankingsResponse = await response.json();
  return {
    rankings: transformRankings(data),
    effectiveTime: new Date(data.effective.millis).toISOString(),
  };
}

/**
 * Fetch fixtures from World Rugby API (server-side)
 * Note: Fixtures API returns all matches, filtering by ranked teams happens client-side
 */
export async function fetchFixtures(
  startDate: string,
  endDate: string,
  gender: Gender = 'men'
): Promise<WRMatch[]> {
  const allMatches: WRMatch[] = [];
  let page = 0;
  let hasMore = true;

  // Fetch all pages of fixtures
  while (hasMore) {
    const url = `https://api.wr-rims-prod.pulselive.com/rugby/v3/match?startDate=${startDate}&endDate=${endDate}&sort=asc&pageSize=100&page=${page}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${gender}'s fixtures`);
    }

    const data = await response.json();
    const matches = data.content || [];

    allMatches.push(...matches);

    // If we got less than 100 results, we've reached the last page
    hasMore = matches.length === 100;
    page++;
  }

  return allMatches;
}
