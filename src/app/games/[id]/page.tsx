import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

type Position = 'East' | 'South' | 'West' | 'North';

type Score = {
  position: Position;
  player: {
    id: string;
    nickname: string;
  };
  score: number;
};

async function getGameData(id: string) {
  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      eastPlayer: true,
      southPlayer: true,
      westPlayer: true,
      northPlayer: true,
    },
  });

  if (!game) {
    return null;
  }

  const scores: Score[] = [
    { position: 'East' as Position, player: game.eastPlayer, score: game.eastScore },
    { position: 'South' as Position, player: game.southPlayer, score: game.southScore },
    { position: 'West' as Position, player: game.westPlayer, score: game.westScore },
    { position: 'North' as Position, player: game.northPlayer, score: game.northScore },
  ].sort((a, b) => b.score - a.score);

  return {
    game,
    scores,
  };
}

export default async function GameDetail({ params }: { params: { id: string } }) {
  const data = await getGameData(params.id);

  if (!data) {
    notFound();
  }

  const { game, scores } = data;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Game Details</h1>
          <p className="text-gray-500">
            {new Date(game.date).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scores.map(({ position, player, score }, index) => (
              <div
                key={player.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">{position}</h3>
                  <span className="text-sm text-gray-500">
                    {index + 1}
                    {index === 0 ? 'st'
                      : index === 1 ? 'nd'
                        : index === 2 ? 'rd'
                          : 'th'} place
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/players/${player.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {player.nickname}
                  </Link>
                  <span className="font-medium">{score}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 