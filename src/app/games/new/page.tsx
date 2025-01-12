'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PlayerSelect } from '@/components/PlayerSelect';

interface GameData {
  date: string;
  isHanchan: boolean;
  eastPlayerId: string;
  eastScore: number;
  southPlayerId: string;
  southScore: number;
  westPlayerId: string;
  westScore: number;
  northPlayerId: string;
  northScore: number;
}

export default function NewGamePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string>('');
  const [gameData, setGameData] = useState<GameData>({
    date: new Date().toISOString(),
    isHanchan: true,
    eastPlayerId: '',
    eastScore: 0,
    southPlayerId: '',
    southScore: 0,
    westPlayerId: '',
    westScore: 0,
    northPlayerId: '',
    northScore: 0,
  });

  // Get all currently selected player IDs
  const selectedPlayerIds = [
    gameData.eastPlayerId,
    gameData.southPlayerId,
    gameData.westPlayerId,
    gameData.northPlayerId,
  ].filter(Boolean); // Remove empty strings

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create game');
      }
    }
  };

  if (!session) {
    return <div>Please sign in to record games.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Record New Game</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Game Type
          </label>
          <select
            value={gameData.isHanchan ? 'hanchan' : 'tonpuusen'}
            onChange={(e) =>
              setGameData({
                ...gameData,
                isHanchan: e.target.value === 'hanchan',
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="hanchan">Hanchan</option>
            <option value="tonpuusen">Tonpuusen</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              East Player
            </label>
            <PlayerSelect
              value={gameData.eastPlayerId}
              onChange={(id: string) =>
                setGameData({ ...gameData, eastPlayerId: id })
              }
              disabledPlayerIds={selectedPlayerIds.filter(id => id !== gameData.eastPlayerId)}
            />
            <input
              type="number"
              value={gameData.eastScore}
              onChange={(e) =>
                setGameData({
                  ...gameData,
                  eastScore: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Score"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              South Player
            </label>
            <PlayerSelect
              value={gameData.southPlayerId}
              onChange={(id: string) =>
                setGameData({ ...gameData, southPlayerId: id })
              }
              disabledPlayerIds={selectedPlayerIds.filter(id => id !== gameData.southPlayerId)}
            />
            <input
              type="number"
              value={gameData.southScore}
              onChange={(e) =>
                setGameData({
                  ...gameData,
                  southScore: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Score"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              West Player
            </label>
            <PlayerSelect
              value={gameData.westPlayerId}
              onChange={(id: string) =>
                setGameData({ ...gameData, westPlayerId: id })
              }
              disabledPlayerIds={selectedPlayerIds.filter(id => id !== gameData.westPlayerId)}
            />
            <input
              type="number"
              value={gameData.westScore}
              onChange={(e) =>
                setGameData({
                  ...gameData,
                  westScore: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Score"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              North Player
            </label>
            <PlayerSelect
              value={gameData.northPlayerId}
              onChange={(id: string) =>
                setGameData({ ...gameData, northPlayerId: id })
              }
              disabledPlayerIds={selectedPlayerIds.filter(id => id !== gameData.northPlayerId)}
            />
            <input
              type="number"
              value={gameData.northScore}
              onChange={(e) =>
                setGameData({
                  ...gameData,
                  northScore: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Score"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Record Game
        </button>
      </form>
    </div>
  );
} 