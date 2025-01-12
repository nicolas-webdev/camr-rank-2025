import Link from 'next/link';

export default function PlayerNotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Player Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The player you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/players"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        View All Players
      </Link>
    </div>
  );
} 