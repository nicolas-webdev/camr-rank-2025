'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export function SignInButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          {session.user.name}
        </span>
        <button
          onClick={() => signOut()}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      Sign in
    </button>
  );
} 