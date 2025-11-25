"use client";

import { useState, useMemo } from "react";
import RankingsTable from "@/components/RankingsTable";
import FixtureList from "@/components/FixtureList";
import FixtureWithOutcomes from "@/components/FixtureWithOutcomes";
import { Fixture, CalculatedRanking, Ranking } from "@/types";
import { applyFixtures } from "@/lib/rankings";

interface RankingsCalculatorProps {
  initialRankings: Ranking[];
  completedFixtures: Fixture[];
  upcomingFixtures: Fixture[];
}

export default function RankingsCalculator({
  initialRankings,
  completedFixtures,
  upcomingFixtures,
}: RankingsCalculatorProps) {
  const [userFixtures, setUserFixtures] = useState<Fixture[]>([]);

  // Calculate updated rankings based on completed + user fixtures
  const calculatedRankings: CalculatedRanking[] = useMemo(() => {
    const allFixtures = [...completedFixtures, ...userFixtures];
    return applyFixtures(initialRankings, allFixtures);
  }, [initialRankings, completedFixtures, userFixtures]);

  // Original rankings as CalculatedRanking (no changes)
  const originalRankings: CalculatedRanking[] = useMemo(() => {
    return initialRankings.map((r) => ({
      ...r,
      change: 0,
      positionChange: 0,
    }));
  }, [initialRankings]);

  const handleAddFixture = (fixture: Fixture) => {
    setUserFixtures([...userFixtures, fixture]);
  };

  const handleRemoveFixture = (id: string) => {
    setUserFixtures(userFixtures.filter((f) => f.id !== id));
  };

  const handleClearUserFixtures = () => {
    setUserFixtures([]);
  };

  // Show calculated rankings if there are any completed fixtures or user predictions
  const hasChanges = completedFixtures.length > 0 || userFixtures.length > 0;
  const displayRankings = hasChanges ? calculatedRankings : originalRankings;

  // Get set of added fixture IDs for upcoming fixtures display
  const addedFixtureIds = useMemo(() => {
    return new Set(userFixtures.map((f) => f.id));
  }, [userFixtures]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Rankings */}
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {completedFixtures.length > 0 && (
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {completedFixtures.length} completed match{completedFixtures.length !== 1 ? 'es' : ''} applied
                  </span>
                )}
                {completedFixtures.length > 0 && userFixtures.length > 0 && " • "}
                {userFixtures.length > 0 && (
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {userFixtures.length} prediction{userFixtures.length !== 1 ? 's' : ''}
                  </span>
                )}
                {!hasChanges && (
                  <span>No matches applied yet</span>
                )}
              </p>
            </div>
            {userFixtures.length > 0 && (
              <button
                onClick={handleClearUserFixtures}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Clear Predictions
              </button>
            )}
          </div>
        </div>

        {/* Rankings Table */}
        <RankingsTable
          rankings={displayRankings}
          title={hasChanges ? "Calculated Rankings" : "Official Rankings"}
        />
      </div>

      {/* Right Column - Fixtures */}
      <div className="space-y-6">
        {/* Completed Matches */}
        {completedFixtures.length > 0 && (
          <FixtureList
            fixtures={completedFixtures}
            onRemoveFixture={() => {}}
            title="Completed Matches"
            readonly
          />
        )}

        {/* User Predictions */}
        {userFixtures.length > 0 && (
          <FixtureList
            fixtures={userFixtures}
            onRemoveFixture={handleRemoveFixture}
            title="Your Predictions"
          />
        )}

        {/* Upcoming Fixtures */}
        {upcomingFixtures.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Upcoming Fixtures ({upcomingFixtures.length})
            </h2>
            {upcomingFixtures.map((fixture) => (
              <FixtureWithOutcomes
                key={fixture.id}
                fixture={fixture}
                rankings={initialRankings}
                onAddFixture={handleAddFixture}
                isAdded={addedFixtureIds.has(fixture.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
