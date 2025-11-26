"use client"

import { useState, useEffect } from "react"
import { Gender } from "@/types"
import { RankingsLineChart } from "./charts/RankingsLineChart"
import { getCountryFlag } from "@/lib/countries"

interface Team {
  teamId: string
  teamName: string
  abbreviation: string
}

interface HistoricalRankingsViewProps {
  gender: Gender
  teams: Team[]
  latestDate: Date
}

interface HistoricalData {
  date: string
  [teamName: string]: number | string
}

export function HistoricalRankingsView({ gender, teams, latestDate }: HistoricalRankingsViewProps) {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [dateRange, setDateRange] = useState(90) // days
  const [metric, setMetric] = useState<"points" | "position">("position")
  const [data, setData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOtherTeams, setShowOtherTeams] = useState(false)

  // Select top 10 teams by default
  useEffect(() => {
    if (teams.length > 0 && selectedTeams.length === 0) {
      setSelectedTeams(teams.slice(0, 10).map(t => t.teamName))
    }
  }, [teams, selectedTeams.length])

  // Fetch data when selections change
  useEffect(() => {
    if (selectedTeams.length === 0) {
      setData([])
      return
    }

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const endDate = new Date(latestDate)
        const startDate = new Date(endDate)
        startDate.setDate(startDate.getDate() - dateRange)

        // Find teamIds for selected teams
        const selectedTeamIds = teams
          .filter(t => selectedTeams.includes(t.teamName))
          .map(t => t.teamId)
          .join(',')

        const response = await fetch(
          `/api/rankings/history?gender=${gender}&startDate=${startDate.toISOString().split("T")[0]}&endDate=${
            endDate.toISOString().split("T")[0]
          }&teamIds=${selectedTeamIds}`,
        )

        if (!response.ok) throw new Error("Failed to fetch historical data")

        const result = await response.json()

        // Transform data for charting - now we only get data for selected teams
        const dateMap = new Map<string, any>()

        result.rankings.forEach((r: any) => {
          const date = new Date(r.effectiveDate).toISOString().split("T")[0]
          if (!dateMap.has(date)) {
            dateMap.set(date, { date })
          }
          dateMap.get(date)[r.teamName] = metric === "points" ? r.points : r.position
        })

        setData(Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date)))
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    // Debounce the fetch to avoid too many requests when rapidly selecting teams
    const timeoutId = setTimeout(() => {
      fetchData()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [gender, selectedTeams, dateRange, metric, latestDate, teams])

  const handleTeamToggle = (teamName: string) => {
    setSelectedTeams(prev => (prev.includes(teamName) ? prev.filter(t => t !== teamName) : [...prev, teamName]))
  }

  // Split teams into top 20 and others
  const top20Teams = teams.slice(0, 20)
  const otherTeams = teams.slice(20)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metric Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Metric</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMetric("position")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  metric === "position"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}>
                Position
              </button>
              <button
                onClick={() => setMetric("points")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  metric === "points"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}>
                Points
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Period</label>
            <select
              value={dateRange}
              onChange={e => setDateRange(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500">
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 6 months</option>
              <option value={365}>Last year</option>
              <option value={730}>Last 2 years</option>
              <option value={1825}>Last 5 years</option>
              <option value={3650}>Last 10 years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {metric === "points" ? "Ranking Points" : "Position"} Over Time
        </h2>

        {loading && (
          <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">Loading data...</div>
        )}

        {error && <div className="flex items-center justify-center h-96 text-red-500">Error: {error}</div>}

        {!loading && !error && selectedTeams.length === 0 && (
          <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
            Select at least one team to view historical data
          </div>
        )}

        {!loading && !error && selectedTeams.length > 0 && (
          <RankingsLineChart data={data} selectedTeams={selectedTeams} metric={metric} />
        )}
      </div>

      {/* Team Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Teams (max 12)</label>

        {/* Top 20 Teams */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Top 20 Teams</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {top20Teams.map(team => (
              <button
                key={team.teamId}
                onClick={() => handleTeamToggle(team.teamName)}
                disabled={!selectedTeams.includes(team.teamName) && selectedTeams.length >= 12}
                className={`px-3 py-2 rounded-lg text-md font-medium transition-colors text-center ${
                  selectedTeams.includes(team.teamName)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}>
                {getCountryFlag(team.teamName)} {team.abbreviation}
              </button>
            ))}
          </div>
        </div>

        {/* Other Teams - Collapsible */}
        {otherTeams.length > 0 && (
          <div>
            <button
              onClick={() => setShowOtherTeams(!showOtherTeams)}
              className="w-full text-left text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center gap-2">
              <span>{showOtherTeams ? "▼" : "▶"}</span>
              <span>More Teams ({otherTeams.length})</span>
            </button>
            {showOtherTeams && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                {otherTeams.map(team => (
                  <button
                    key={team.teamId}
                    onClick={() => handleTeamToggle(team.teamName)}
                    disabled={!selectedTeams.includes(team.teamName) && selectedTeams.length >= 12}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      selectedTeams.includes(team.teamName)
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}>
                    {getCountryFlag(team.teamName)} {team.abbreviation}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{selectedTeams.length} / 12 teams selected</p>
      </div>
    </div>
  )
}
