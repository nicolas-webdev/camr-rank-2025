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
};

type Game = {
  id: string;
  date: string;
  isHanchan: boolean;
  eastPlayer: Player;
  eastScore: number;
  southPlayer: Player;
  southScore: number;
  westPlayer: Player;
  westScore: number;
  northPlayer: Player;
  northScore: number;
  isDeleted: boolean;
};

type PlayerProfileProps = {
  params: {
    id: string;
  };
};

export default function PlayerProfile({ params }: PlayerProfileProps) {
  const { data: session } = useSession();
  const [player, setPlayer] = useState<Player | null>(null);
  const [games, setGames] = useState<Game[]>([]);
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
        const [playerResponse, gamesResponse] = await Promise.all([
          fetch(`/api/players/${params.id}`),
          fetch(`/api/players/${params.id}/games`),
        ]);

        if (!playerResponse.ok || !gamesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [playerData, gamesData] = await Promise.all([
          playerResponse.json(),
          gamesResponse.json(),
        ]);

        setPlayer(playerData);
        setGames(gamesData);
      } catch {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleGameUpdated = () => {
    // Refetch data when a game is updated
    setIsLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const [playerResponse, gamesResponse] = await Promise.all([
          fetch(`/api/players/${params.id}`),
          fetch(`/api/players/${params.id}/games`),
        ]);

        if (!playerResponse.ok || !gamesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [playerData, gamesData] = await Promise.all([
          playerResponse.json(),
          gamesResponse.json(),
        ]);

        setPlayer(playerData);
        setGames(gamesData);
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

  if (error || !player) {
    return (
      <div className="text-red-600 text-center py-8">
        {error || 'Player not found'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{player.nickname}</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Rank</p>
            <p className="text-xl font-semibold">{player.rank}</p>
          </div>
          <div>
            <p className="text-gray-600">Points</p>
            <p className="text-xl font-semibold">{player.points}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Game History</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Position</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Score</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Players</th>
              {isAdmin && (
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {games.map((game) => {
              const position =
                game.eastPlayer.id === player.id ? 'East' :
                  game.southPlayer.id === player.id ? 'South' :
                    game.westPlayer.id === player.id ? 'West' :
                      'North';

              const score =
                game.eastPlayer.id === player.id ? game.eastScore :
                  game.southPlayer.id === player.id ? game.southScore :
                    game.westPlayer.id === player.id ? game.westScore :
                      game.northScore;

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
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {position}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {score}
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
                      <GameActions game={game} onGameUpdated={handleGameUpdated} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 