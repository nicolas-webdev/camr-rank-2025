export interface RankInfo {
  kanji: string;
  name: string;
  pointsToNextRank: number;
  canDemote: boolean;
  totalPointsRequired: number;
  minimumPoints: number;
  pointVariation: {
    hanchan: {
      first: number;
      second: number;
      third: number;
      fourth: number;
    };
    tonpuusen: {
      first: number;
      second: number;
      third: number;
      fourth: number;
    };
  };
}

export type GameType = 'hanchan' | 'tonpuusen';
export type Position = 'first' | 'second' | 'third' | 'fourth';

// New types for other sheets
export interface Player {
  id: string;
  name: string;
  currentRank: RankInfo;
  currentPoints: number;
  totalGamesPlayed: number;
  joinDate: Date;
}

export interface GameResult {
  id: string;
  date: Date;
  gameType: GameType;
  players: {
    playerId: string;
    position: Position;
    pointsEarned: number;
    finalScore: number;
    rankChange?: {
      from: string;
      to: string;
      pointsBeforeGame: number;
      pointsAfterGame: number;
    };
  }[];
}

export interface PlayerStats {
  playerId: string;
  totalGames: number;
  positions: {
    first: number;
    second: number;
    third: number;
    fourth: number;
  };
  averagePosition: number;
  averagePoints: number;
  highestScore: number;
  lowestScore: number;
} 