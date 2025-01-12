'use client';

import { GameResult, Player } from '@/types/ranking';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Tooltip } from '@/components/ui/Tooltip';
import { FaMedal } from 'react-icons/fa';

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
          className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              {new Date(game.date).toLocaleDateString()} {new Date(game.date).toLocaleTimeString()}
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
              {game.gameType === 'hanchan' ? 'Hanchan' : 'Tonpuusen'}
            </span>
          </div>

          <div className="space-y-3">
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
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-medium ${result.position === 'first' ? 'bg-yellow-100 text-yellow-800' :
                      result.position === 'second' ? 'bg-gray-100 text-gray-800' :
                        result.position === 'third' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {result.position === 'first' ? '1' :
                        result.position === 'second' ? '2' :
                          result.position === 'third' ? '3' : '4'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{getPlayerName(result.playerId)}</span>
                      <span className="text-sm text-gray-500">Score: {result.finalScore.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Tooltip content={
                      <div className="space-y-1">
                        <div>Final score: {result.finalScore.toLocaleString()}</div>
                        {result.rankChange && (
                          <>
                            <div>Points: {result.rankChange.pointsBeforeGame.toFixed(1)} → {result.rankChange.pointsAfterGame.toFixed(1)}</div>
                            <div>Rank: {result.rankChange.from} → {result.rankChange.to}</div>
                          </>
                        )}
                      </div>
                    }>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${result.pointsEarned > 0 ? 'text-green-600' :
                            result.pointsEarned < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                            {result.pointsEarned > 0 ? '+' : ''}{result.pointsEarned.toFixed(1)} pts
                          </span>
                          {result.rankChange && result.rankChange.from !== result.rankChange.to && (
                            <FaMedal className="text-yellow-500" title="Rank Up!" />
                          )}
                        </div>
                        {result.rankChange && (
                          <span className="text-sm text-gray-500">
                            {result.rankChange.from} → {result.rankChange.to}
                          </span>
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 