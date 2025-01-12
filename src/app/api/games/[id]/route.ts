import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib';
import { gameSchema } from '@/lib/validation';
import type { Session } from 'next-auth';
import { recalculateAllPoints } from '@/lib/ranking';

/**
 * IMPORTANT: Next.js 15+ Route Handler Parameter Types
 * 
 * In Next.js 15+, dynamic route parameters in route handlers must be handled as Promises.
 * The context parameter should be typed as: { params: Promise<{ paramName: string }> }
 * 
 * Example:
 * export async function GET(
 *   request: Request,
 *   context: { params: Promise<{ id: string }> }
 * ) {
 *   const { id } = await context.params;
 *   // ... rest of the handler
 * }
 * 
 * Reference: https://nextjs.org/docs/app/api-reference/file-conventions/route#context-optional
 */

// Extend Session type to include id
interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const validatedData = gameSchema.parse(data);

    const result = await db.$transaction(async (tx) => {
      // Update the game
      const updatedGame = await tx.game.update({
        where: { id },
        data: {
          ...validatedData,
          updatedById: session.user.id,
          updatedAt: new Date(),
        },
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
          ratingChanges: true,
          createdBy: {
            select: { name: true }
          },
          updatedBy: {
            select: { name: true }
          }
        }
      });

      // Recalculate all points and ranks after game update
      await recalculateAllPoints(tx);

      return updatedGame;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const result = await db.$transaction(async (tx) => {
      // Soft delete the game
      const deletedGame = await tx.game.update({
        where: { id },
        data: {
          isDeleted: true,
          updatedById: session.user.id,
          updatedAt: new Date(),
        }
      });

      // Recalculate all points and ranks after game deletion
      await recalculateAllPoints(tx);

      return deletedGame;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
} 