"use client";

import { Fixture } from "@/types";
import { getCountryFlag } from "@/lib/countries";

interface FixtureListProps {
  fixtures: Fixture[];
  onRemoveFixture: (id: string) => void;
  title?: string;
  readonly?: boolean;
}

export default function FixtureList({
  fixtures,
  onRemoveFixture,
  title = "Fixtures",
  readonly = false
}: FixtureListProps) {
  if (fixtures.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        {title} ({fixtures.length})
      </h2>
      <div className="space-y-3">
        {fixtures.map((fixture) => (
          <div
            key={fixture.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="flex-1 text-right flex items-center justify-end gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {fixture.homeTeam.name}
                  </span>
                  <span className="text-xl">{getCountryFlag(fixture.homeTeam.name)}</span>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100 min-w-[2rem] text-center">
                    {fixture.homeScore}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100 min-w-[2rem] text-center">
                    {fixture.awayScore}
                  </span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xl">{getCountryFlag(fixture.awayTeam.name)}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {fixture.awayTeam.name}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-2 justify-center">
                {fixture.isRwc && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                    RWC
                  </span>
                )}
                {fixture.noHome && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    Neutral
                  </span>
                )}
              </div>
            </div>
            {!readonly && (
              <button
                onClick={() => onRemoveFixture(fixture.id)}
                className="ml-4 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Remove fixture"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
