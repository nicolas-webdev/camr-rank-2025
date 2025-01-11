import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const player = await prisma.player.findUnique({
    where: { id: params.id },
    include: {
      eastGames: {
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
        },
      },
      southGames: {
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
        },
      },
      westGames: {
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
        },
      },
      northGames: {
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
        },
      },
    },
  });

  if (!player) {
    notFound();
  }

  // Combine all games where the player participated
  const allGames = [
    ...player.eastGames,
    ...player.southGames,
    ...player.westGames,
    ...player.northGames,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{player.nickname}</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Rank</p>
            <p className="text-xl font-semibold">{player.rank}</p>
          </div>
          <div>
            <p className="text-gray-600">Points</p>
            <p className="text-xl font-semibold">{player.points}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Games</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Players
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allGames.map((game) => {
              let position = '';
              let score = 0;

              if (game.eastPlayerId === player.id) {
                position = 'East';
                score = game.eastScore;
              } else if (game.southPlayerId === player.id) {
                position = 'South';
                score = game.southScore;
              } else if (game.westPlayerId === player.id) {
                position = 'West';
                score = game.westScore;
              } else if (game.northPlayerId === player.id) {
                position = 'North';
                score = game.northScore;
              }

              return (
                <tr key={game.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(game.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {game.isHanchan ? 'Hanchan' : 'Tonpuusen'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>🀀 {game.eastPlayer.nickname}</div>
                      <div>🀁 {game.southPlayer.nickname}</div>
                      <div>🀂 {game.westPlayer.nickname}</div>
                      <div>🀃 {game.northPlayer.nickname}</div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 