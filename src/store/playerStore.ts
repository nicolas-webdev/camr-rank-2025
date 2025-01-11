'use client';

import { create } from 'zustand';
import { Player, RankInfo } from '../types/ranking';
import { RANKING_DATA } from '../data/rankingData';
import { api } from '../services/api';

interface PlayerState {
  players: Player[];
  isLoading: boolean;
  error: string | null;
}

interface PlayerActions {
  fetchPlayers: () => Promise<void>;
  addPlayer: (name: string) => Promise<void>;
  removePlayer: (id: string) => Promise<void>;
  updatePlayerRank: (playerId: string, newRank: RankInfo, newPoints: number) => void;
  updatePlayerGames: (playerId: string) => void;
}

type PlayerStore = PlayerState & PlayerActions;

export const usePlayerStore = create<PlayerStore>()((set) => ({
  players: [],
  isLoading: false,
  error: null,
  
  fetchPlayers: async () => {
    set({ isLoading: true, error: null });
    try {
      const players = await api.getPlayers();
      set({ players, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch players', isLoading: false });
    }
  },

  addPlayer: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const newPlayer = await api.addPlayer(name);
      set((state) => ({
        players: [...state.players, newPlayer],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add player', isLoading: false });
    }
  },

  removePlayer: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.deletePlayer(id);
      set((state) => ({
        players: state.players.filter((player) => player.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to remove player', isLoading: false });
    }
  },

  updatePlayerRank: (playerId: string, newRank: RankInfo, newPoints: number) => 
    set((state) => ({
      players: state.players.map((player) => 
        player.id === playerId
          ? { ...player, currentRank: newRank, currentPoints: newPoints }
          : player
      )
    })),

  updatePlayerGames: (playerId: string) => set((state) => ({
    players: state.players.map((player) =>
      player.id === playerId
        ? { ...player, totalGamesPlayed: player.totalGamesPlayed + 1 }
        : player
    )
  }))
})); 