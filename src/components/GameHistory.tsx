'use client';

import { useEffect } from 'react';
import { GameResult, Player } from '../types/ranking';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';

interface GameHistoryProps {
  games: GameResult[];
  players: Player[];
  isLoading: boolean;
  error: string | null;
}

export const GameHistory = ({
  games,
  players,
  isLoading,
  error
}: GameHistoryProps) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (games.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No games recorded yet
      </div>
    );
  }

  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown Player';
  };

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div
          key={game.id}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              {game.date.toLocaleDateString()}
            </span>
            <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {game.gameType}
            </span>
          </div>

          <div className="space-y-2">
            {game.players
              .sort((a, b) => {
                const positions = { first: 1, second: 2, third: 3, fourth: 4 };
                return positions[a.position] - positions[b.position];
              })
              .map((result) => (
                <div
                  key={result.playerId}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                      {result.position === 'first' ? '1' :
                        result.position === 'second' ? '2' :
                          result.position === 'third' ? '3' : '4'}
                    </span>
                    <span>{getPlayerName(result.playerId)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      {result.finalScore.toLocaleString()}
                    </span>
                    <span className={`font-medium ${result.pointsEarned > 0 ? 'text-green-600' :
                      result.pointsEarned < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                      {result.pointsEarned > 0 ? '+' : ''}{result.pointsEarned}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 