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

  const handleGameUpdate = async (gameData: GameFormData) => {
    try {
      const response = await fetch(`/api/games/${game.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error('Failed to update game');
      }

      onGameUpdated();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="text-indigo-600 hover:text-indigo-900"
      >
        Edit
      </button>
      <button
        onClick={() => setShowHistoryModal(true)}
        className="text-indigo-600 hover:text-indigo-900"
      >
        History
      </button>

      <GameEditModal
        game={{
          ...game,
          date: game.date.toISOString()
        }}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
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