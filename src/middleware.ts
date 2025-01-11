import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
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