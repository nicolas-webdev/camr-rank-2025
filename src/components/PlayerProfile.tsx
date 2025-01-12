'use client';

import { useEffect, useState } from 'react';
import { PlayerStats } from '@/components/PlayerStats';
import type { Player } from '@prisma/client';

interface PlayerProfileProps {
  playerId: string;
}

interface ExtendedPlayer extends Player {
  rankProgress: number;
  pointsToNextRank: number;
}

export function PlayerProfile({ playerId }: PlayerProfileProps) {
  const [player, setPlayer] = useState<ExtendedPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlayer() {
      try {
        const response = await fetch(`/api/players/${playerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch player');
        }
        const data = await response.json();
        setPlayer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPlayer();
  }, [playerId]);

  if (loading) {
    return <div className="animate-pulse">Loading player profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <div className="space-y-8">
      {/* Player Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{player.nickname}</h1>
            {player.realName && (
              <p className="text-gray-600 dark:text-gray-400">{player.realName}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Legajo</div>
              <div className="font-semibold text-gray-900 dark:text-white">{player.legajo}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Nationality</div>
              <div className="font-semibold text-gray-900 dark:text-white">{player.nationality}</div>
            </div>
          </div>
        </div>

        {/* Platform IDs */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {player.tenhouName && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tenhou:</span>
              <span className="font-medium text-gray-900 dark:text-white">{player.tenhouName}</span>
            </div>
          )}
          {player.mahjongSoulName && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">MahjongSoul:</span>
              <span className="font-medium text-gray-900 dark:text-white">{player.mahjongSoulName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ranking Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Ranking Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Rank</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{player.rank}</div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, player.rankProgress))}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {player.pointsToNextRank} points to next rank
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Rating</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round(player.rating)}
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Max Rating</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round(player.maxRating)}
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Points</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{player.points}</div>
          </div>
        </div>
      </div>

      {/* Player Statistics */}
      <PlayerStats playerId={playerId} />
    </div>
  );
} 