import React, { useState } from 'react';
import { GameEditModal } from './GameEditModal';
import GameHistoryModal from './GameHistoryModal';
import type { Game } from '@/types/game';

type GameActionsProps = {
  game: Game;
  onGameUpdated: () => void;
};

export default function GameActions({ game, onGameUpdated }: GameActionsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this game? This will affect player points and ranks.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/games/${game.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete game');
      }

      onGameUpdated();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete game');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm('Are you sure you want to restore this game? This will affect player points and ranks.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/games/${game.id}/restore`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to restore game');
      }

      onGameUpdated();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to restore game');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {error && (
        <div className="text-red-600 text-sm mr-2">{error}</div>
      )}

      <button
        onClick={() => setShowHistoryModal(true)}
        className="text-gray-600 hover:text-gray-800"
        title="View History"
        disabled={isLoading}
      >
        📋
      </button>

      {!game.isDeleted && (
        <>
          <button
            onClick={() => setShowEditModal(true)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit Game"
            disabled={isLoading}
          >
            ✏️
          </button>

          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
            title="Delete Game"
            disabled={isLoading}
          >
            🗑️
          </button>
        </>
      )}

      {game.isDeleted && (
        <button
          onClick={handleRestore}
          className="text-green-600 hover:text-green-800"
          title="Restore Game"
          disabled={isLoading}
        >
          ♻️
        </button>
      )}

      {showEditModal && (
        <GameEditModal
          game={game}
          onClose={() => setShowEditModal(false)}
          onGameUpdated={onGameUpdated}
        />
      )}

      {showHistoryModal && (
        <GameHistoryModal
          gameId={game.id}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
} 