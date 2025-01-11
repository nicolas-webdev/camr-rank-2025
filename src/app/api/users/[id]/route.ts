import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { db } from '@/lib';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const [session, { id }] = await Promise.all([
      getServerSession(authOptions),
      context.params
    ]);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Users can only check their own admin status
    if (session.user.id !== id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 