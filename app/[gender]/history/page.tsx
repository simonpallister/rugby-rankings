import { Gender } from '@/types';
import { redirect } from 'next/navigation';
import { HistoricalRankingsView } from '@/components/HistoricalRankingsView';
import { getLatestSnapshotDate, getRankedTeams } from '@/lib/db/rankings';

interface HistoryPageProps {
  params: Promise<{ gender: string }>;
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const { gender } = await params;

  // Validate gender parameter
  if (gender !== 'men' && gender !== 'women') {
    redirect('/men/history');
  }

  const genderType = gender as Gender;

  // Fetch initial data server-side
  const [latestDate, teams] = await Promise.all([
    getLatestSnapshotDate(genderType),
    getRankedTeams(genderType),
  ]);

  // If no data yet, show message
  if (!latestDate || teams.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Historical Rankings - {gender === 'men' ? "Men's" : "Women's"}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No historical data available yet.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Historical rankings will appear here once the daily snapshot job has run.
            You can manually trigger a snapshot by running:
          </p>
          <code className="mt-4 inline-block bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded">
            npm run snapshot
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Historical Rankings - {gender === 'men' ? "Men's" : "Women's"}
      </h1>
      <HistoricalRankingsView
        gender={genderType}
        teams={teams}
        latestDate={latestDate}
      />
    </div>
  );
}
