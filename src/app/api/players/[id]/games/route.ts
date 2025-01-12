import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib';
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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if user is admin
    const session = await getServerSession(authOptions) as ExtendedSession;
    const user = session?.user?.id ? await db.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    }) : null;
    const isAdmin = !!user?.isAdmin;

    const games = await db.game.findMany({
      where: {
        OR: [
          { eastPlayerId: id },
          { southPlayerId: id },
          { westPlayerId: id },
          { northPlayerId: id }
        ],
        // Only show deleted games to admins
        isDeleted: isAdmin ? undefined : false
      },
      include: {
        eastPlayer: true,
        southPlayer: true,
        westPlayer: true,
        northPlayer: true,
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error('Failed to fetch player games:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 