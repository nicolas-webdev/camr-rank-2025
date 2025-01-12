'use client';

import { useEffect, useState } from 'react';
import type { Stats, RatingChange } from '@prisma/client';

interface PlayerStatsProps {
  playerId: string;
}

interface ExtendedStats extends Stats {
  ratingHistory: RatingChange[];
}

export function PlayerStats({ playerId }: PlayerStatsProps) {
  const [stats, setStats] = useState<ExtendedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/players/${playerId}/stats`);
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [playerId]);

  if (loading) {
    return <div className="animate-pulse">Loading statistics...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!stats) {
    return <div>No statistics available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Overall Statistics */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Overall Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Total Games:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.totalGames}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Average Placement:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.avgPlacement.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Rentai Rate:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.rentaiRate.toFixed(1)}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">1st</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.firstPlace}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.totalGames > 0 ? ((stats.firstPlace / stats.totalGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">2nd</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.secondPlace}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.totalGames > 0 ? ((stats.secondPlace / stats.totalGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">3rd</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.thirdPlace}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.totalGames > 0 ? ((stats.thirdPlace / stats.totalGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">4th</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.fourthPlace}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.totalGames > 0 ? ((stats.fourthPlace / stats.totalGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hanchan Statistics */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Hanchan Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Total Games:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.hanchanGames}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Average Placement:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.hanchanAvg.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Rentai Rate:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.hanchanRentai.toFixed(1)}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">1st</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.hanchanFirst}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.hanchanGames > 0 ? ((stats.hanchanFirst / stats.hanchanGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">2nd</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.hanchanSecond}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.hanchanGames > 0 ? ((stats.hanchanSecond / stats.hanchanGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">3rd</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.hanchanThird}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.hanchanGames > 0 ? ((stats.hanchanThird / stats.hanchanGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">4th</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.hanchanFourth}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.hanchanGames > 0 ? ((stats.hanchanFourth / stats.hanchanGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tonpuusen Statistics */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Tonpuusen Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Total Games:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.tonpuusenGames}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Average Placement:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.tonpuusenAvg.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Rentai Rate:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.tonpuusenRentai.toFixed(1)}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">1st</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.tonpuusenFirst}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.tonpuusenGames > 0 ? ((stats.tonpuusenFirst / stats.tonpuusenGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">2nd</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.tonpuusenSecond}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.tonpuusenGames > 0 ? ((stats.tonpuusenSecond / stats.tonpuusenGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">3rd</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.tonpuusenThird}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.tonpuusenGames > 0 ? ((stats.tonpuusenThird / stats.tonpuusenGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300">4th</div>
                <div className="font-medium text-gray-900 dark:text-white">{stats.tonpuusenFourth}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stats.tonpuusenGames > 0 ? ((stats.tonpuusenFourth / stats.tonpuusenGames) * 100).toFixed(1) : '0'}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating History */}
      {stats.ratingHistory && stats.ratingHistory.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Recent Rating Changes</h3>
          <div className="space-y-2">
            {stats.ratingHistory.map((change) => (
              <div key={change.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2 text-gray-900">
                  <span>{change.oldRating}</span>
                  <span>→</span>
                  <span>{change.newRating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={change.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {change.change >= 0 ? '+' : ''}{change.change}
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(change.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 