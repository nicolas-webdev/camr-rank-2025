import { z } from 'zod';

export const playerSchema = z.object({
  legajo: z.string().min(1, 'Legajo is required'),
  nickname: z.string().min(2, 'Nickname must be at least 2 characters'),
  realName: z.string().optional(),
  nationality: z.string().default('Argentina'),
  tenhouName: z.string().optional(),
  mahjongSoulName: z.string().optional(),
});

export const gameResultSchema = z.object({
  gameType: z.enum(['hanchan', 'tonpuusen'] as const),
  results: z.array(
    z.object({
      playerId: z.string().uuid(),
      position: z.enum(['first', 'second', 'third', 'fourth'] as const),
      score: z.number().int().min(-100000).max(100000),
    })
  ).length(4),
});

export const playerIdSchema = z.object({
  playerId: z.string().uuid(),
});

export const statsSchema = z.object({
  totalGames: z.number().int().min(0),
  firstPlace: z.number().int().min(0),
  secondPlace: z.number().int().min(0),
  thirdPlace: z.number().int().min(0),
  fourthPlace: z.number().int().min(0),
  rentaiRate: z.number().min(0).max(100),
  avgPlacement: z.number().min(1).max(4),
  
  // Game type specific stats
  tonpuusenGames: z.number().int().min(0),
  tonpuusenFirst: z.number().int().min(0),
  tonpuusenSecond: z.number().int().min(0),
  tonpuusenThird: z.number().int().min(0),
  tonpuusenFourth: z.number().int().min(0),
  tonpuusenRentai: z.number().min(0).max(100),
  tonpuusenAvg: z.number().min(1).max(4),
  
  hanchanGames: z.number().int().min(0),
  hanchanFirst: z.number().int().min(0),
  hanchanSecond: z.number().int().min(0),
  hanchanThird: z.number().int().min(0),
  hanchanFourth: z.number().int().min(0),
  hanchanRentai: z.number().min(0).max(100),
  hanchanAvg: z.number().min(1).max(4),
}); 