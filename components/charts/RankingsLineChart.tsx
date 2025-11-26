'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { getCountryFlag } from '@/lib/countries';

interface DataPoint {
  date: string;
  [teamName: string]: number | string;
}

interface RankingsLineChartProps {
  data: DataPoint[];
  selectedTeams: string[];
  metric: 'points' | 'position';
}

// Colors for lines (cycling through a palette)
const COLORS = [
  '#10b981', // green-500
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
];

// Custom tooltip component that sorts teams by rank
const CustomTooltip = ({ active, payload, label, metric }: TooltipProps<number, string> & { metric: 'points' | 'position' }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  // Sort payload by value (rank/points)
  const sortedPayload = [...payload].sort((a, b) => {
    const aValue = a.value as number;
    const bValue = b.value as number;

    if (metric === 'position') {
      // For position, lower is better (1 is better than 2)
      return aValue - bValue;
    } else {
      // For points, higher is better
      return bValue - aValue;
    }
  });

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '0.75rem',
      }}
    >
      <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{label}</p>
      {sortedPayload.map((entry, index) => {
        const displayValue = typeof entry.value === 'number'
          ? (metric === 'position' ? Math.round(entry.value) : entry.value.toFixed(2))
          : entry.value;

        return (
          <p key={index} style={{ color: entry.color, margin: '0.25rem 0' }}>
            {getCountryFlag(entry.name || '')} {entry.name}: {displayValue}
          </p>
        );
      })}
    </div>
  );
};

export function RankingsLineChart({
  data,
  selectedTeams,
  metric,
}: RankingsLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
        No data available for the selected period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
        <XAxis
          dataKey="date"
          className="text-gray-600 dark:text-gray-400"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          className="text-gray-600 dark:text-gray-400"
          tick={{ fontSize: 12 }}
          reversed={metric === 'position'} // Lower position numbers are better
          domain={metric === 'position' ? [1, 'auto'] : ['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip metric={metric} />} />
        <Legend
          wrapperStyle={{ paddingTop: '1rem' }}
          formatter={(value: string) => {
            const flag = getCountryFlag(value);
            return `${flag} ${value}`;
          }}
        />
        {selectedTeams.map((team, index) => (
          <Line
            key={team}
            type="monotone"
            dataKey={team}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name={team}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
