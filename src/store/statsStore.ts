'use client';

import { create } from 'zustand';
import { PlayerStats } from '../types/ranking';
import { api } from '../services/api';

interface StatsState {
  playerStats: Record<string, PlayerStats>;
  isLoading: boolean;
  error: string | null;
}

interface StatsActions {
  fetchPlayerStats: (playerId: string) => Promise<void>;
  updateStats: (playerId: string) => Promise<void>;
}

type StatsStore = StatsState & StatsActions;

export const useStatsStore = create<StatsStore>()((set, get) => ({
  playerStats: {},
  isLoading: false,
  error: null,
  
  fetchPlayerStats: async (playerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await api.getPlayerStats(playerId);
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          [playerId]: stats
        },
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to fetch player stats', isLoading: false });
    }
  },
  
  updateStats: async (playerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await api.getPlayerStats(playerId);
      set((state) => ({
        playerStats: {
          ...state.playerStats,
          [playerId]: stats
        },
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update player stats', isLoading: false });
    }
  }
})); 