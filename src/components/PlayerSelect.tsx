'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import type { Player } from '@/types/game';

interface PlayerSelectProps {
  value: string;
  onChange: (id: string) => void;
  disabledPlayerIds?: string[];
}

export function PlayerSelect({ value, onChange, disabledPlayerIds = [] }: PlayerSelectProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/players');
        if (!response.ok) throw new Error('Failed to fetch players');
        const data = await response.json();
        setPlayers(data);
      } catch {
        setError('Failed to load players');
      }
    };

    fetchPlayers();
  }, []);

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option value="">Select player</option>
      {players.map((player) => (
        <option
          key={player.id}
          value={player.id}
          disabled={disabledPlayerIds.includes(player.id)}
        >
          {player.nickname} {disabledPlayerIds.includes(player.id) ? '(already selected)' : ''}
        </option>
      ))}
    </select>
  );
} 