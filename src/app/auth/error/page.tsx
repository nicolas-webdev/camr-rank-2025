import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AuthError({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification link was invalid or has expired.',
    OAuthSignin: 'Error in the OAuth signin process.',
    OAuthCallback: 'Error in the OAuth callback process.',
    OAuthCreateAccount: 'Could not create OAuth provider account.',
    EmailCreateAccount: 'Could not create email provider account.',
    Callback: 'Error in the OAuth callback handler.',
    OAuthAccountNotLinked: 'To confirm your identity, sign in with the same account you used originally.',
    EmailSignin: 'The e-mail could not be sent.',
    CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
    SessionRequired: 'Please sign in to access this page.',
    Default: 'Unable to sign in.',
  };

  const error = params.error;
  const errorMessage = error ? errorMessages[error] ?? errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Authentication Error
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {errorMessage}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Link
            href="/auth/signin"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 