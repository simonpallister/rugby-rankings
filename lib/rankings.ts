import { Ranking, Fixture, CalculatedRanking } from "@/types";

/**
 * Calculate the points exchange for a fixture based on World Rugby methodology
 *
 * Formula:
 * 1. Adjust home team rating by ±3 based on venue
 * 2. Calculate ranking differential: away rating - adjusted home rating
 * 3. Cap differential at ±10
 * 4. Calculate drawChange = cappedDiff / 10
 * 5. Five possible outcomes based on margin:
 *    - Home big win (>15): rwcMult * 1.5 * (drawChange + 1)
 *    - Home small win: rwcMult * (drawChange + 1)
 *    - Draw: rwcMult * drawChange
 *    - Away small win: rwcMult * (drawChange - 1)
 *    - Away big win (>15): rwcMult * 1.5 * (drawChange - 1)
 * 6. rwcMult = 2 if RWC, 1 otherwise
 */
export function calculatePointsExchange(
  homeRating: number,
  awayRating: number,
  homeScore: number,
  awayScore: number,
  isRwc: boolean = false,
  noHome: boolean = false
): { homeChange: number; awayChange: number } {
  // Apply home advantage
  const homeAdvantage = noHome ? 0 : 3;
  const adjustedHomeRating = homeRating + homeAdvantage;

  // Calculate ranking differential and cap at ±10
  const rankingDiff = awayRating - adjustedHomeRating;
  const cappedDiff = Math.max(-10, Math.min(10, rankingDiff));

  // Calculate draw change
  const drawChange = cappedDiff / 10;

  // RWC multiplier
  const rwcMult = isRwc ? 2 : 1;

  // Calculate point change based on result
  let homeChange: number;

  if (homeScore > awayScore) {
    // Home win
    const margin = homeScore - awayScore;
    if (margin > 15) {
      // Big win
      homeChange = rwcMult * 1.5 * (drawChange + 1);
    } else {
      // Small win
      homeChange = rwcMult * (drawChange + 1);
    }
  } else if (homeScore < awayScore) {
    // Away win
    const margin = awayScore - homeScore;
    if (margin > 15) {
      // Big win
      homeChange = rwcMult * 1.5 * (drawChange - 1);
    } else {
      // Small win
      homeChange = rwcMult * (drawChange - 1);
    }
  } else {
    // Draw
    homeChange = rwcMult * drawChange;
  }

  return {
    homeChange,
    awayChange: -homeChange, // Zero-sum game
  };
}

/**
 * Apply fixture results to rankings and return updated rankings
 */
export function applyFixture(
  rankings: Ranking[],
  fixture: Fixture
): Ranking[] {
  if (fixture.homeScore === null || fixture.awayScore === null) {
    return rankings;
  }

  const updatedRankings = rankings.map((r) => ({ ...r }));

  const homeTeamRanking = updatedRankings.find(
    (r) => r.team.id === fixture.homeTeam.id
  );
  const awayTeamRanking = updatedRankings.find(
    (r) => r.team.id === fixture.awayTeam.id
  );

  if (!homeTeamRanking || !awayTeamRanking) {
    return rankings;
  }

  const { homeChange, awayChange } = calculatePointsExchange(
    homeTeamRanking.pts,
    awayTeamRanking.pts,
    fixture.homeScore,
    fixture.awayScore,
    fixture.isRwc,
    fixture.noHome
  );

  homeTeamRanking.pts += homeChange;
  awayTeamRanking.pts += awayChange;

  return updatedRankings;
}

/**
 * Apply multiple fixtures and recalculate positions
 */
export function applyFixtures(
  initialRankings: Ranking[],
  fixtures: Fixture[]
): CalculatedRanking[] {
  let rankings = initialRankings.map((r) => ({ ...r }));

  // Apply each fixture in order
  for (const fixture of fixtures) {
    rankings = applyFixture(rankings, fixture);
  }

  // Sort by points (descending) to determine new positions
  rankings.sort((a, b) => b.pts - a.pts);

  // Calculate new positions and changes
  return rankings.map((ranking, index) => {
    const newPos = index + 1;
    return {
      ...ranking,
      pos: newPos,
      change: ranking.pts - ranking.previousPts,
      positionChange: ranking.previousPos - newPos,
    };
  });
}

/**
 * Get possible outcomes for a fixture (for scenario analysis)
 */
export function getFixtureOutcomes(
  homeRating: number,
  awayRating: number,
  isRwc: boolean = false,
  noHome: boolean = false
): {
  homeBigWin: number;
  homeSmallWin: number;
  draw: number;
  awaySmallWin: number;
  awayBigWin: number;
} {
  const scenarios = [
    { homeScore: 30, awayScore: 0 }, // Home big win
    { homeScore: 20, awayScore: 10 }, // Home small win
    { homeScore: 15, awayScore: 15 }, // Draw
    { homeScore: 10, awayScore: 20 }, // Away small win
    { homeScore: 0, awayScore: 30 }, // Away big win
  ];

  const outcomes = scenarios.map((scenario) =>
    calculatePointsExchange(
      homeRating,
      awayRating,
      scenario.homeScore,
      scenario.awayScore,
      isRwc,
      noHome
    )
  );

  return {
    homeBigWin: outcomes[0].homeChange,
    homeSmallWin: outcomes[1].homeChange,
    draw: outcomes[2].homeChange,
    awaySmallWin: outcomes[3].homeChange,
    awayBigWin: outcomes[4].homeChange,
  };
}
