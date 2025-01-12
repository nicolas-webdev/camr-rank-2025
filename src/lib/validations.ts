import { z } from 'zod';

export const playerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
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