import { Player, GameResult, PlayerStats, GameType, Position } from '@/types/ranking';

export const api = {
  // Player endpoints
  async getPlayers(): Promise<Player[]> {
    const response = await fetch('/api/players');
    return response.json();
  },

  async addPlayer(name: string): Promise<Player> {
    const response = await fetch('/api/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  async deletePlayer(id: string): Promise<void> {
    await fetch('/api/players', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
  },

  // Game endpoints
  async getGames(): Promise<GameResult[]> {
    const response = await fetch('/api/games');
    return response.json();
  },

  async addGame(gameData: {
    gameType: GameType;
    results: Array<{
      playerId: string;
      position: Position;
      score: number;
    }>;
  }): Promise<GameResult> {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });
    return response.json();
  },

  // Stats endpoints
  async getPlayerStats(playerId: string): Promise<PlayerStats> {
    const response = await fetch(`/api/stats/${playerId}`);
    return response.json();
  }
}; 