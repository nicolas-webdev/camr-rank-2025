import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Only require auth for non-public routes
      const publicPaths = ['/'];
      const isPublicPath = publicPaths.some(path => 
        req.nextUrl.pathname.startsWith(path)
      );
      
      return isPublicPath || !!token;
    }
  }
});

export const config = {
  matcher: [
    '/players/:path*',
    '/games/:path*',
    '/standings/:path*',
    '/api/players/:path*',
    '/api/games/:path*',
    '/api/stats/:path*',
  ]
}; 