import { db } from '@/lib';
import { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import NextAuth from 'next-auth';
import { Session } from 'next-auth';

interface ExtendedUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  isAdmin: boolean;
}

export interface ExtendedSession extends Omit<Session, 'user'> {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAdmin?: boolean;
  };
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      
      // Check if user exists, if not create them
      const dbUser = await db.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });

      // Add the database user id and admin status to the user object
      const extendedUser = user as ExtendedUser;
      extendedUser.id = dbUser.id;
      extendedUser.isAdmin = dbUser.isAdmin ?? false;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.id;
        token.isAdmin = extendedUser.isAdmin;
      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          isAdmin: token.isAdmin as boolean,
        }
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt'
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 