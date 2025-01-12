export type User = {
  name: string | null;
  email: string | null;
};

export type Player = {
  id: string;
  nickname: string;
  points?: number;
  rank?: string;
  rating?: number;
};

export interface RatingChange {
  statsId: string;
  oldRating: number;
  newRating: number;
  change: number;
  oldRank: string;
  newRank: string;
  pointsToNextRank: number;
}

export interface Game {
  id: string;
  date: string;
  isHanchan: boolean;
  eastPlayerId: string;
  eastPlayer: Player;
  eastScore: number;
  southPlayerId: string;
  southPlayer: Player;
  southScore: number;
  westPlayerId: string;
  westPlayer: Player;
  westScore: number;
  northPlayerId: string;
  northPlayer: Player;
  northScore: number;
  isDeleted: boolean;
  createdAt: string;
  createdBy: User;
  updatedAt: string;
  updatedBy: User | null;
  deletedAt: string | null;
  deletedBy: User | null;
  ratingChanges?: RatingChange[];
}

export interface GameFormData {
  id: string;
  date: string;
  isHanchan: boolean;
  eastPlayerId: string;
  eastScore: number;
  southPlayerId: string;
  southScore: number;
  westPlayerId: string;
  westScore: number;
  northPlayerId: string;
  northScore: number;
} 