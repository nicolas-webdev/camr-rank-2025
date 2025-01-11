'use client';

import { useState } from 'react';
import { GameType, Player, Position } from '../types/ranking';

interface GameRecordFormProps {
  players: Player[];
  onSubmit: (gameData: {
    gameType: GameType;
    results: Array<{
      playerId: string;
      position: Position;
      score: number;
    }>;
  }) => void;
}

export const GameRecordForm = ({ players, onSubmit }: GameRecordFormProps) => {
  const [gameType, setGameType] = useState<GameType>('hanchan');
  const [results, setResults] = useState<Array<{
    playerId: string;
    position: Position;
    score: number;
  }>>([]);

  const positions: Position[] = ['first', 'second', 'third', 'fourth'];

  const handleScoreChange = (position: Position, value: string) => {
    const score = parseInt(value) || 0;
    const newResults = [...results];
    const index = newResults.findIndex(r => r.position === position);

    if (index >= 0) {
      newResults[index].score = score;
    }
    setResults(newResults);
  };

  const handlePlayerChange = (position: Position, playerId: string) => {
    const newResults = [...results];
    const index = newResults.findIndex(r => r.position === position);

    if (index >= 0) {
      newResults[index].playerId = playerId;
    } else {
      newResults.push({ playerId, position, score: 0 });
    }
    setResults(newResults);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length === 4) {
      onSubmit({ gameType, results });
      setResults([]);
    }
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

      <div className="space-y-4">
        {positions.map((position) => (
          <div key={position} className="flex gap-4">
            <select
              value={results.find(r => r.position === position)?.playerId || ''}
              onChange={(e) => handlePlayerChange(position, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select player</option>
              {players.map(player => (
                <option
                  key={player.id}
                  value={player.id}
                  disabled={results.some(r => r.playerId === player.id && r.position !== position)}
                >
                  {player.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={results.find(r => r.position === position)?.score || ''}
              onChange={(e) => handleScoreChange(position, e.target.value)}
              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Score"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={results.length !== 4}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
      >
        Record Game
      </button>
    </form>
  );
}; 