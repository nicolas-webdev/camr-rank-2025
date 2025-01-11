import React from 'react';
import { db } from '@/lib';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import GameActions from '@/components/GameActions';

type Player = {
  id: string;
  nickname: string;
  points: number;
  rank: string;
};

type GameWithDate = {
  id: string;
  date: Date;
  isHanchan: boolean;
  eastPlayerId: string;
  eastPlayer: Player;
  eastScore: number;
  southPlayerId: string;
  southPlayer: Player;
  southScore: number;
  westPlayerId: string;
  westPlayer: Player;
  westScore: number;
  northPlayerId: string;
  northPlayer: Player;
  northScore: number;
  isDeleted: boolean;
};

export default async function PlayerProfile({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const id = params.id;

  // Check if user is admin
  let isAdmin = false;
  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    });
    isAdmin = !!user?.isAdmin;
  }

  // Fetch player data
  const player = await db.player.findUnique({
    where: { id },
    select: {
      id: true,
      nickname: true,
      points: true,
      rank: true,
      eastGames: {
        where: { isDeleted: false },
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
        },
        orderBy: { date: 'desc' },
      },
      southGames: {
        where: { isDeleted: false },
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
        },
        orderBy: { date: 'desc' },
      },
      westGames: {
        where: { isDeleted: false },
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
        },
        orderBy: { date: 'desc' },
      },
      northGames: {
        where: { isDeleted: false },
        include: {
          eastPlayer: true,
          southPlayer: true,
          westPlayer: true,
          northPlayer: true,
        },
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!player) {
    return (
      <div className="text-red-600 text-center py-8">
        Player not found
      </div>
    );
  }

  // Combine and sort all games
  const games = [
    ...player.eastGames,
    ...player.southGames,
    ...player.westGames,
    ...player.northGames,
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6 mb-8">
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

      <h2 className="text-2xl font-bold mb-4">Game History</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Position</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Score</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Players</th>
              {isAdmin && (
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {games.map((game: GameWithDate) => {
              const position =
                game.eastPlayer.id === player.id ? 'East' :
                  game.southPlayer.id === player.id ? 'South' :
                    game.westPlayer.id === player.id ? 'West' :
                      'North';

              const score =
                game.eastPlayer.id === player.id ? game.eastScore :
                  game.southPlayer.id === player.id ? game.southScore :
                    game.westPlayer.id === player.id ? game.westScore :
                      game.northScore;

              return (
                <tr key={game.id} className={game.isDeleted ? 'bg-red-50' : ''}>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {game.date.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {game.isDeleted ? (
                      <span className="text-red-600">Deleted</span>
                    ) : (
                      <span>{game.isHanchan ? 'Hanchan' : 'Tonpuusen'}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {position}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {score}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="space-y-1">
                      <div>
                        🀀 <Link href={`/players/${game.eastPlayer.id}`} className="text-indigo-600 hover:text-indigo-900">
                          {game.eastPlayer.nickname}
                        </Link>: {game.eastScore}
                      </div>
                      <div>
                        🀁 <Link href={`/players/${game.southPlayer.id}`} className="text-indigo-600 hover:text-indigo-900">
                          {game.southPlayer.nickname}
                        </Link>: {game.southScore}
                      </div>
                      <div>
                        🀂 <Link href={`/players/${game.westPlayer.id}`} className="text-indigo-600 hover:text-indigo-900">
                          {game.westPlayer.nickname}
                        </Link>: {game.westScore}
                      </div>
                      <div>
                        🀃 <Link href={`/players/${game.northPlayer.id}`} className="text-indigo-600 hover:text-indigo-900">
                          {game.northPlayer.nickname}
                        </Link>: {game.northScore}
                      </div>
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-2 text-sm">
                      <GameActions game={game} onGameUpdated={() => { }} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 