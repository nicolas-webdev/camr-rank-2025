import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { z } from 'zod';
import { db, calculatePointsForPosition, getRankByPoints } from '@/lib';
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

// Get a specific game
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const game = await db.game.findUnique({
      where: { id: params.id },
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
      return new NextResponse('Game not found', { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error('Failed to fetch game:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Update a game
export async function PUT(
  request: Request
) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return new NextResponse('Forbidden - Only admins can update games', { status: 403 });
    }

    const body = await request.json();
    
    try {
      const validatedData = gameSchema.parse(body);
      
      // Verify the game exists
      const game = await db.game.findUnique({
        where: { id: validatedData.id },
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
        }
      });

      if (!game) {
        return new NextResponse('Game not found', { status: 404 });
      }

      // Create a new version of the game with updated data
      const updatedGame = await db.$transaction(async (tx) => {
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
            const newRank = getRankByPoints(newPoints);

            await tx.player.update({
              where: { id: playerId },
              data: {
                points: newPoints,
                rank: newRank.kanji,
              },
            });
          })
        );

        // Update the game
        return tx.game.update({
          where: { id: validatedData.id },
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
      });

      return NextResponse.json(updatedGame);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Invalid request data', 
            details: validationError.errors 
          }), 
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Failed to update game:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Delete a game
export async function DELETE(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden - Only admins can delete games' }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const game = await db.game.findUnique({
      where: { id },
      include: {
        eastPlayer: true,
        southPlayer: true,
        westPlayer: true,
        northPlayer: true,
      }
    });

    if (!game) {
      return new NextResponse(
        JSON.stringify({ error: 'Game not found' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (game.isDeleted) {
      return new NextResponse(
        JSON.stringify({ error: 'Game is already deleted' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Soft delete the game and update player points
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

      // Revert player points
      await Promise.all([
        tx.player.update({
          where: { id: game.eastPlayerId },
          data: {
            points: { decrement: calculatePointsForPosition(0, game.isHanchan, game.eastPlayer.points.toString()) },
          },
        }),
        tx.player.update({
          where: { id: game.southPlayerId },
          data: {
            points: { decrement: calculatePointsForPosition(1, game.isHanchan, game.southPlayer.points.toString()) },
          },
        }),
        tx.player.update({
          where: { id: game.westPlayerId },
          data: {
            points: { decrement: calculatePointsForPosition(2, game.isHanchan, game.westPlayer.points.toString()) },
          },
        }),
        tx.player.update({
          where: { id: game.northPlayerId },
          data: {
            points: { decrement: calculatePointsForPosition(3, game.isHanchan, game.northPlayer.points.toString()) },
          },
        }),
      ]);
    });

    return new NextResponse(
      JSON.stringify({ message: 'Game deleted successfully' }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to delete game:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 