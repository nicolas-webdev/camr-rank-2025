export type Player = {
  id: string;
  nickname: string;
};

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
}

export interface GameFormData {
  id: string;
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