'use client';

import React, { useState } from 'react';
import { GameEditModal } from './GameEditModal';
import GameHistoryModal from './GameHistoryModal';
import type { Game, GameFormData } from '@/types/game';

type GameActionsProps = {
  game: Omit<Game, 'date'> & { date: Date };
  onGameUpdated: () => void;
};

export default function GameActions({ game, onGameUpdated }: GameActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGameUpdate = async (gameData: GameFormData) => {
    try {
      const response = await fetch(`/api/games/${game.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...gameData,
          id: game.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.error) {
          throw new Error(errorData.error);
        }
        throw new Error('Failed to update game');
      }

      onGameUpdated();
      setIsEditModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error updating game:', error);
      setError(error instanceof Error ? error.message : 'Failed to update game');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this game? This will revert all player points.')) {
      return;
    }

    try {
      const response = await fetch(`/api/games/${game.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.error) {
          throw new Error(errorData.error);
        }
        throw new Error('Failed to delete game');
      }

      onGameUpdated();
      setError(null);
    } catch (error) {
      console.error('Error deleting game:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete game');
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="text-indigo-600 hover:text-indigo-900"
        title="Edit game"
      >
        ✏️
      </button>
      <button
        onClick={() => setShowHistoryModal(true)}
        className="text-indigo-600 hover:text-indigo-900"
        title="View history"
      >
        📜
      </button>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-900"
        title="Delete game"
      >
        🗑️
      </button>

      {error && (
        <span className="text-red-600 text-sm">{error}</span>
      )}

      <GameEditModal
        game={{
          ...game,
          date: game.date.toISOString()
        }}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setError(null);
        }}
        onSave={handleGameUpdate}
      />

      {showHistoryModal && (
        <GameHistoryModal
          gameId={game.id}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
} 