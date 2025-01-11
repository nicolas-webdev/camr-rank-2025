'use client';

import * as React from 'react';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PlayerSelect } from './PlayerSelect';
import type { Game, GameFormData } from '@/types/game';

interface GameEditModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
  onSave: (game: GameFormData) => void;
}

export function GameEditModal({ game, isOpen, onClose, onSave }: GameEditModalProps) {
  const [gameData, setGameData] = useState<GameFormData>({
    id: game.id,
    date: game.date,
    isHanchan: game.isHanchan,
    eastPlayerId: game.eastPlayerId,
    eastScore: game.eastScore,
    southPlayerId: game.southPlayerId,
    southScore: game.southScore,
    westPlayerId: game.westPlayerId,
    westScore: game.westScore,
    northPlayerId: game.northPlayerId,
    northScore: game.northScore,
  });
  const [error, setError] = useState<string>('');

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
    onSave(gameData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">Edit Game</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="datetime-local"
                  value={gameData.date.slice(0, 16)} // Format: YYYY-MM-DDThh:mm
                  onChange={(e) =>
                    setGameData({
                      ...gameData,
                      date: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
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

            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 