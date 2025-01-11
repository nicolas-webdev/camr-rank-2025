import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { db } from '@/lib';
import { z } from 'zod';
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
  nickname: z.string().min(1),
  rank: z.string(),
  points: z.number(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = await Promise.resolve(params.id);
  
  try {
    const player = await db.player.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        points: true,
        rank: true,
      }
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
      return new NextResponse('Forbidden - Only admins can update players', { status: 403 });
    }

    const body = await request.json();
    const validatedData = playerSchema.parse(body);

    const player = await db.player.update({
      where: { id: params.id },
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
      return new NextResponse('Forbidden - Only admins can delete players', { status: 403 });
    }

    // Check if player has any games
    const player = await db.player.findUnique({
      where: { id: params.id },
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
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete player:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 