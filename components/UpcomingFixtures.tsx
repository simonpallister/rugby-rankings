"use client";

import { Fixture } from "@/types";
import { useState } from "react";

interface UpcomingFixturesProps {
  fixtures: Fixture[];
  onAddFixture: (fixture: Fixture) => void;
  addedFixtureIds: Set<string>;
}

export default function UpcomingFixtures({
  fixtures,
  onAddFixture,
  addedFixtureIds,
}: UpcomingFixturesProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");

  const handleStartEdit = (fixture: Fixture) => {
    setEditingId(fixture.id);
    setHomeScore("");
    setAwayScore("");
  };

  const handleSubmit = (fixture: Fixture) => {
    if (homeScore === "" || awayScore === "") return;

    const updatedFixture: Fixture = {
      ...fixture,
      homeScore: parseInt(homeScore),
      awayScore: parseInt(awayScore),
    };

    onAddFixture(updatedFixture);
    setEditingId(null);
    setHomeScore("");
    setAwayScore("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setHomeScore("");
    setAwayScore("");
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  if (fixtures.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Upcoming Fixtures
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No upcoming fixtures available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Upcoming Fixtures ({fixtures.length})
      </h2>
      <div className="space-y-4">
        {fixtures.map((fixture) => {
          const isAdded = addedFixtureIds.has(fixture.id);
          const isEditing = editingId === fixture.id;

          return (
            <div
              key={fixture.id}
              className={`rounded-lg border transition-all ${
                isAdded
                  ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                  : isEditing
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                  : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="p-3">
                {/* Date and badges */}
                <div className="flex items-center justify-between gap-2 text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatDate(fixture.date)}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">
                      {formatTime(fixture.date)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {fixture.isRwc && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                        RWC
                      </span>
                    )}
                  </div>
                </div>

                {/* Team names and score inputs */}
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {fixture.homeTeam.name}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center"
                        placeholder="0"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {fixture.awayTeam.name}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleSubmit(fixture)}
                        disabled={homeScore === "" || awayScore === ""}
                        className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 text-sm font-medium rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 text-right">
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {fixture.homeTeam.name}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm px-3">vs</div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {fixture.awayTeam.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartEdit(fixture)}
                      disabled={isAdded}
                      className={`ml-3 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        isAdded
                          ? "text-green-600 dark:text-green-400 cursor-not-allowed opacity-50"
                          : "text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                      }`}
                      title={isAdded ? "Already added" : "Predict score"}
                    >
                      {isAdded ? "✓ Added" : "Predict"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
