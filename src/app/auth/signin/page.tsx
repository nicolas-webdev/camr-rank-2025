'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Sign in to access your account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn('github', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <FaGithub className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
} 