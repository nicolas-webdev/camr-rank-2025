import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const playerSchema = z.object({
  nickname: z.string().min(2).max(30),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const validatedData = playerSchema.parse(body);

    // Check if player with nickname already exists
    const existingPlayer = await prisma.player.findUnique({
      where: { nickname: validatedData.nickname },
    });

    if (existingPlayer) {
      return new NextResponse('Player with this nickname already exists', { status: 400 });
    }

    // Create new player
    const player = await prisma.player.create({
      data: {
        userId: session.user.id,
        nickname: validatedData.nickname,
      },
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const players = await prisma.player.findMany({
      where: search ? {
        nickname: {
          contains: search,
          mode: 'insensitive',
        },
      } : undefined,
      orderBy: {
        rating: 'desc',
      },
      take: search ? 5 : undefined, // Limit search results, but not the full list
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 