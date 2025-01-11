'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import Image from 'next/image';
import { PlayerSearch } from '@/components/PlayerSearch';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-8">
                    <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">
                      CARM
                    </Link>
                    <div className="hidden md:flex items-center space-x-4">
                      <Link
                        href="/players/new"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        New Player
                      </Link>
                      <Link
                        href="/games/new"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Add Game
                      </Link>
                      <Link
                        href="/players"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Players
                      </Link>
                      <Link
                        href="/games"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Games
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-64">
                      <PlayerSearch />
                    </div>
                    <LoginButton />
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}

function LoginButton() {
  const { data: session } = useSession();

  if (session?.user?.image) {
    return (
      <div className="flex items-center space-x-2">
        <Image
          src={session.user.image}
          alt="User avatar"
          width={32}
          height={32}
          className="rounded-full w-8 h-8"
        />
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="text-sm font-medium text-gray-700 hover:text-gray-500"
    >
      Sign in
    </button>
  );
} 