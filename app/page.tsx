import RankingsCalculator from "@/components/RankingsCalculator";
import { fetchRankings, fetchFixtures, transformFixtures } from "@/lib/api";

export default async function Home() {
  // Fetch data server-side
  const { rankings, effectiveTime } = await fetchRankings();
  const rankingsTime = new Date(effectiveTime).getTime();

  // Calculate date range (1 month ago to 6 months ahead)
  const now = Date.now();
  const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const sixMonthsLater = new Date(now + 180 * 24 * 60 * 60 * 1000);

  const startDate = oneMonthAgo.toISOString().split("T")[0];
  const endDate = sixMonthsLater.toISOString().split("T")[0];

  // Fetch fixtures
  const fixturesData = await fetchFixtures(startDate, endDate);

  // Get ranked team IDs for filtering
  const rankedTeamIds = new Set(rankings.map((r) => r.team.id));

  // Transform and filter fixtures
  const allFixtures = transformFixtures(
    { content: fixturesData },
    rankingsTime,
    rankedTeamIds
  );

  // Split into completed and upcoming
  const oneWeekFromNow = now + 7 * 24 * 60 * 60 * 1000;

  const completedFixtures = allFixtures.filter(
    (f) => f.homeScore !== null && f.awayScore !== null
  );

  const upcomingFixtures = allFixtures.filter(
    (f) =>
      (f.homeScore === null || f.awayScore === null) &&
      new Date(f.date || 0).getTime() >= now &&
      new Date(f.date || 0).getTime() <= oneWeekFromNow
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            World Rugby Rankings Calculator
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Calculate how match results affect World Rugby rankings
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RankingsCalculator
          initialRankings={rankings}
          completedFixtures={completedFixtures}
          upcomingFixtures={upcomingFixtures}
        />

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Rankings calculation based on{" "}
            <a
              href="https://www.world.rugby/tournaments/rankings/explanation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              World Rugby methodology
            </a>
          </p>
          <p className="mt-2">
            Data from{" "}
            <a
              href="https://www.world.rugby/rankings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              World Rugby
            </a>
            {" • "}
            Inspired by{" "}
            <a
              href="https://rawling.github.io/wr-calc/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              rawling/wr-calc
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
