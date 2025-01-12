'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import GameActions from '@/components/GameActions';
import GameHistoryModal from '@/components/GameHistoryModal';
import type { Game, Player } from '@/types/game';

export default function Home() {
  const { data: session } = useSession();
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setIsAdmin(data.isAdmin);
          }
        } catch {
          // Ignore error, default to non-admin
        }
      }
    };

    checkAdminStatus();
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesResponse, playersResponse] = await Promise.all([
          fetch('/api/games'),
          fetch('/api/players'),
        ]);

        // Debug response status and content type
        console.log('Games Response:', {
          status: gamesResponse.status,
          contentType: gamesResponse.headers.get('content-type'),
        });
        console.log('Players Response:', {
          status: playersResponse.status,
          contentType: playersResponse.headers.get('content-type'),
        });

        // Only try to parse JSON if the response is ok and content-type is application/json
        let gamesData: Game[] = [];
        let playersData: Player[] = [];

        if (gamesResponse.ok && gamesResponse.headers.get('content-type')?.includes('application/json')) {
          gamesData = await gamesResponse.json();
        } else {
          console.error('Games Response Text:', await gamesResponse.text());
        }

        if (playersResponse.ok && playersResponse.headers.get('content-type')?.includes('application/json')) {
          playersData = await playersResponse.json();
        } else {
          console.error('Players Response Text:', await playersResponse.text());
        }

        setRecentGames(gamesData);
        setTopPlayers(playersData);

        // Only show error if both requests failed
        if (!gamesResponse.ok && !playersResponse.ok) {
          setError('Failed to load data');
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGameUpdated = () => {
    // Refetch data when a game is updated
    setIsLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const [gamesResponse, playersResponse] = await Promise.all([
          fetch('/api/games'),
          fetch('/api/players'),
        ]);

        if (!gamesResponse.ok || !playersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [games, players] = await Promise.all([
          gamesResponse.json(),
          playersResponse.json(),
        ]);

        setRecentGames(games);
        setTopPlayers(players);
      } catch {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Games</h2>
            {session && isAdmin && (
              <Link
                href="/games/new"
                className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
              >
                Record Game
              </Link>
            )}
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Players</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentGames.map((game) => {
                  return (
                    <tr key={game.id} className={game.isDeleted ? 'bg-red-50' : ''}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(game.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {game.isDeleted ? (
                          <span className="text-red-600">Deleted</span>
                        ) : (
                          <span>{game.isHanchan ? 'Hanchan' : 'Tonpuusen'}</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <div className="space-y-1">
                          {[
                            { player: game.eastPlayer, score: game.eastScore, wind: '🀀' },
                            { player: game.southPlayer, score: game.southScore, wind: '🀁' },
                            { player: game.westPlayer, score: game.westScore, wind: '🀂' },
                            { player: game.northPlayer, score: game.northScore, wind: '🀃' }
                          ]
                            .sort((a, b) => b.score - a.score)
                            .map((entry, index) => (
                              <div key={entry.player.id} className="flex items-center gap-2">
                                <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium
                                  ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                    index === 1 ? 'bg-gray-200 text-gray-800' :
                                      index === 2 ? 'bg-orange-100 text-orange-800' :
                                        'bg-gray-100 text-gray-700'}`}>
                                  {index + 1}
                                </div>
                                <span>{entry.wind}</span>
                                <Link href={`/players/${entry.player.id}`} className="text-indigo-600 hover:text-indigo-900">
                                  {entry.player.nickname}
                                </Link>
                                <span>{entry.score}</span>
                              </div>
                            ))}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex space-x-2">
                          {isAdmin ? (
                            <GameActions
                              game={{
                                ...game,
                                date: new Date(game.date).toISOString()
                              }}
                              onGameUpdated={handleGameUpdated}
                            />
                          ) : (
                            <button
                              onClick={() => setSelectedGameId(game.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View history"
                            >
                              📜
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Players</h2>
            <Link
              href="/players"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              View All
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Rank</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Player</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Rating</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topPlayers
                  .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
                  .slice(0, 10)
                  .map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">{player.rank}</span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <Link
                          href={`/players/${player.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium"
                        >
                          {player.nickname}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        {(player.rating ?? 0).toFixed(1)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        {(player.points ?? 0).toFixed(1)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedGameId && (
        <GameHistoryModal
          gameId={selectedGameId}
          onClose={() => setSelectedGameId(null)}
        />
      )}
    </div>
  );
} 