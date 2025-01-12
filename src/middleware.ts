import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    // Allow all GET requests to player and game data
    if (req.method === 'GET' && (
      req.nextUrl.pathname.startsWith('/api/players') ||
      req.nextUrl.pathname.startsWith('/api/games')
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
      const isAdmin = req.nextauth.token?.isAdmin;
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only require authentication for admin routes
      authorized: ({ token, req }) => {
        const isAdminRoute = [
          '/games/new',
          '/players/new',
          '/api/games/new',
          '/api/players/new',
        ].includes(req.nextUrl.pathname) || 
        req.nextUrl.pathname.includes('/edit') ||
        req.nextUrl.pathname.includes('/delete');

        // Allow public access to GET requests
        if (req.method === 'GET' && (
          req.nextUrl.pathname.startsWith('/api/players') ||
          req.nextUrl.pathname.startsWith('/api/games')
        )) {
          return true;
        }

        return isAdminRoute ? !!token : true;
      }
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
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