import RankingsCalculator from "@/components/RankingsCalculator";
import { fetchRankings, fetchFixtures, transformFixtures } from "@/lib/api";
import { Gender } from "@/types";
import { redirect } from "next/navigation";

interface RankingsPageProps {
  params: Promise<{ gender: string }>;
}

export default async function RankingsPage({ params }: RankingsPageProps) {
  const { gender } = await params;

  // Validate gender parameter
  if (gender !== 'men' && gender !== 'women') {
    redirect('/men');
  }

  const genderType = gender as Gender;

  // Fetch data server-side
  const { rankings, effectiveTime } = await fetchRankings(genderType);
  const rankingsTime = new Date(effectiveTime).getTime();

  // Calculate date range (1 month ago to 6 months ahead)
  const now = Date.now();
  const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const sixMonthsLater = new Date(now + 180 * 24 * 60 * 60 * 1000);

  const startDate = oneMonthAgo.toISOString().split("T")[0];
  const endDate = sixMonthsLater.toISOString().split("T")[0];

  // Fetch fixtures
  const fixturesData = await fetchFixtures(startDate, endDate, genderType);

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
    <RankingsCalculator
      initialRankings={rankings}
      completedFixtures={completedFixtures}
      upcomingFixtures={upcomingFixtures}
    />
  );
}
