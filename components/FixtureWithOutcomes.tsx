"use client";

import { Fixture, Ranking } from "@/types";
import { getFixtureOutcomes } from "@/lib/rankings";
import { getCountryFlag } from "@/lib/countries";

interface FixtureWithOutcomesProps {
  fixture: Fixture;
  rankings: Ranking[];
  onAddFixture: (fixture: Fixture) => void;
  isAdded: boolean;
}

export default function FixtureWithOutcomes({
  fixture,
  rankings,
  onAddFixture,
  isAdded,
}: FixtureWithOutcomesProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get current ratings
  const homeRanking = rankings.find(r => r.team.id === fixture.homeTeam.id);
  const awayRanking = rankings.find(r => r.team.id === fixture.awayTeam.id);

  if (!homeRanking || !awayRanking) {
    return null;
  }

  // Calculate possible outcomes
  const outcomes = getFixtureOutcomes(
    homeRanking.pts,
    awayRanking.pts,
    fixture.isRwc,
    fixture.noHome
  );

  const handlePrediction = (homeScore: number, awayScore: number) => {
    const updatedFixture: Fixture = {
      ...fixture,
      homeScore,
      awayScore,
    };
    onAddFixture(updatedFixture);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span>{formatDate(fixture.date)}</span>
            <span className="opacity-75">{formatTime(fixture.date)}</span>
          </div>
          <div className="flex gap-1">
            {fixture.isRwc && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500 text-yellow-900">
                RWC
              </span>
            )}
            {isAdded && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-900 text-green-100">
                ✓ Added
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{getCountryFlag(fixture.homeTeam.name)}</span>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fixture.homeTeam.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                #{homeRanking.pos} • {homeRanking.pts.toFixed(2)} pts
              </div>
            </div>
          </div>
          <div className="text-gray-400 dark:text-gray-500 font-semibold px-4">vs</div>
          <div className="flex items-center gap-2 flex-1 justify-end text-right">
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fixture.awayTeam.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                #{awayRanking.pos} • {awayRanking.pts.toFixed(2)} pts
              </div>
            </div>
            <span className="text-2xl">{getCountryFlag(fixture.awayTeam.name)}</span>
          </div>
        </div>
      </div>

      {/* Outcomes */}
      <div className="p-4 space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
          Possible Outcomes
        </h4>

        {/* Home Big Win */}
        <button
          onClick={() => handlePrediction(30, 10)}
          disabled={isAdded}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            isAdded
              ? "bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
              : "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {fixture.homeTeam.abbreviation} win by 15+
            </span>
            <span className="text-green-600 dark:text-green-400 font-semibold">
              {outcomes.homeBigWin > 0 ? '+' : ''}{outcomes.homeBigWin.toFixed(2)}
            </span>
          </div>
        </button>

        {/* Home Small Win */}
        <button
          onClick={() => handlePrediction(20, 15)}
          disabled={isAdded}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            isAdded
              ? "bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
              : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {fixture.homeTeam.abbreviation} win by 1-14
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {outcomes.homeSmallWin > 0 ? '+' : ''}{outcomes.homeSmallWin.toFixed(2)}
            </span>
          </div>
        </button>

        {/* Draw */}
        <button
          onClick={() => handlePrediction(15, 15)}
          disabled={isAdded}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            isAdded
              ? "bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
              : "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-gray-100">Draw</span>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">
              {outcomes.draw > 0 ? '+' : ''}{outcomes.draw.toFixed(2)}
            </span>
          </div>
        </button>

        {/* Away Small Win */}
        <button
          onClick={() => handlePrediction(15, 20)}
          disabled={isAdded}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            isAdded
              ? "bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
              : "bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {fixture.awayTeam.abbreviation} win by 1-14
            </span>
            <span className="text-orange-600 dark:text-orange-400 font-semibold">
              {outcomes.awaySmallWin > 0 ? '+' : ''}{outcomes.awaySmallWin.toFixed(2)}
            </span>
          </div>
        </button>

        {/* Away Big Win */}
        <button
          onClick={() => handlePrediction(10, 30)}
          disabled={isAdded}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            isAdded
              ? "bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
              : "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {fixture.awayTeam.abbreviation} win by 15+
            </span>
            <span className="text-red-600 dark:text-red-400 font-semibold">
              {outcomes.awayBigWin > 0 ? '+' : ''}{outcomes.awayBigWin.toFixed(2)}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
