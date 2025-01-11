'use client';

import { Player, PlayerStats } from '../types/ranking';

interface LeagueStatsProps {
  players: Player[];
  playerStats: PlayerStats[];
}

export const LeagueStats = ({ players, playerStats }: LeagueStatsProps) => {
  // Sort players by win rate
  const sortedByWinRate = [...playerStats]
    .sort((a, b) => {
      const aWinRate = (a.positions.first / a.totalGames);
      const bWinRate = (b.positions.first / b.totalGames);
      return bWinRate - aWinRate;
    })
    .slice(0, 5);

  // Sort by average position
  const sortedByAvgPos = [...playerStats]
    .sort((a, b) => a.averagePosition - b.averagePosition)
    .slice(0, 5);

  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown Player';
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Win Rates</h3>
        <div className="space-y-2">
          {sortedByWinRate.map((stat) => (
            <div
              key={stat.playerId}
              className="flex justify-between items-center bg-white rounded-lg p-3"
            >
              <span>{getPlayerName(stat.playerId)}</span>
              <span className="font-medium">
                {((stat.positions.first / stat.totalGames) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Best Average Positions</h3>
        <div className="space-y-2">
          {sortedByAvgPos.map((stat) => (
            <div
              key={stat.playerId}
              className="flex justify-between items-center bg-white rounded-lg p-3"
            >
              <span>{getPlayerName(stat.playerId)}</span>
              <span className="font-medium">
                {stat.averagePosition.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">League Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Players</p>
            <p className="text-2xl font-bold">{players.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Games</p>
            <p className="text-2xl font-bold">
              {playerStats.reduce((sum, stat) => sum + stat.totalGames, 0) / 4}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 