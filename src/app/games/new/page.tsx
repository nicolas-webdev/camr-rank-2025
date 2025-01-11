'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Player = {
  id: string;
  nickname: string;
};

type PlayerScore = {
  playerId: string;
  score: number;
};

export default function NewGamePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHanchan, setIsHanchan] = useState(true);

  const [scores, setScores] = useState<{
    east: PlayerScore;
    south: PlayerScore;
    west: PlayerScore;
    north: PlayerScore;
  }>({
    east: { playerId: '', score: 0 },
    south: { playerId: '', score: 0 },
    west: { playerId: '', score: 0 },
    north: { playerId: '', score: 0 },
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/players');
        if (!response.ok) throw new Error('Failed to fetch players');
        const data = await response.json();
        setPlayers(data);
      } catch {
        setError('Failed to load players');
      }
    };
    fetchPlayers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isHanchan,
          eastPlayerId: scores.east.playerId,
          eastScore: scores.east.score,
          southPlayerId: scores.south.playerId,
          southScore: scores.south.score,
          westPlayerId: scores.west.playerId,
          westScore: scores.west.score,
          northPlayerId: scores.north.playerId,
          northScore: scores.north.score,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoreChange = (position: keyof typeof scores, field: keyof PlayerScore, value: string) => {
    setScores(prev => ({
      ...prev,
      [position]: {
        ...prev[position],
        [field]: field === 'score' ? parseInt(value) || 0 : value,
      },
    }));
  };

  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to record games.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Record New Game</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Type
          </label>
          <select
            value={isHanchan ? 'hanchan' : 'tonpuusen'}
            onChange={(e) => setIsHanchan(e.target.value === 'hanchan')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="hanchan">Hanchan (East-South)</option>
            <option value="tonpuusen">Tonpuusen (East only)</option>
          </select>
        </div>

        {['east', 'south', 'west', 'north'].map((position) => (
          <div key={position} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {position.charAt(0).toUpperCase() + position.slice(1)} Player
              </label>
              <select
                value={scores[position as keyof typeof scores].playerId}
                onChange={(e) => handleScoreChange(position as keyof typeof scores, 'playerId', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select player</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.nickname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
              <input
                type="number"
                value={scores[position as keyof typeof scores].score}
                onChange={(e) => handleScoreChange(position as keyof typeof scores, 'score', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        ))}

        {error && (
          <div className="text-red-600 text-sm mt-2">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Recording...' : 'Record Game'}
        </button>
      </form>
    </div>
  );
} 