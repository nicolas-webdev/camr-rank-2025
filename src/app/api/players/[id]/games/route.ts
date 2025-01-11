import { NextResponse } from 'next/server';
import { db } from '@/lib';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const player = await db.player.findUnique({
      where: { id: params.id },
      include: {
        eastGames: {
          where: { isDeleted: false },
          include: {
            eastPlayer: { select: { nickname: true } },
            southPlayer: { select: { nickname: true } },
            westPlayer: { select: { nickname: true } },
            northPlayer: { select: { nickname: true } },
            createdBy: { select: { name: true } },
            updatedBy: { select: { name: true } },
          },
          orderBy: { date: 'desc' },
        },
        southGames: {
          where: { isDeleted: false },
          include: {
            eastPlayer: { select: { nickname: true } },
            southPlayer: { select: { nickname: true } },
            westPlayer: { select: { nickname: true } },
            northPlayer: { select: { nickname: true } },
            createdBy: { select: { name: true } },
            updatedBy: { select: { name: true } },
          },
          orderBy: { date: 'desc' },
        },
        westGames: {
          where: { isDeleted: false },
          include: {
            eastPlayer: { select: { nickname: true } },
            southPlayer: { select: { nickname: true } },
            westPlayer: { select: { nickname: true } },
            northPlayer: { select: { nickname: true } },
            createdBy: { select: { name: true } },
            updatedBy: { select: { name: true } },
          },
          orderBy: { date: 'desc' },
        },
        northGames: {
          where: { isDeleted: false },
          include: {
            eastPlayer: { select: { nickname: true } },
            southPlayer: { select: { nickname: true } },
            westPlayer: { select: { nickname: true } },
            northPlayer: { select: { nickname: true } },
            createdBy: { select: { name: true } },
            updatedBy: { select: { name: true } },
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!player) {
      return new NextResponse('Player not found', { status: 404 });
    }

    // Combine all games and sort by date
    const games = [
      ...player.eastGames,
      ...player.southGames,
      ...player.westGames,
      ...player.northGames,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(games);
  } catch (error) {
    console.error('Failed to fetch player games:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 