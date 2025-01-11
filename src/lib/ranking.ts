import type { Prisma } from '@prisma/client';

export interface RankInfo {
  kanji: string;
  translation: string;
  pointsToNextRank: number;
  pointsToDropRank: number;
  pointsForPosition: {
    hanchan: number[];
    tonpuusen: number[];
  };
}

export type Position = 'east' | 'south' | 'west' | 'north';

const ranks: RankInfo[] = [
  {
    kanji: '新人',
    translation: 'Beginner',
    pointsToNextRank: 30,
    pointsToDropRank: -30,
    pointsForPosition: {
      hanchan: [15, 5, -5, -15],
      tonpuusen: [10, 3, -3, -10],
    },
  },
  {
    kanji: '9級',
    translation: '9 Kyu',
    pointsToNextRank: 40,
    pointsToDropRank: -40,
    pointsForPosition: {
      hanchan: [20, 7, -7, -20],
      tonpuusen: [13, 4, -4, -13],
    },
  },
  // ... other ranks
];

export function getRankByPoints(points: number): RankInfo {
  // Start from the highest rank and work down
  for (let i = ranks.length - 1; i >= 0; i--) {
    const rank = ranks[i];
    const prevRank = ranks[i - 1];
    if (!prevRank || points >= prevRank.pointsToNextRank) {
      return rank;
    }
  }
  return ranks[0]; // Default to beginner rank
}

export function shouldDropRank(points: number, currentRank: string): boolean {
  const rankInfo = ranks.find(rank => rank.kanji === currentRank);
  if (!rankInfo) return false;
  return points <= rankInfo.pointsToDropRank;
}

export async function updatePlayerRank(tx: Prisma.TransactionClient, playerId: string, pointsChange: number): Promise<void> {
  const player = await tx.player.findUnique({
    where: { id: playerId },
    select: { points: true, rank: true }
  });

  if (!player) return;

  const newPoints = player.points + pointsChange;
  const newRank = getRankByPoints(newPoints);

  await tx.player.update({
    where: { id: playerId },
    data: {
      points: newPoints,
      rank: newRank.kanji
    }
  });
}

export function calculatePointsForPosition(position: Position | number, isHanchan: boolean, currentRank: string): number {
  const rankInfo = ranks.find(rank => rank.kanji === currentRank);
  if (!rankInfo) return 0;

  const positionIndex = typeof position === 'number' ? position : ['east', 'south', 'west', 'north'].indexOf(position);
  if (positionIndex === -1) return 0;

  return isHanchan ? rankInfo.pointsForPosition.hanchan[positionIndex] : rankInfo.pointsForPosition.tonpuusen[positionIndex];
}

export function calculateGameRankInfo(game: { isHanchan: boolean; eastPlayerId: string; southPlayerId: string; westPlayerId: string; northPlayerId: string; eastScore: number; southScore: number; westScore: number; northScore: number; }) {
  const scores = [
    { playerId: game.eastPlayerId, score: game.eastScore },
    { playerId: game.southPlayerId, score: game.southScore },
    { playerId: game.westPlayerId, score: game.westScore },
    { playerId: game.northPlayerId, score: game.northScore }
  ];

  // Sort by score in descending order
  scores.sort((a, b) => b.score - a.score);

  // Create a map of player positions (0-3, where 0 is first place)
  const positions = new Map<string, number>();
  scores.forEach((score, index) => {
    positions.set(score.playerId, index);
  });

  return positions;
} 