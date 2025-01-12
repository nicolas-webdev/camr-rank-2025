import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { db, calculatePointsForPosition, getRankByPoints } from '@/lib';
import type { Session } from 'next-auth';
import type { Player, Prisma } from '@prisma/client';

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
  id: z.string(),
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
});

async function recalculateAllPoints(tx: Prisma.TransactionClient) {
  // Get all players
  const players = await tx.player.findMany();
  
  // Reset all players' points to 0 and rank to 新人
  await Promise.all(
    players.map((player: Player) =>
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
    },
    include: {
      eastPlayer: true,
      southPlayer: true,
      westPlayer: true,
      northPlayer: true,
    }
  });

  // Replay each game in chronological order
  for (const game of games) {
    const playerScores = [
      { playerId: game.eastPlayerId, score: game.eastScore },
      { playerId: game.southPlayerId, score: game.southScore },
      { playerId: game.westPlayerId, score: game.westScore },
      { playerId: game.northPlayerId, score: game.northScore },
    ].sort((a, b) => b.score - a.score);

    // Update each player's points based on their position
    for (let i = 0; i < playerScores.length; i++) {
      const { playerId } = playerScores[i];
      
      // Get player's current points before updating
      const player = await tx.player.findUnique({
        where: { id: playerId }
      });

      if (!player) continue;

      // Calculate points based on current rank and position
      const pointsChange = calculatePointsForPosition(i, game.isHanchan, player.points.toString());
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

// Get a specific game
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const game = await db.game.findUnique({
      where: { id },
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
        deletedBy: {
          select: { name: true }
        }
      }
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error('Failed to fetch game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a game
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can update games' },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    try {
      const validatedData = gameSchema.parse(body);
      
      // Verify the game exists
      const game = await db.game.findUnique({
        where: { id }
      });

      if (!game) {
        return NextResponse.json(
          { error: 'Game not found' },
          { status: 404 }
        );
      }

      // Update the game and recalculate all points
      const updatedGame = await db.$transaction(async (tx) => {
        // First update the game
        const updated = await tx.game.update({
          where: { id },
          data: {
            date: new Date(validatedData.date),
            isHanchan: validatedData.isHanchan,
            eastPlayerId: validatedData.eastPlayerId,
            eastScore: validatedData.eastScore,
            southPlayerId: validatedData.southPlayerId,
            southScore: validatedData.southScore,
            westPlayerId: validatedData.westPlayerId,
            westScore: validatedData.westScore,
            northPlayerId: validatedData.northPlayerId,
            northScore: validatedData.northScore,
            updatedById: session.user.id,
          },
          include: {
            eastPlayer: true,
            southPlayer: true,
            westPlayer: true,
            northPlayer: true,
          },
        });

        // Then recalculate all points
        await recalculateAllPoints(tx);

        return updated;
      });

      return NextResponse.json(updatedGame);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Failed to update game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a game
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can delete games' },
        { status: 403 }
      );
    }

    const game = await db.game.findUnique({
      where: { id }
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    if (game.isDeleted) {
      return NextResponse.json(
        { error: 'Game is already deleted' },
        { status: 400 }
      );
    }

    // Soft delete the game and recalculate points
    await db.$transaction(async (tx) => {
      // Mark game as deleted
      await tx.game.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedById: session.user.id,
        },
      });

      // Recalculate all points
      await recalculateAllPoints(tx);
    });

    return NextResponse.json(
      { message: 'Game deleted successfully' }
    );
  } catch (error) {
    console.error('Failed to delete game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 