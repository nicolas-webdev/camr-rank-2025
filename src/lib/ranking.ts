import type { Prisma } from '@prisma/client';

export interface RankInfo {
  kanji: string;
  translation: string;
  pointsToNextRank: number | null;
  pointsToDropRank: number | null | false;
  pointsForPosition: {
    hanchan: [number, number, number, number];
    tonpuusen: [number, number, number, number];
  };
}

export type Position = 'east' | 'south' | 'west' | 'north';

export const ranks: RankInfo[] = [
  {
    kanji: '新人',
    translation: 'Beginner',
    pointsToNextRank: 50,
    pointsToDropRank: null,
    pointsForPosition: {
      hanchan: [60, 30, 0, 0],
      tonpuusen: [40, 20, 0, 0]
    }
  },
  {
    kanji: '9級',
    translation: '9 Kyu',
    pointsToNextRank: 50,
    pointsToDropRank: null,
    pointsForPosition: {
      hanchan: [60, 30, 0, 0],
      tonpuusen: [40, 20, 0, 0]
    }
  },
  {
    kanji: '8級',
    translation: '8 Kyu',
    pointsToNextRank: 100,
    pointsToDropRank: null,
    pointsForPosition: {
      hanchan: [60, 30, 0, 0],
      tonpuusen: [40, 20, 0, 0]
    }
  },
  {
    kanji: '7級',
    translation: '7 Kyu',
    pointsToNextRank: 100,
    pointsToDropRank: null,
    pointsForPosition: {
      hanchan: [60, 30, 0, 0],
      tonpuusen: [40, 20, 0, 0]
    }
  },
  {
    kanji: '6級',
    translation: '6 Kyu',
    pointsToNextRank: 100,
    pointsToDropRank: null,
    pointsForPosition: {
      hanchan: [60, 30, 0, 0],
      tonpuusen: [40, 20, 0, 0]
    }
  },
  {
    kanji: '5級',
    translation: '5 Kyu',
    pointsToNextRank: 100,
    pointsToDropRank: null,
    pointsForPosition: {
      hanchan: [60, 30, 0, 0],
      tonpuusen: [40, 20, 0, 0]
    }
  },
  {
    kanji: '4級',
    translation: '4 Kyu',
    pointsToNextRank: 100,
    pointsToDropRank: null,
    pointsForPosition: {
      hanchan: [60, 30, 0, 0],
      tonpuusen: [40, 20, 0, 0]
    }
  },
  {
    kanji: '3級',
    translation: '3 Kyu',
    pointsToNextRank: 100,
    pointsToDropRank: null,
    pointsForPosition: {
      hanchan: [60, 30, 0, 0],
      tonpuusen: [40, 20, 0, 0]
    }
  },
  {
    kanji: '2級',
    translation: '2 Kyu',
    pointsToNextRank: 150,
    pointsToDropRank: null,
    pointsForPosition: {
      hanchan: [60, 30, 0, -30],
      tonpuusen: [40, 20, 0, -20]
    }
  },
  {
    kanji: '1級',
    translation: '1 Kyu',
    pointsToNextRank: 150,
    pointsToDropRank: null,
    pointsForPosition: {
      hanchan: [60, 30, 0, -30],
      tonpuusen: [40, 20, 0, -20]
    }
  },
  {
    kanji: '初段',
    translation: '1 Dan',
    pointsToNextRank: 200,
    pointsToDropRank: false,
    pointsForPosition: {
      hanchan: [60, 30, 0, -30],
      tonpuusen: [40, 20, 0, -20]
    }
  },
  {
    kanji: '二段',
    translation: '2 Dan',
    pointsToNextRank: 400,
    pointsToDropRank: 1200,
    pointsForPosition: {
      hanchan: [60, 30, 0, -30],
      tonpuusen: [40, 20, 0, -20]
    }
  },
  {
    kanji: '三段',
    translation: '3 Dan',
    pointsToNextRank: 400,
    pointsToDropRank: 1600,
    pointsForPosition: {
      hanchan: [60, 30, 0, -30],
      tonpuusen: [40, 20, 0, -20]
    }
  },
  {
    kanji: '四段',
    translation: '4 Dan',
    pointsToNextRank: 600,
    pointsToDropRank: 2000,
    pointsForPosition: {
      hanchan: [60, 30, -15, -45],
      tonpuusen: [40, 20, -10, -30]
    }
  },
  {
    kanji: '五段',
    translation: '5 Dan',
    pointsToNextRank: 600,
    pointsToDropRank: 2600,
    pointsForPosition: {
      hanchan: [60, 30, -15, -45],
      tonpuusen: [40, 20, -10, -30]
    }
  },
  {
    kanji: '六段',
    translation: '6 Dan',
    pointsToNextRank: 800,
    pointsToDropRank: 3200,
    pointsForPosition: {
      hanchan: [60, 30, -15, -45],
      tonpuusen: [40, 20, -10, -30]
    }
  },
  {
    kanji: '七段',
    translation: '7 Dan',
    pointsToNextRank: 1000,
    pointsToDropRank: 4000,
    pointsForPosition: {
      hanchan: [60, 30, -30, -60],
      tonpuusen: [40, 20, -20, -40]
    }
  },
  {
    kanji: '八段',
    translation: '8 Dan',
    pointsToNextRank: 1000,
    pointsToDropRank: 5000,
    pointsForPosition: {
      hanchan: [60, 30, -30, -60],
      tonpuusen: [40, 20, -20, -40]
    }
  },
  {
    kanji: '九段',
    translation: '9 Dan',
    pointsToNextRank: 1500,
    pointsToDropRank: 6000,
    pointsForPosition: {
      hanchan: [60, 30, -30, -75],
      tonpuusen: [40, 20, -20, -50]
    }
  },
  {
    kanji: '十段',
    translation: '10 Dan',
    pointsToNextRank: 1500,
    pointsToDropRank: 7500,
    pointsForPosition: {
      hanchan: [60, 30, -45, -75],
      tonpuusen: [40, 20, -30, -50]
    }
  },
  {
    kanji: '神室王',
    translation: 'Rey Dios',
    pointsToNextRank: null,
    pointsToDropRank: false,
    pointsForPosition: {
      hanchan: [60, 30, -30, -60],
      tonpuusen: [40, 20, -20, -40]
    }
  }
];

// Rank thresholds and requirements
const RANK_THRESHOLDS = {
  '新人': { min: 0, next: 50, title: 'Beginner' },
  '9級': { min: 50, next: 100, title: '9th Kyu' },
  '8級': { min: 100, next: 200, title: '8th Kyu' },
  '7級': { min: 200, next: 300, title: '7th Kyu' },
  '6級': { min: 300, next: 400, title: '6th Kyu' },
  '5級': { min: 400, next: 500, title: '5th Kyu' },
  '4級': { min: 500, next: 600, title: '4th Kyu' },
  '3級': { min: 600, next: 700, title: '3rd Kyu' },
  '2級': { min: 700, next: 850, title: '2nd Kyu' },
  '1級': { min: 850, next: 1000, title: '1st Kyu' },
  '初段': { min: 1000, next: 1200, title: '1st Dan' },
  '二段': { min: 1200, next: 1600, title: '2nd Dan' },
  '三段': { min: 1600, next: 2000, title: '3rd Dan' },
  '四段': { min: 2000, next: 2600, title: '4th Dan' },
  '五段': { min: 2600, next: 3200, title: '5th Dan' },
  '六段': { min: 3200, next: 4000, title: '6th Dan' },
  '七段': { min: 4000, next: 5000, title: '7th Dan' },
  '八段': { min: 5000, next: 6000, title: '8th Dan' },
  '九段': { min: 6000, next: 7500, title: '9th Dan' },
  '十段': { min: 7500, next: 9000, title: '10th Dan' },
  '神室王': { min: 9000, next: null, title: 'Rey Dios' }
};

export type RankTitle = keyof typeof RANK_THRESHOLDS;

/**
 * Calculate the progress to the next rank and points needed
 */
export function calculateRankProgress(points: number, currentRank: RankTitle) {
  const rankInfo = RANK_THRESHOLDS[currentRank];
  
  // If at max rank, return 100% progress
  if (rankInfo.next === null) {
    return {
      progress: 100,
      pointsNeeded: 0,
    };
  }

  const pointsInCurrentRank = points - rankInfo.min;
  const pointsNeededForNextRank = rankInfo.next - rankInfo.min;
  const progress = (pointsInCurrentRank / pointsNeededForNextRank) * 100;
  const pointsNeeded = rankInfo.next - points;

  return {
    progress: Math.min(Math.max(progress, 0), 100),
    pointsNeeded: Math.max(pointsNeeded, 0),
  };
}

/**
 * Get the rank title for a given number of points
 */
export function getRankByPoints(points: number): RankTitle {
  const ranks = Object.entries(RANK_THRESHOLDS) as [RankTitle, typeof RANK_THRESHOLDS[RankTitle]][];
  
  for (let i = ranks.length - 1; i >= 0; i--) {
    const [rank, info] = ranks[i];
    if (points >= info.min) {
      return rank;
    }
  }

  return '新人';
}

/**
 * Check if a player should drop rank based on their points
 */
export function shouldDropRank(points: number, currentRank: RankTitle): boolean {
  const rankInfo = RANK_THRESHOLDS[currentRank];
  return points < rankInfo.min;
}

/**
 * Get the next rank title
 */
export function getNextRank(currentRank: RankTitle): RankTitle | null {
  const ranks = Object.keys(RANK_THRESHOLDS) as RankTitle[];
  const currentIndex = ranks.indexOf(currentRank);
  
  if (currentIndex === ranks.length - 1) {
    return null;
  }

  return ranks[currentIndex + 1];
}

/**
 * Get the previous rank title
 */
export function getPreviousRank(currentRank: RankTitle): RankTitle | null {
  const ranks = Object.keys(RANK_THRESHOLDS) as RankTitle[];
  const currentIndex = ranks.indexOf(currentRank);
  
  if (currentIndex === 0) {
    return null;
  }

  return ranks[currentIndex - 1];
}

/**
 * Get the English title for a rank
 */
export function getRankTitle(rank: RankTitle): string {
  return RANK_THRESHOLDS[rank].title;
}

/**
 * Calculate points needed for next rank
 */
export function getPointsToNextRank(currentRank: RankTitle): number | null {
  const nextRank = getNextRank(currentRank);
  if (!nextRank) {
    return null;
  }

  return RANK_THRESHOLDS[nextRank].min - RANK_THRESHOLDS[currentRank].min;
}

/**
 * Get all rank information
 */
export function getAllRanks() {
  return Object.entries(RANK_THRESHOLDS).map(([rank, info]) => ({
    rank: rank as RankTitle,
    ...info,
  }));
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
      rank: newRank
    }
  });
}

export function calculatePointsForPosition(position: Position | number, isHanchan: boolean, currentRank: RankTitle): number {
  const rankInfo = ranks.find(rank => rank.kanji === currentRank);
  if (!rankInfo) {
    console.error(`Invalid rank: ${currentRank}. Using default rank '新人'. Valid ranks are: ${ranks.map(r => r.kanji).join(', ')}`);
    return ranks[0].pointsForPosition[isHanchan ? 'hanchan' : 'tonpuusen'][
      typeof position === 'number' ? position : ['east', 'south', 'west', 'north'].indexOf(position)
    ];
  }

  const positionIndex = typeof position === 'number' ? position : ['east', 'south', 'west', 'north'].indexOf(position);
  if (positionIndex === -1) {
    throw new Error(`Invalid position: ${position}. Position must be one of: east, south, west, north, or a number 0-3`);
  }

  return isHanchan ? rankInfo.pointsForPosition.hanchan[positionIndex] : rankInfo.pointsForPosition.tonpuusen[positionIndex];
}

export function calculateGameRankInfo(game: { 
  isHanchan: boolean; 
  eastPlayerId: string; 
  southPlayerId: string; 
  westPlayerId: string; 
  northPlayerId: string; 
  eastScore: number; 
  southScore: number; 
  westScore: number; 
  northScore: number;
}) {
  const positions = [
    { playerId: game.eastPlayerId, position: 'east' as Position, score: game.eastScore, seatIndex: 0 },
    { playerId: game.southPlayerId, position: 'south' as Position, score: game.southScore, seatIndex: 1 },
    { playerId: game.westPlayerId, position: 'west' as Position, score: game.westScore, seatIndex: 2 },
    { playerId: game.northPlayerId, position: 'north' as Position, score: game.northScore, seatIndex: 3 }
  ];

  // Sort by score first, then by seat position ONLY for exact ties
  positions.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (scoreDiff !== 0) {
      return scoreDiff;
    }
    // Only use seat position as tiebreaker for exact ties
    return a.seatIndex - b.seatIndex;
  });

  // Map each position to its rank information
  return positions.map((pos, index) => ({
    playerId: pos.playerId,
    position: pos.position,
    score: pos.score,
    rank: index + 1,
    points: calculatePointsForPosition(index, game.isHanchan, '新人') // Use beginner rank for initial calculations
  }));
}

export async function recalculateAllPoints(tx: Prisma.TransactionClient) {
  // Get all players
  const players = await tx.player.findMany();
  
  // Reset all players' points to 0 and rank to 新人
  await Promise.all(
    players.map((player) =>
      tx.player.update({
        where: { id: player.id },
        data: {
          points: 0,
          rank: '新人'
        }
      })
    )
  );

  // Get all non-deleted games, ordered by date
  const games = await tx.game.findMany({
    where: {
      isDeleted: false
    },
    orderBy: {
      date: 'asc'
    }
  });

  // Replay each game in chronological order
  for (const game of games) {
    const positions = [
      { playerId: game.eastPlayerId, score: game.eastScore },
      { playerId: game.southPlayerId, score: game.southScore },
      { playerId: game.westPlayerId, score: game.westScore },
      { playerId: game.northPlayerId, score: game.northScore },
    ].sort((a, b) => b.score - a.score);

    // Update each player's points based on their position
    for (let i = 0; i < positions.length; i++) {
      const { playerId } = positions[i];
      
      // Get player's current points before updating
      const player = await tx.player.findUnique({
        where: { id: playerId }
      });

      if (!player) continue;

      // Calculate points based on current rank and position
      const pointsChange = calculatePointsForPosition(i, game.isHanchan, player.rank as RankTitle);
      const newPoints = player.points + pointsChange;
      const newRank = getRankByPoints(newPoints);

      // Update player's points and rank
      await tx.player.update({
        where: { id: playerId },
        data: {
          points: newPoints,
          rank: newRank
        }
      });
    }
  }
} 