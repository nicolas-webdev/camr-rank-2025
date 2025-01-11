import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { db } from '@/lib';
import type { Session } from 'next-auth';
import { Game } from '@prisma/client';

// Extend Session type to include id
interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

type GameWithRelations = Game & {
  eastPlayer: { nickname: string };
  southPlayer: { nickname: string };
  westPlayer: { nickname: string };
  northPlayer: { nickname: string };
  createdBy: { name: string | null };
  updatedBy: { name: string | null } | null;
  deletedBy: { name: string | null } | null;
  previousVersion: GameWithRelations | null;
  nextVersion: GameWithRelations | null;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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
      return new NextResponse('Forbidden - Only admins can view game history', { status: 403 });
    }

    const game = await db.game.findUnique({
      where: { id: params.id },
      include: {
        eastPlayer: { select: { nickname: true } },
        southPlayer: { select: { nickname: true } },
        westPlayer: { select: { nickname: true } },
        northPlayer: { select: { nickname: true } },
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
        deletedBy: { select: { name: true } },
        previousVersion: true,
        nextVersion: true
      }
    }) as GameWithRelations | null;

    if (!game) {
      return new NextResponse('Game not found', { status: 404 });
    }

    const history: GameWithRelations[] = [];
    let currentVersion = game;

    // Get previous versions
    while (currentVersion.previousVersionId) {
      const previousVersion = await db.game.findUnique({
        where: { id: currentVersion.previousVersionId },
        include: {
          eastPlayer: { select: { nickname: true } },
          southPlayer: { select: { nickname: true } },
          westPlayer: { select: { nickname: true } },
          northPlayer: { select: { nickname: true } },
          createdBy: { select: { name: true } },
          updatedBy: { select: { name: true } },
          deletedBy: { select: { name: true } }
        }
      }) as GameWithRelations | null;
      
      if (previousVersion) {
        history.unshift(previousVersion);
        currentVersion = previousVersion;
      } else {
        break;
      }
    }

    // Add current version
    history.push(game);

    // Get next versions
    currentVersion = game;
    while (currentVersion.nextVersion) {
      history.push(currentVersion.nextVersion);
      currentVersion = currentVersion.nextVersion;
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error('Failed to fetch game history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 