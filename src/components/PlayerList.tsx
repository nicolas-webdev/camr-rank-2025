'use client';

import { Player } from '@/types/ranking';
import { RankDisplay } from '@/components/RankDisplay';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface PlayerListProps {
  players: Player[];
  isLoading: boolean;
  error: string | null;
  onDeletePlayer?: (playerId: string) => void;
}

export const PlayerList = ({
  players,
  isLoading,
  error,
  onDeletePlayer
}: PlayerListProps) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (players.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No players registered yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {players.map((player) => (
        <div
          key={player.id}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{player.name}</h3>
              <p className="text-sm text-gray-500">
                Joined: {player.joinDate.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Total Games: {player.totalGamesPlayed}
              </p>
            </div>
            {onDeletePlayer && (
              <button
                onClick={() => onDeletePlayer(player.id)}
                className="text-red-600 hover:text-red-800"
                aria-label={`Delete ${player.name}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="mt-4">
            <RankDisplay
              currentRank={player.currentRank}
              currentPoints={player.currentPoints}
            />
          </div>
        </div>
      ))}
    </div>
  );
}; 