'use client';

import React, { useState } from 'react';
import GameHistoryModal from './GameHistoryModal';
import { GameEditModal } from './GameEditModal';
import type { Game, GameFormData } from '@/types/game';

type GameActionsProps = {
  game: Game;
  onGameUpdated: () => void;
  hideHistoryButton?: boolean;
};

type GameUpdateData = GameFormData;

export default function GameActions({ game, onGameUpdated, hideHistoryButton }: GameActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/games/${game.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      onGameUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete game');
    }
  };

  const handleRestore = async () => {
    try {
      const response = await fetch(`/api/games/${game.id}/restore`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to restore game');
      }

      onGameUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore game');
    }
  };

  const handleGameUpdate = async (updatedGame: GameUpdateData) => {
    try {
      const response = await fetch(`/api/games/${game.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGame),
      });

      if (!response.ok) {
        throw new Error('Failed to update game');
      }

      onGameUpdated();
      setIsEditModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update game');
    }
  };

  return (
    <div className="flex space-x-2">
      {!hideHistoryButton && (
        <button
          onClick={() => setShowHistoryModal(true)}
          className="text-indigo-600 hover:text-indigo-900"
          title="View history"
        >
          📜
        </button>
      )}
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="text-indigo-600 hover:text-indigo-900"
        title="Edit game"
      >
        ✏️
      </button>
      {game.isDeleted ? (
        <button
          onClick={handleRestore}
          className="text-green-600 hover:text-green-900"
          title="Restore game"
        >
          ♻️
        </button>
      ) : (
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-900"
          title="Delete game"
        >
          🗑️
        </button>
      )}

      {error && (
        <span className="text-red-600 text-sm">{error}</span>
      )}

      <GameEditModal
        game={game}
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