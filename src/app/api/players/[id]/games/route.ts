import { NextResponse } from 'next/server';
import { db } from '@/lib';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const games = await db.game.findMany({
      where: {
        OR: [
          { eastPlayerId: id },
          { southPlayerId: id },
          { westPlayerId: id },
          { northPlayerId: id }
        ]
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error('Failed to fetch player games:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 