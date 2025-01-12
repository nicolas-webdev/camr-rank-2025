import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { db } from '@/lib';
import { getRankByPoints } from '@/lib/ranking';
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
  legajo: z.number().int().positive(),
  realName: z.string().min(2).max(50),
  nationality: z.string().default("Argentina"),
  tenhouName: z.string().optional(),
  mahjongSoulName: z.string().optional(),
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

    return NextResponse.json(playersWithRank, {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

// POST requires authentication
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can create players' },
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }

    const body = await request.json();
    const validatedData = playerSchema.parse(body);

    // Check if player with nickname or legajo already exists
    const existingPlayer = await db.player.findFirst({
      where: {
        OR: [
          { nickname: validatedData.nickname },
          { legajo: validatedData.legajo }
        ]
      },
    });

    if (existingPlayer) {
      const field = existingPlayer.nickname === validatedData.nickname ? 'nickname' : 'legajo';
      return NextResponse.json(
        { error: `Player with this ${field} already exists` },
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    // Create new player
    const player = await db.player.create({
      data: {
        nickname: validatedData.nickname,
        legajo: validatedData.legajo,
        realName: validatedData.realName,
        nationality: validatedData.nationality,
        tenhouName: validatedData.tenhouName,
        mahjongSoulName: validatedData.mahjongSoulName,
        rating: 1500,
        points: 0,
        rank: "新人",
      },
    });

    return NextResponse.json(player, {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating player:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}