import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { db, recalculateAllPoints } from '@/lib';
import type { Session } from 'next-auth';
import type { Prisma } from '@prisma/client';

// Extend Session type to include id
interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

const gameSchema = z.object({
  date: z.string().datetime(),
  isHanchan: z.boolean(),
  eastPlayerId: z.string(),
  eastScore: z.number(),
  southPlayerId: z.string(),
  southScore: z.number(),
  westPlayerId: z.string(),
  westScore: z.number(),
  northPlayerId: z.string(),
  northScore: z.number(),
}).refine(
  (data) => {
    const playerIds = [data.eastPlayerId, data.southPlayerId, data.westPlayerId, data.northPlayerId];
    const uniquePlayerIds = new Set(playerIds);
    return uniquePlayerIds.size === 4;
  },
  {
    message: "Each player can only play in one position per game",
    path: ["players"]
  }
);

// GET is public - no authentication required
export async function GET() {
  try {
    const games = await db.game.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        eastPlayer: true,
        southPlayer: true,
        westPlayer: true,
        northPlayer: true,
        createdBy: {
          select: { name: true }
        },
        updatedBy: {
          select: { name: true }
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(games, {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
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

    const body = await request.json();
    const validatedData = gameSchema.parse(body);

    // Create a new game and update player points
    const game = await db.$transaction(async (tx) => {
      // Create the game first
      const createdGame = await tx.game.create({
        data: {
          ...validatedData,
          createdById: session.user.id,
        },
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
          createdBy: {
            select: { name: true }
          },
        },
      });

      // Recalculate all points to ensure correct ranking by score
      await recalculateAllPoints(tx);

      return createdGame;
    });

    return NextResponse.json(game, {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }
    console.error('Failed to create game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
} 