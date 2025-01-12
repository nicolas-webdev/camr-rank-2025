'use client';

import { PlayerStats } from '@/types/ranking';

interface PlayerStatsDisplayProps {
  stats: PlayerStats;
  playerName: string;
}

export const PlayerStatsDisplay = ({ stats, playerName }: PlayerStatsDisplayProps) => {
  const winRate = (stats.positions.first / stats.totalGames) * 100;
  const topTwoRate = ((stats.positions.first + stats.positions.second) / stats.totalGames) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">{playerName}&apos;s Statistics</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Total Games</p>
          <p className="text-2xl font-bold">{stats.totalGames}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Average Position</p>
          <p className="text-2xl font-bold">{stats.averagePosition.toFixed(2)}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Win Rate</p>
          <p className="text-2xl font-bold">{winRate.toFixed(1)}%</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Top 2 Rate</p>
          <p className="text-2xl font-bold">{topTwoRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Position Distribution</h4>
        <div className="space-y-2">
          {(['first', 'second', 'third', 'fourth'] as const).map((position) => (
            <div key={position} className="relative">
              <div className="flex justify-between text-sm mb-1">
                <span>{position.charAt(0).toUpperCase() + position.slice(1)}</span>
                <span>{((stats.positions[position] / stats.totalGames) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${position === 'first' ? 'bg-green-500' :
                    position === 'second' ? 'bg-blue-500' :
                      position === 'third' ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`}
                  style={{
                    width: `${(stats.positions[position] / stats.totalGames) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Score Range</h4>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Highest</p>
            <p className="text-lg font-semibold">{stats.highestScore.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-lg font-semibold">{stats.averagePoints.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Lowest</p>
            <p className="text-lg font-semibold">{stats.lowestScore.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 