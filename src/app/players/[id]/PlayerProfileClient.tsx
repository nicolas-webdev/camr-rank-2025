'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import GameActions from '@/components/GameActions';

type Player = {
  id: string;
  nickname: string;
  points: number;
  rank: string;
};

type GameWithDate = {
  id: string;
  date: Date;
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
};

interface PlayerProfileClientProps {
  playerId: string;
}

export default function PlayerProfileClient({ playerId }: PlayerProfileClientProps) {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [games, setGames] = useState<GameWithDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        const response = await fetch(`/api/users/${session.user.id}`);
        if (response.ok) {
          const user = await response.json();
          setIsAdmin(user.isAdmin);
        }
      }
    };

    checkAdminStatus();
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playerResponse, gamesResponse] = await Promise.all([
          fetch(`/api/players/${playerId}`),
          fetch(`/api/players/${playerId}/games`),
        ]);

        if (!playerResponse.ok || !gamesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [playerData, gamesData] = await Promise.all([
          playerResponse.json(),
          gamesResponse.json(),
        ]);

        setPlayer(playerData);
        setGames(gamesData.map((game: GameWithDate) => ({
          ...game,
          date: new Date(game.date)
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [playerId]);

  const handleGameUpdated = () => {
    // Refetch games after update
    setIsLoading(true);
    fetch(`/api/players/${playerId}/games`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch games');
        return response.json();
      })
      .then(gamesData => {
        setGames(gamesData.map((game: GameWithDate) => ({
          ...game,
          date: new Date(game.date)
        })));
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to fetch games');
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      <div className="mb-8">
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-900"
        >
          ← Back to Home
        </Link>
      </div>

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

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Players</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Score</th>
              {isAdmin && (
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {games.map((game) => (
              <tr key={game.id} className={game.isDeleted ? 'bg-red-50' : ''}>
                <td className="px-4 py-2 text-sm">
                  {game.date.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm">
                  {game.isHanchan ? 'Hanchan' : 'Tonpuusen'}
                </td>
                <td className="px-4 py-2 text-sm">
                  <div>🀀 {game.eastPlayer.nickname}</div>
                  <div>🀁 {game.southPlayer.nickname}</div>
                  <div>🀂 {game.westPlayer.nickname}</div>
                  <div>🀃 {game.northPlayer.nickname}</div>
                </td>
                <td className="px-4 py-2 text-sm">
                  <div>{game.eastScore}</div>
                  <div>{game.southScore}</div>
                  <div>{game.westScore}</div>
                  <div>{game.northScore}</div>
                </td>
                {isAdmin && (
                  <td className="px-4 py-2 text-sm">
                    <GameActions game={game} onGameUpdated={handleGameUpdated} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 