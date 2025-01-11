'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import GameActions from '@/components/GameActions';

type Player = {
  id: string;
  nickname: string;
  points: number;
  rank: string;
  rating: number;
};

type Game = {
  id: string;
  date: string;
  isHanchan: boolean;
  eastPlayerId: string;
  eastPlayer: Player;
  eastScore: number;
  southPlayerId: string;
  southPlayer: Player;
  southScore: number;
  westPlayerId: string;
  westPlayer: Player;
  westScore: number;
  northPlayerId: string;
  northPlayer: Player;
  northScore: number;
  isDeleted: boolean;
  createdAt: string;
  createdBy?: { name: string | null };
  updatedAt: string;
  updatedBy?: { name: string | null };
  deletedAt?: string;
  deletedBy?: { name: string | null };
};

export default function Home() {
  const { data: session } = useSession();
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
                  {isAdmin && (
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentGames.map((game) => (
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
                        <div>
                          🀀 <Link href={`/players/${game.eastPlayer.id}`} className="text-indigo-600 hover:text-indigo-900">
                            {game.eastPlayer.nickname}
                          </Link>: {game.eastScore}
                        </div>
                        <div>
                          🀁 <Link href={`/players/${game.southPlayer.id}`} className="text-indigo-600 hover:text-indigo-900">
                            {game.southPlayer.nickname}
                          </Link>: {game.southScore}
                        </div>
                        <div>
                          🀂 <Link href={`/players/${game.westPlayer.id}`} className="text-indigo-600 hover:text-indigo-900">
                            {game.westPlayer.nickname}
                          </Link>: {game.westScore}
                        </div>
                        <div>
                          🀃 <Link href={`/players/${game.northPlayer.id}`} className="text-indigo-600 hover:text-indigo-900">
                            {game.northPlayer.nickname}
                          </Link>: {game.northScore}
                        </div>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-2 text-sm">
                        <GameActions
                          game={{
                            ...game,
                            date: new Date(game.date)
                          }}
                          onGameUpdated={handleGameUpdated}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Top Players</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Rank</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Player</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topPlayers.map((player, index) => (
                  <tr key={player.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <Link href={`/players/${player.id}`} className="text-indigo-600 hover:text-indigo-900">
                        {player.nickname}
                      </Link>
                      <span className="ml-2 text-gray-500">
                        {player.rank}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {player.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 