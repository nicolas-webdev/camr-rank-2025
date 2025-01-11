'use client';

import { useEffect, useMemo } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useStatsStore } from '@/store/statsStore';
import { ComponentErrorBoundary } from '@/components/ui/ComponentErrorBoundary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { RankDisplay } from '@/components/RankDisplay';
import Link from 'next/link';

export default function LeagueStandings() {
  const { players, fetchPlayers, isLoading: playerLoading, error: playerError } = usePlayerStore();
  const { playerStats, updateStats, isLoading: statsLoading, error: statsError } = useStatsStore();

  useEffect(() => {
    fetchPlayers();
    Promise.all(players.map(p => updateStats(p.id)));
  }, [fetchPlayers, updateStats, players]);

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      // First sort by rank level (descending)
      const rankDiff = b.currentRank.totalPointsRequired - a.currentRank.totalPointsRequired;
      if (rankDiff !== 0) return rankDiff;

      // Then by points within rank (descending)
      const pointsDiff = b.currentPoints - a.currentPoints;
      if (pointsDiff !== 0) return pointsDiff;

      // Finally by average position (ascending)
      const statsA = playerStats[a.id];
      const statsB = playerStats[b.id];
      return (statsA?.averagePosition || 0) - (statsB?.averagePosition || 0);
    });
  }, [players, playerStats]);

  if (playerLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  if (playerError || statsError) {
    return <ErrorMessage message={playerError || statsError || 'Error loading standings'} />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">League Standings</h1>

      <ComponentErrorBoundary name="StandingsTable">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rank</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Player</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Current Rank</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Points</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Games</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Avg Pos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedPlayers.map((player, index) => {
                const stats = playerStats[player.id];
                return (
                  <tr key={player.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <Link
                        href={`/players/${player.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {player.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <RankDisplay
                        currentRank={player.currentRank}
                        currentPoints={player.currentPoints}
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-900">
                      {player.currentPoints}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-900">
                      {player.totalGamesPlayed}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-900">
                      {stats?.averagePosition.toFixed(2) || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ComponentErrorBoundary>
    </div>
  );
} 