'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
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
      <div className="flex justify-end mb-8">
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Signed in as {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn('github')}
            className="bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Sign in with GitHub
          </button>
        )}
      </div>

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