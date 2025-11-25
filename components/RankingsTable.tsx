"use client"

import { CalculatedRanking } from "@/types"
import { getCountryFlag } from "@/lib/countries"

interface RankingsTableProps {
  rankings: CalculatedRanking[]
  title?: string
}

export default function RankingsTable({ rankings, title = "Rankings" }: RankingsTableProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{title}</h2>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Pos</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rankings.map((ranking, index) => {
              const isEven = index % 2 === 0
              const posChange = ranking.positionChange
              const ptsChange = ranking.change

              return (
                <tr
                  key={ranking.team.id}
                  className={`${
                    isEven ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"
                  } hover:bg-green-50 dark:hover:bg-gray-700 transition-colors`}>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <span>{ranking.pos}</span>
                      {posChange > 0 && (
                        <span className="text-green-600 dark:text-green-400 text-xs">▲ {posChange}</span>
                      )}
                      {posChange < 0 && (
                        <span className="text-red-600 dark:text-red-400 text-xs">▼ {Math.abs(posChange)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCountryFlag(ranking.team.name)}</span>
                      <span>{ranking.team.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right font-mono">
                    {ranking.pts.toFixed(2)}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-right font-mono">
                    {ptsChange !== 0 && (
                      <span
                        className={`${
                          ptsChange > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        } font-semibold`}>
                        {ptsChange > 0 ? "+" : ""}
                        {ptsChange.toFixed(2)}
                      </span>
                    )}
                    {ptsChange === 0 && <span className="text-gray-400 dark:text-gray-500">-</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
