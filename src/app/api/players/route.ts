import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { db } from '@/lib';
import { getRankByPoints } from '@/lib/ranking';
import { authOptions } from '../auth/[...nextauth]/route';
import type { Session } from 'next-auth';

// Extend Session type to include id
interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

const playerSchema = z.object({
  nickname: z.string().min(2).max(30),
});

// GET is public - no authentication required
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const players = await db.player.findMany({
      where: search ? {
        nickname: {
          contains: search,
          mode: 'insensitive',
        },
      } : undefined,
      orderBy: {
        rating: 'desc',
      },
      take: search ? 5 : undefined,
      select: {
        id: true,
        nickname: true,
        rating: true,
        points: true,
        rank: true,
        _count: {
          select: {
            eastGames: {
              where: {
                isDeleted: false
              }
            },
            southGames: {
              where: {
                isDeleted: false
              }
            },
            westGames: {
              where: {
                isDeleted: false
              }
            },
            northGames: {
              where: {
                isDeleted: false
              }
            },
          }
        }
      }
    });

    // Add rank info to each player
    const playersWithRank = players.map(player => {
      const totalGames = 
        player._count.eastGames + 
        player._count.southGames + 
        player._count.westGames + 
        player._count.northGames;

      return {
        ...player,
        gamesPlayed: totalGames,
        rankInfo: getRankByPoints(player.points)
      };
    });

    return NextResponse.json(playersWithRank);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST requires authentication
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Only admins can create players' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = playerSchema.parse(body);

    // Check if player with nickname already exists
    const existingPlayer = await db.player.findUnique({
      where: { nickname: validatedData.nickname },
    });

    if (existingPlayer) {
      return NextResponse.json({ error: 'Player with this nickname already exists' }, { status: 400 });
    }

    // Create new player
    const player = await db.player.create({
      data: {
        nickname: validatedData.nickname,
      },
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}