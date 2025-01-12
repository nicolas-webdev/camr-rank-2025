'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GameHistoryModal from '@/components/GameHistoryModal';

type Player = {
  id: string;
  nickname: string;
  points: number;
  rank: string;
};

interface RatingChange {
  statsId: string;
  oldRating: number;
  newRating: number;
  change: number;
  oldRank: string;
  newRank: string;
  pointsToNextRank: number;
  rankPoints: number;  // Points earned/lost for rank progression
}

interface Game {
  id: string;
  date: Date;
  isHanchan: boolean;
  eastPlayerId: string;
  eastScore: number;
  southPlayerId: string;
  southScore: number;
  westPlayerId: string;
  westScore: number;
  northPlayerId: string;
  northScore: number;
  eastPlayer: { id: string; nickname: string };
  southPlayer: { id: string; nickname: string };
  westPlayer: { id: string; nickname: string };
  northPlayer: { id: string; nickname: string };
  isDeleted: boolean;
  ratingChanges?: RatingChange[];
}

interface PlayerProfileClientProps {
  playerId: string;
}

function getPlayerPlacement(game: Game, playerId: string): { placement: number, score: number } {
  const scores = [
    { id: game.eastPlayerId, score: game.eastScore },
    { id: game.southPlayerId, score: game.southScore },
    { id: game.westPlayerId, score: game.westScore },
    { id: game.northPlayerId, score: game.northScore }
  ].sort((a, b) => b.score - a.score);

  return {
    placement: scores.findIndex(s => s.id === playerId) + 1,
    score: scores.find(s => s.id === playerId)?.score || 0
  };
}

export default function PlayerProfileClient({ playerId }: PlayerProfileClientProps) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [playerResponse, gamesResponse] = await Promise.all([
        fetch(`/api/players/${playerId}`),
        fetch(`/api/players/${playerId}/games`),
      ]);

      if (!playerResponse.ok || !gamesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [playerData, gamesData] = await Promise.all([
        playerResponse.json(),
        gamesResponse.json(),
      ]);

      setPlayer(playerData);
      setGames(gamesData.map((game: Game) => ({
        ...game,
        date: new Date(game.date)
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [playerId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="text-red-600 text-center py-8">
        {error || 'Player not found'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-900"
        >
          ← Back to Home
        </Link>
      </div>

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

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Game History</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Placement</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Score</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Points</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Players</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {games.map((game) => {
                const { placement, score } = getPlayerPlacement(game, playerId);
                const ratingChange = game.ratingChanges?.find(rc => rc.statsId === playerId);

                return (
                  <tr key={game.id} className={`hover:bg-gray-50 ${game.isDeleted ? 'bg-red-50' : ''}`}>
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
                    <td className="px-4 py-2 text-sm">
                      <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium
                        ${placement === 1 ? 'bg-yellow-100 text-yellow-800' :
                          placement === 2 ? 'bg-gray-200 text-gray-800' :
                            placement === 3 ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-700'}`}>
                        {placement}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {score}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {ratingChange && (
                        <div className="space-y-1">
                          <div className={`${ratingChange.rankPoints > 0 ? 'text-green-600' : ratingChange.rankPoints < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                            {ratingChange.rankPoints > 0 ? '+' : ''}{ratingChange.rankPoints} rank points
                          </div>
                          <div className="text-gray-500 text-xs">
                            {ratingChange.oldRank} → {ratingChange.newRank}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <div className="space-y-1">
                        <div>🀀 {game.eastPlayer.nickname}</div>
                        <div>🀁 {game.southPlayer.nickname}</div>
                        <div>🀂 {game.westPlayer.nickname}</div>
                        <div>🀃 {game.northPlayer.nickname}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={() => setSelectedGameId(game.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View game details"
                      >
                        📜
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedGameId && (
        <GameHistoryModal
          gameId={selectedGameId}
          onClose={() => setSelectedGameId(null)}
        />
      )}
    </div>
  );
} 