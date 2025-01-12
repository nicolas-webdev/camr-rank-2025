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

export function getRankByPoints(points: number): RankInfo {
  // If points are negative, return beginner rank
  if (points < 0) {
    return ranks[0];
  }

  let cumulativePoints = 0;
  
  // Loop through ranks to find where the points fall
  for (let i = 0; i < ranks.length - 1; i++) {
    const currentRank = ranks[i];
    
    // Skip if this rank has no progression
    if (currentRank.pointsToNextRank === null) {
      return currentRank;
    }
    
    // Calculate points needed for next rank
    cumulativePoints += currentRank.pointsToNextRank;
    
    // If we haven't reached enough points for the next rank, stay at current rank
    if (points < cumulativePoints) {
      return currentRank;
    }
  }
  
  // If we've accumulated enough points for the highest rank, return it
  return ranks[ranks.length - 1];
}

export function shouldDropRank(points: number, currentRank: RankInfo): boolean {
  // Never drop rank if pointsToDropRank is null or false
  if (currentRank.pointsToDropRank === null || currentRank.pointsToDropRank === false) {
    return false;
  }
  
  return points <= currentRank.pointsToDropRank;
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
      const pointsChange = calculatePointsForPosition(i, game.isHanchan, player.rank);
      const newPoints = player.points + pointsChange;
      const newRank = getRankByPoints(newPoints);

      // Update player's points and rank
      await tx.player.update({
        where: { id: playerId },
        data: {
          points: newPoints,
          rank: newRank.kanji
        }
      });
    }
  }
} 