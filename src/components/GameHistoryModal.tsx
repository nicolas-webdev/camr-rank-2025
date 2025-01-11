import React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

type Player = {
  id: string;
  nickname: string;
};

type User = {
  name: string | null;
  email: string | null;
};

type Game = {
  id: string;
  date: string;
  isHanchan: boolean;
  eastPlayer: Player;
  eastScore: number;
  southPlayer: Player;
  southScore: number;
  westPlayer: Player;
  westScore: number;
  northPlayer: Player;
  northScore: number;
  createdAt: string;
  createdBy: User;
  updatedAt: string;
  updatedBy: User | null;
  deletedAt: string | null;
  deletedBy: User | null;
  isDeleted: boolean;
};

type GameHistoryModalProps = {
  gameId: string;
  onClose: () => void;
};

export default function GameHistoryModal({ gameId, onClose }: GameHistoryModalProps) {
  const [history, setHistory] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}/history`);
        if (!response.ok) throw new Error('Failed to fetch game history');
        const data = await response.json();
        setHistory(data);
      } catch {
        setError('Failed to load game history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [gameId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
          <p className="text-red-600 text-center">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Game History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {history.map((version, index) => (
            <div
              key={version.id}
              className={`p-4 rounded-lg ${version.isDeleted ? 'bg-red-50' : 'bg-gray-50'
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold">Version {index + 1}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {format(new Date(version.date), 'PPpp')}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {version.isDeleted ? (
                    <span className="text-red-600">Deleted</span>
                  ) : (
                    <span>{version.isHanchan ? 'Hanchan' : 'Tonpuusen'}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-2">Players & Scores</h3>
                  <div className="space-y-1">
                    <div>🀀 {version.eastPlayer.nickname}: {version.eastScore}</div>
                    <div>🀁 {version.southPlayer.nickname}: {version.southScore}</div>
                    <div>🀂 {version.westPlayer.nickname}: {version.westScore}</div>
                    <div>🀃 {version.northPlayer.nickname}: {version.northScore}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Audit Trail</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      Created by: {version.createdBy.name || version.createdBy.email}
                      <br />
                      <span className="text-gray-500">
                        {format(new Date(version.createdAt), 'PPpp')}
                      </span>
                    </div>
                    {version.updatedBy && (
                      <div>
                        Updated by: {version.updatedBy.name || version.updatedBy.email}
                        <br />
                        <span className="text-gray-500">
                          {format(new Date(version.updatedAt), 'PPpp')}
                        </span>
                      </div>
                    )}
                    {version.deletedBy && (
                      <div className="text-red-600">
                        Deleted by: {version.deletedBy.name || version.deletedBy.email}
                        <br />
                        <span className="text-red-500">
                          {format(new Date(version.deletedAt!), 'PPpp')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
} 