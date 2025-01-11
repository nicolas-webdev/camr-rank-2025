import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { calculatePointsForPosition, getRankByPoints } from '@/lib/ranking';

const gameSchema = z.object({
  eastPlayerId: z.string(),
  eastScore: z.number(),
  southPlayerId: z.string(),
  southScore: z.number(),
  westPlayerId: z.string(),
  westScore: z.number(),
  northPlayerId: z.string(),
  northScore: z.number(),
  isHanchan: z.boolean().default(true),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return new NextResponse('Forbidden - Only admins can record games', { status: 403 });
    }

    const body = await request.json();
    const validatedData = gameSchema.parse(body);

    // Create the game
    const game = await prisma.game.create({
      data: validatedData,
    });

    // Update player points and ranks
    const scores = [
      { playerId: validatedData.eastPlayerId, score: validatedData.eastScore },
      { playerId: validatedData.southPlayerId, score: validatedData.southScore },
      { playerId: validatedData.westPlayerId, score: validatedData.westScore },
      { playerId: validatedData.northPlayerId, score: validatedData.northScore },
    ];

    // Sort players by score to determine positions
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    
    // Update points and ranks based on positions
    await Promise.all(
      sortedScores.map(async (score, index) => {
        const player = await prisma.player.findUnique({
          where: { id: score.playerId }
        });

        if (!player) return;

        const currentRank = getRankByPoints(player.points);
        const pointsChange = calculatePointsForPosition(currentRank, index, validatedData.isHanchan);
        const newPoints = player.points + pointsChange;
        const newRank = getRankByPoints(newPoints);

        await prisma.player.update({
          where: { id: score.playerId },
          data: {
            points: newPoints,
            rank: newRank.kanji,
            rating: {
              increment: pointsChange,
            },
          },
        });
      })
    );

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        eastPlayer: true,
        southPlayer: true,
        westPlayer: true,
        northPlayer: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 