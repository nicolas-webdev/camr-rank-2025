import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { z } from 'zod';
import { db, calculatePointsForPosition, getRankByPoints, type RankInfo } from '@/lib';
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

export async function POST(
  request: Request
) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const validatedData = gameSchema.parse(body);

    // Create a new game and update player points
    const game = await db.$transaction(async (tx) => {
      // Calculate points changes for each player
      const playerUpdates = [
        { playerId: validatedData.eastPlayerId, position: 0, score: validatedData.eastScore },
        { playerId: validatedData.southPlayerId, position: 1, score: validatedData.southScore },
        { playerId: validatedData.westPlayerId, position: 2, score: validatedData.westScore },
        { playerId: validatedData.northPlayerId, position: 3, score: validatedData.northScore },
      ].sort((a, b) => b.score - a.score);

      // Update player points
      await Promise.all(
        playerUpdates.map(async ({ playerId, position }) => {
          const player = await tx.player.findUnique({
            where: { id: playerId }
          });

          if (!player) return;

          const pointsChange = calculatePointsForPosition(position, validatedData.isHanchan, player.points.toString());
          const newPoints = player.points + pointsChange;
          const newRank: RankInfo = getRankByPoints(newPoints);

          await tx.player.update({
            where: { id: playerId },
            data: {
              points: newPoints,
              rank: newRank.kanji,
            },
          });
        })
      );

      // Create the game
      return tx.game.create({
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
    });

    return NextResponse.json(game);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    console.error('Failed to create game:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

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

    return NextResponse.json(games);
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 