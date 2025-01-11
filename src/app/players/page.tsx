'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type Player = {
  id: string;
  nickname: string;
  points: number;
  rank: string;
  rating: number;
  gamesPlayed: number;
  rankInfo: {
    name: string;
    minPoints: number;
    maxPoints: number;
    kanji: string;
  };
};

export default function PlayersPage() {
  const { data: session } = useSession();
  const [players, setPlayers] = useState<Player[]>([]);
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
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/players');
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

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
        <h1 className="text-3xl font-bold">Players</h1>
        {isAdmin && (
          <Link
            href="/players/new"
            className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
          >
            New Player
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <Link
            key={player.id}
            href={`/players/${player.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{player.nickname}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Rank</p>
                  <p className="font-medium">{player.rankInfo.kanji}</p>
                </div>
                <div>
                  <p className="text-gray-600">Rating</p>
                  <p className="font-medium">{player.rating}</p>
                </div>
                <div>
                  <p className="text-gray-600">Points</p>
                  <p className="font-medium">{player.points}</p>
                </div>
                <div>
                  <p className="text-gray-600">Games</p>
                  <p className="font-medium">{player.gamesPlayed}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No players registered yet.
        </div>
      )}
    </div>
  );
} 