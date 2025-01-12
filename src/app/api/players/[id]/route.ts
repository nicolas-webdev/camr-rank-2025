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

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib';
import { z } from 'zod';
import type { Session } from 'next-auth';
import { calculateRankProgress, type RankTitle } from '@/lib/ranking';
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

const playerInclude = {
  stats: true,
  eastGames: {
    where: { isDeleted: false },
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
      },
    },
    orderBy: {
      date: 'desc'
    }
  },
  southGames: {
    where: { isDeleted: false },
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
      },
    },
    orderBy: {
      date: 'desc'
    }
  },
  westGames: {
    where: { isDeleted: false },
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
      },
    },
    orderBy: {
      date: 'desc'
    }
  },
  northGames: {
    where: { isDeleted: false },
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
      },
    },
    orderBy: {
      date: 'desc'
    }
  }
} satisfies Prisma.PlayerInclude;

type PlayerWithGames = Prisma.PlayerGetPayload<{ include: typeof playerInclude }>;

const playerSchema = z.object({
  nickname: z.string().min(1),
  rank: z.enum(['新人', '9級', '8級', '7級', '6級', '5級', '4級', '3級', '2級', '1級', '初段', '二段', '三段', '四段', '五段', '六段', '七段', '八段', '九段', '十段']),
  points: z.number(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  try {
    const player = await db.player.findUnique({
      where: { id },
      include: playerInclude
    }) as PlayerWithGames | null;

    if (!player) {
      return new NextResponse('Player not found', { status: 404 });
    }

    // Calculate rank progress and points needed for next rank
    const { progress, pointsNeeded } = calculateRankProgress(player.points, player.rank as RankTitle);

    // Combine all games and sort by date
    const allGames = [
      ...player.eastGames,
      ...player.southGames,
      ...player.westGames,
      ...player.northGames
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Add calculated fields to player data
    const extendedPlayer = {
      ...player,
      rankProgress: progress,
      pointsToNextRank: pointsNeeded,
      games: allGames
    };

    return NextResponse.json(extendedPlayer);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch player' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
      return new NextResponse('Forbidden - Only admins can update players', { status: 403 });
    }

    const body = await req.json();
    const validatedData = playerSchema.parse(body);

    const player = await db.player.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(player);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    console.error('Failed to update player:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
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
      return new NextResponse('Forbidden - Only admins can delete players', { status: 403 });
    }

    // Check if player has any games
    const player = await db.player.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            eastGames: true,
            southGames: true,
            westGames: true,
            northGames: true,
          },
        },
      },
    });

    if (!player) {
      return new NextResponse('Player not found', { status: 404 });
    }

    const totalGames =
      player._count.eastGames +
      player._count.southGames +
      player._count.westGames +
      player._count.northGames;

    if (totalGames > 0) {
      return new NextResponse(
        'Cannot delete player with existing games',
        { status: 400 }
      );
    }

    await db.player.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete player:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 