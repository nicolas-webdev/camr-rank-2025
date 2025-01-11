'use client';

import { create } from 'zustand';

type Game = {
  id: string;
  date: Date;
  eastPlayerId: string;
  eastScore: number;
  southPlayerId: string;
  southScore: number;
  westPlayerId: string;
  westScore: number;
  northPlayerId: string;
  northScore: number;
};

type GameStore = {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
  addGame: (gameData: Omit<Game, 'id' | 'date'>) => Promise<void>;
};

export const useGameStore = create<GameStore>((set) => ({
  games: [],
  isLoading: false,
  error: null,

  fetchGames: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/games');
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const games = await response.json();
      set({ games, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch games',
        isLoading: false,
      });
    }
  },

  addGame: async (gameData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const newGame = await response.json();
      set((state) => ({
        games: [newGame, ...state.games],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create game',
        isLoading: false,
      });
    }
  },
})); 