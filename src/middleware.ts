import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { db } from '@/lib';

export default withAuth(
  async function middleware(req) {
    // Allow GET requests to player and game details
    if (req.method === 'GET' && (
      req.nextUrl.pathname.startsWith('/api/players/') ||
      req.nextUrl.pathname.startsWith('/api/games/')
    )) {
      return NextResponse.next();
    }

    // Check admin status for protected routes
    const isAdminRoute = [
      '/games/new',
      '/players/new',
      '/api/games/new',
      '/api/players/new',
    ].includes(req.nextUrl.pathname) || 
    req.nextUrl.pathname.includes('/edit') ||
    req.nextUrl.pathname.includes('/delete');

    if (isAdminRoute) {
      try {
        const userId = req.nextauth.token?.sub;
        if (!userId) {
          return NextResponse.redirect(new URL('/', req.url));
        }

        const user = await db.user.findUnique({
          where: { id: userId },
          select: { isAdmin: true }
        });

        if (!user?.isAdmin) {
          return NextResponse.redirect(new URL('/', req.url));
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/api/auth/signin'
    }
  }
);

export const config = {
  matcher: [
    '/games/new',
    '/players/new',
    '/api/games/:path*',
    '/api/players/:path*',
    '/api/users/:path*'
  ]
}; 