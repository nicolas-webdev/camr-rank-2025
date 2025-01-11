'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import GameActions from '@/components/GameActions';

type Player = {
  id: string;
  nickname: string;
};

// Type for the API response
type GameResponse = {
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
};

// Type for the component state (with Date object)
type Game = Omit<GameResponse, 'date'> & {
  date: Date;
};

export default function GamesPage() {
  const { data: session } = useSession();
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
            const user = await response.json();
            setIsAdmin(user.isAdmin);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };

    checkAdminStatus();
  }, [session]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data: GameResponse[] = await response.json();
        setGames(data.map(game => ({
          ...game,
          date: new Date(game.date)
        })));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleGameUpdated = () => {
    setIsLoading(true);
    setError(null);
    fetch('/api/games')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch games');
        return response.json();
      })
      .then((data: GameResponse[]) => setGames(data.map(game => ({
        ...game,
        date: new Date(game.date)
      }))))
      .catch(error => setError(error instanceof Error ? error.message : 'An error occurred'))
      .finally(() => setIsLoading(false));
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Games</h1>
        {isAdmin && (
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
                  {new Date(game.date).toLocaleString()}
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

      {games.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No games recorded yet.
        </div>
      )}
    </div>
  );
} 