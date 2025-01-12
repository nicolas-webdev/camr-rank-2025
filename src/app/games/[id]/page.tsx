import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: PageProps) {
  const { id } = await params;
  const game = await db.game.findUnique({
    where: { id },
    include: {
      eastPlayer: true,
      southPlayer: true,
      westPlayer: true,
      northPlayer: true,
      createdBy: {
        select: { name: true }
      },
      updatedBy: {
        select: { name: true }
      },
      deletedBy: {
        select: { name: true }
      }
    }
  });

  if (!game) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/games"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Games
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Game Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Game Information</h2>
            <p>Date: {game.date.toLocaleString()}</p>
            <p>Type: {game.isHanchan ? 'Hanchan' : 'Tonpuusen'}</p>
            <p>Status: {game.isDeleted ? 'Deleted' : 'Active'}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Players</h2>
            <div className="space-y-2">
              <p>East: {game.eastPlayer.nickname} ({game.eastScore.toLocaleString()})</p>
              <p>South: {game.southPlayer.nickname} ({game.southScore.toLocaleString()})</p>
              <p>West: {game.westPlayer.nickname} ({game.westScore.toLocaleString()})</p>
              <p>North: {game.northPlayer.nickname} ({game.northScore.toLocaleString()})</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Created by: {game.createdBy?.name || 'Unknown'}</p>
          {game.updatedBy && (
            <p>Last updated by: {game.updatedBy.name || 'Unknown'}</p>
          )}
          {game.deletedBy && (
            <p>Deleted by: {game.deletedBy.name || 'Unknown'}</p>
          )}
        </div>
      </div>
    </div>
  );
} 