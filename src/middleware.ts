import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Allow GET requests to player and game details
    if (req.method === 'GET' && (
      req.nextUrl.pathname.startsWith('/api/players/') ||
      req.nextUrl.pathname.startsWith('/api/games/')
    )) {
      return NextResponse.next();
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
    '/api/games/:path*/edit',
    '/api/games/:path*/delete',
    '/api/players/new',
    '/api/players/:path*/edit',
    '/api/players/:path*/delete',
    '/api/users/:path*'
  ]
}; 