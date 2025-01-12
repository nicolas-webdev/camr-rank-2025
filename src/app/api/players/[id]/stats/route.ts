import { db } from '@/lib/prisma';
import { calculatePlayerStats } from '@/lib/stats';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = params.id;

    // Get player with stats
    const player = await db.player.findUnique({
      where: { id: playerId },
      include: {
        stats: {
          include: {
            ratingHistory: {
              orderBy: {
                date: 'desc'
              },
              take: 10
            }
          }
        }
      }
    });

    if (!player) {
      return new NextResponse('Player not found', { status: 404 });
    }

    // If stats don't exist or need to be recalculated
    if (!player.stats) {
      const stats = await calculatePlayerStats(playerId);
      return NextResponse.json(stats);
    }

    return NextResponse.json(player.stats);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
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