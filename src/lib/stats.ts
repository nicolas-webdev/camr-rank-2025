import { db } from '@/lib/prisma';
import { Game, Prisma } from '@prisma/client';

type PlayerStats = {
  totalGames: number;
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  fourthPlace: number;
  rentaiRate: number;
  avgPlacement: number;
  
  tonpuusenGames: number;
  tonpuusenFirst: number;
  tonpuusenSecond: number;
  tonpuusenThird: number;
  tonpuusenFourth: number;
  tonpuusenRentai: number;
  tonpuusenAvg: number;
  
  hanchanGames: number;
  hanchanFirst: number;
  hanchanSecond: number;
  hanchanThird: number;
  hanchanFourth: number;
  hanchanRentai: number;
  hanchanAvg: number;
};

export async function calculatePlayerStats(playerId: string): Promise<PlayerStats> {
  // Get all games for the player
  const games = await db.game.findMany({
    where: {
      OR: [
        { eastPlayerId: playerId },
        { southPlayerId: playerId },
        { westPlayerId: playerId },
        { northPlayerId: playerId },
      ],
      isDeleted: false,
    },
    include: {
      eastPlayer: true,
      southPlayer: true,
      westPlayer: true,
      northPlayer: true,
    },
  });

  // Initialize stats
  const stats: PlayerStats = {
    totalGames: 0,
    firstPlace: 0,
    secondPlace: 0,
    thirdPlace: 0,
    fourthPlace: 0,
    rentaiRate: 0,
    avgPlacement: 0,
    
    tonpuusenGames: 0,
    tonpuusenFirst: 0,
    tonpuusenSecond: 0,
    tonpuusenThird: 0,
    tonpuusenFourth: 0,
    tonpuusenRentai: 0,
    tonpuusenAvg: 0,
    
    hanchanGames: 0,
    hanchanFirst: 0,
    hanchanSecond: 0,
    hanchanThird: 0,
    hanchanFourth: 0,
    hanchanRentai: 0,
    hanchanAvg: 0,
  };

  // Process each game
  games.forEach((game: Game & { 
    eastPlayer: { id: string };
    southPlayer: { id: string };
    westPlayer: { id: string };
    northPlayer: { id: string };
  }) => {
    const scores = [
      { playerId: game.eastPlayerId, score: game.eastScore },
      { playerId: game.southPlayerId, score: game.southScore },
      { playerId: game.westPlayerId, score: game.westScore },
      { playerId: game.northPlayerId, score: game.northScore },
    ].sort((a, b) => b.score - a.score);

    const playerPosition = scores.findIndex(s => s.playerId === playerId) + 1;
    
    // Update total stats
    stats.totalGames++;
    switch (playerPosition) {
      case 1:
        stats.firstPlace++;
        break;
      case 2:
        stats.secondPlace++;
        break;
      case 3:
        stats.thirdPlace++;
        break;
      case 4:
        stats.fourthPlace++;
        break;
    }

    // Update game type specific stats
    if (game.isHanchan) {
      stats.hanchanGames++;
      switch (playerPosition) {
        case 1:
          stats.hanchanFirst++;
          break;
        case 2:
          stats.hanchanSecond++;
          break;
        case 3:
          stats.hanchanThird++;
          break;
        case 4:
          stats.hanchanFourth++;
          break;
      }
    } else {
      stats.tonpuusenGames++;
      switch (playerPosition) {
        case 1:
          stats.tonpuusenFirst++;
          break;
        case 2:
          stats.tonpuusenSecond++;
          break;
        case 3:
          stats.tonpuusenThird++;
          break;
        case 4:
          stats.tonpuusenFourth++;
          break;
      }
    }
  });

  // Calculate averages and rates
  stats.rentaiRate = stats.totalGames > 0 
    ? ((stats.firstPlace + stats.secondPlace) / stats.totalGames) * 100 
    : 0;
  stats.avgPlacement = stats.totalGames > 0
    ? (stats.firstPlace + stats.secondPlace * 2 + stats.thirdPlace * 3 + stats.fourthPlace * 4) / stats.totalGames
    : 0;

  stats.hanchanRentai = stats.hanchanGames > 0
    ? ((stats.hanchanFirst + stats.hanchanSecond) / stats.hanchanGames) * 100
    : 0;
  stats.hanchanAvg = stats.hanchanGames > 0
    ? (stats.hanchanFirst + stats.hanchanSecond * 2 + stats.hanchanThird * 3 + stats.hanchanFourth * 4) / stats.hanchanGames
    : 0;

  stats.tonpuusenRentai = stats.tonpuusenGames > 0
    ? ((stats.tonpuusenFirst + stats.tonpuusenSecond) / stats.tonpuusenGames) * 100
    : 0;
  stats.tonpuusenAvg = stats.tonpuusenGames > 0
    ? (stats.tonpuusenFirst + stats.tonpuusenSecond * 2 + stats.tonpuusenThird * 3 + stats.tonpuusenFourth * 4) / stats.tonpuusenGames
    : 0;

  // Update stats in database
  await db.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.stats.upsert({
      where: {
        playerId,
      },
      create: {
        playerId,
        ...stats,
      },
      update: stats,
    });
  });

  return stats;
}

export async function updatePlayerRating(
  playerId: string,
  gameId: string,
  newRating: number,
  change: number
) {
  await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const player = await tx.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new Error('Player not found');
    }

    const oldRating = player.rating;

    // Update player rating
    await tx.player.update({
      where: { id: playerId },
      data: {
        rating: newRating,
      },
    });

    // Get or create stats record
    const stats = await tx.stats.upsert({
      where: {
        playerId,
      },
      create: {
        playerId,
      },
      update: {},
    });

    // Record rating change
    await tx.ratingChange.create({
      data: {
        statsId: stats.id,
        oldRating,
        newRating,
        change,
        gameId,
      },
    });
  });
}

export async function recalculateAllStats() {
  const players = await db.player.findMany();
  
  for (const player of players) {
    await calculatePlayerStats(player.id);
  }
} 