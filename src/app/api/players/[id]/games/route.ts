import { NextResponse } from 'next/server';
import { db } from '@/lib';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = await Promise.resolve(params.id);
  
  try {
    const player = await db.player.findUnique({
      where: { id },
      include: {
        eastGames: {
          where: { isDeleted: false },
          include: {
            eastPlayer: { select: { id: true, nickname: true } },
            southPlayer: { select: { id: true, nickname: true } },
            westPlayer: { select: { id: true, nickname: true } },
            northPlayer: { select: { id: true, nickname: true } },
          },
          orderBy: { date: 'desc' },
        },
        southGames: {
          where: { isDeleted: false },
          include: {
            eastPlayer: { select: { id: true, nickname: true } },
            southPlayer: { select: { id: true, nickname: true } },
            westPlayer: { select: { id: true, nickname: true } },
            northPlayer: { select: { id: true, nickname: true } },
          },
          orderBy: { date: 'desc' },
        },
        westGames: {
          where: { isDeleted: false },
          include: {
            eastPlayer: { select: { id: true, nickname: true } },
            southPlayer: { select: { id: true, nickname: true } },
            westPlayer: { select: { id: true, nickname: true } },
            northPlayer: { select: { id: true, nickname: true } },
          },
          orderBy: { date: 'desc' },
        },
        northGames: {
          where: { isDeleted: false },
          include: {
            eastPlayer: { select: { id: true, nickname: true } },
            southPlayer: { select: { id: true, nickname: true } },
            westPlayer: { select: { id: true, nickname: true } },
            northPlayer: { select: { id: true, nickname: true } },
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Combine all games and sort by date
    const games = [
      ...player.eastGames,
      ...player.southGames,
      ...player.westGames,
      ...player.northGames,
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching player games:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 