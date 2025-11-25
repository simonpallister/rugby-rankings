"use client";

import { Fixture } from "@/types";
import { useState } from "react";

interface FixtureScoreModalProps {
  fixture: Fixture;
  onClose: () => void;
  onSubmit: (fixture: Fixture) => void;
}

export default function FixtureScoreModal({
  fixture,
  onClose,
  onSubmit,
}: FixtureScoreModalProps) {
  const [homeScore, setHomeScore] = useState<string>(
    fixture.homeScore?.toString() || ""
  );
  const [awayScore, setAwayScore] = useState<string>(
    fixture.awayScore?.toString() || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (homeScore === "" || awayScore === "") {
      return;
    }

    const updatedFixture: Fixture = {
      ...fixture,
      homeScore: parseInt(homeScore),
      awayScore: parseInt(awayScore),
    };

    onSubmit(updatedFixture);
    onClose();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Predict Score
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {formatDate(fixture.date)}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {/* Home Team */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {fixture.homeTeam.name}
              </label>
              <input
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Home score"
                required
                autoFocus
              />
            </div>

            {/* Away Team */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {fixture.awayTeam.name}
              </label>
              <input
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Away score"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-colors"
            >
              Add Fixture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
