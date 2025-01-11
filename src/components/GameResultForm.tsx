'use client';

import { useState } from 'react';
import { GameType, Position, Player } from '../types/ranking';

interface GameResultFormProps {
  players: Player[];
  onSubmit: (results: {
    gameType: GameType;
    results: Array<{
      playerId: string;
      position: Position;
      score: number;
    }>;
  }) => void;
}

export const GameResultForm = ({ players, onSubmit }: GameResultFormProps) => {
  const [gameType, setGameType] = useState<GameType>('hanchan');
  const [results, setResults] = useState<Array<{
    playerId: string;
    position: Position;
    score: number;
  }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ gameType, results });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Game Type
        </label>
        <select
          value={gameType}
          onChange={(e) => setGameType(e.target.value as GameType)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="hanchan">Hanchan</option>
          <option value="tonpuusen">Tonpuusen</option>
        </select>
      </div>

      {/* Player results input fields */}
      <div className="space-y-4">
        {['first', 'second', 'third', 'fourth'].map((position) => (
          <div key={position} className="flex gap-4">
            <select
              onChange={(e) => {
                const newResults = [...results];
                const index = newResults.findIndex(r => r.position === position);
                if (index >= 0) {
                  newResults[index].playerId = e.target.value;
                } else {
                  newResults.push({
                    playerId: e.target.value,
                    position: position as Position,
                    score: 0
                  });
                }
                setResults(newResults);
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select player</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Score"
              onChange={(e) => {
                const newResults = [...results];
                const index = newResults.findIndex(r => r.position === position);
                if (index >= 0) {
                  newResults[index].score = Number(e.target.value);
                }
                setResults(newResults);
              }}
              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Record Game Result
      </button>
    </form>
  );
}; 