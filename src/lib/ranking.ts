import { PrismaClient } from '@prisma/client';

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
    pointsToDropRank: 0,
    pointsForPosition: {
      hanchan: [30, 10, -10, -30],
      tonpuusen: [20, 5, -5, -20]
    }
  },
  {
    kanji: '9級',
    translation: '9 Kyu',
    pointsToNextRank: 40,
    pointsToDropRank: 20,
    pointsForPosition: {
      hanchan: [30, 10, -10, -30],
      tonpuusen: [20, 5, -5, -20]
    }
  }
];

export function getRankByPoints(points: number): RankInfo {
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (points >= ranks[i].pointsToDropRank) {
      return ranks[i];
    }
  }
  return ranks[0];
}

export function calculatePointsForPosition(position: Position | number, isHanchan: boolean, currentRank: RankInfo | string | number): number {
  const rankInfo = typeof currentRank === 'string' || typeof currentRank === 'number' 
    ? getRankByPoints(typeof currentRank === 'number' ? currentRank : 0) 
    : currentRank;
  const positionIndex = typeof position === 'number' ? position : ['east', 'south', 'west', 'north'].indexOf(position);
  return isHanchan ? rankInfo.pointsForPosition.hanchan[positionIndex] : rankInfo.pointsForPosition.tonpuusen[positionIndex];
}

export function shouldDropRank(currentRank: RankInfo, points: number): boolean {
  return points <= currentRank.pointsToDropRank;
}

export async function updatePlayerRank(tx: PrismaClient, playerId: string, pointsChange: number): Promise<void> {
  const player = await tx.player.findUnique({
    where: { id: playerId },
    select: { points: true }
  });

  if (!player) return;

  const newPoints = player.points + pointsChange;
  const newRank = getRankByPoints(newPoints);

  await tx.player.update({
    where: { id: playerId },
    data: {
      points: newPoints,
      rank: newRank.kanji,
    },
  });
}

interface Game {
  eastScore: number;
  southScore: number;
  westScore: number;
  northScore: number;
  isHanchan: boolean;
}

export function calculateGameRankInfo(game: Game) {
  const positions = [
    { position: 'east' as Position, score: game.eastScore, seatIndex: 0 },
    { position: 'south' as Position, score: game.southScore, seatIndex: 1 },
    { position: 'west' as Position, score: game.westScore, seatIndex: 2 },
    { position: 'north' as Position, score: game.northScore, seatIndex: 3 }
  ];

  // Sort by score first, then by seat position (closer to east wins ties)
  positions.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return a.seatIndex - b.seatIndex;
  });

  return positions.map((pos, index) => ({
    position: pos.position,
    score: pos.score,
    rank: index + 1,
    points: calculatePointsForPosition(index, game.isHanchan, getRankByPoints(0))
  }));
} 