import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { calculatePlayerStats } from '@/lib/stats';
import type { Prisma } from '@prisma/client';

type GameWithRelations = Prisma.GameGetPayload<{
  include: {
    eastPlayer: true;
    southPlayer: true;
    westPlayer: true;
    northPlayer: true;
    createdBy: {
      select: { name: true }
    };
    updatedBy: {
      select: { name: true }
    };
  }
}>;

interface StatsResponse {
  totalGames: number;
  hanchanGames: number;
  tonpuusenGames: number;
  avgPlacement: number;
  rentaiRate: number;
  hanchanRentai: number;
  hanchanAvg: number;
  tonpuusenRentai: number;
  tonpuusenAvg: number;
  games: GameWithRelations[];
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: playerId } = await params;

    const gameInclude = {
      eastPlayer: true,
      southPlayer: true,
      westPlayer: true,
      northPlayer: true,
      createdBy: {
        select: { name: true }
      },
      updatedBy: {
        select: { name: true }
      }
    } satisfies Prisma.GameInclude;

    const playerInclude = {
      eastGames: {
        where: { isDeleted: false },
        include: gameInclude,
        orderBy: {
          date: 'desc'
        }
      },
      southGames: {
        where: { isDeleted: false },
        include: gameInclude,
        orderBy: {
          date: 'desc'
        }
      },
      westGames: {
        where: { isDeleted: false },
        include: gameInclude,
        orderBy: {
          date: 'desc'
        }
      },
      northGames: {
        where: { isDeleted: false },
        include: gameInclude,
        orderBy: {
          date: 'desc'
        }
      }
    } satisfies Prisma.PlayerInclude;

    const player = await db.player.findUnique({
      where: { id: playerId },
      include: playerInclude
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    const stats = await calculatePlayerStats(playerId);
    
    // Combine all games and sort by date
    const allGames = [
      ...player.eastGames,
      ...player.southGames,
      ...player.westGames,
      ...player.northGames
    ].sort((a, b) => b.date.getTime() - a.date.getTime()) as GameWithRelations[];

    const response: StatsResponse = {
      ...stats,
      games: allGames
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player stats' },
      { status: 500 }
    );
  }
}

// Endpoint to force recalculation of stats
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = params.id;

    // Verify player exists
    const player = await db.player.findUnique({
      where: { id: playerId }
    });

    if (!player) {
      return new NextResponse('Player not found', { status: 404 });
    }

    // Recalculate stats
    const stats = await calculatePlayerStats(playerId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error recalculating player stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 