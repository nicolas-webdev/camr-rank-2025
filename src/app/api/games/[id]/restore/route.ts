import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib';
import { recalculateAllPoints } from '@/lib/ranking';
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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      return new NextResponse('Forbidden - Only admins can restore games', { status: 403 });
    }

    const game = await db.game.findUnique({
      where: { id }
    });

    if (!game) {
      return new NextResponse('Game not found', { status: 404 });
    }

    if (!game.isDeleted) {
      return new NextResponse('Game is not deleted', { status: 400 });
    }

    // Restore the game and recalculate all points
    await db.$transaction(async (tx) => {
      // Mark game as not deleted
      await tx.game.update({
        where: { id },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedById: null,
          updatedById: session.user.id,
        },
      });

      // Recalculate all points from the beginning
      await recalculateAllPoints(tx);
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to restore game:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 