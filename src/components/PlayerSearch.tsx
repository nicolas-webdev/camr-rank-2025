'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Player } from '@prisma/client';

export function PlayerSearch() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchPlayers = async () => {
      if (!query.trim()) {
        setPlayers([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/players?search=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to search players');
        }
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error searching players:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchPlayers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search players..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>

      {showResults && query.trim() && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          {players.length > 0 ? (
            <ul className="max-h-60 overflow-auto py-1">
              {players.map((player) => (
                <li key={player.id}>
                  <Link
                    href={`/players/${player.id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setShowResults(false);
                      setQuery('');
                    }}
                  >
                    <div className="font-medium">{player.nickname}</div>
                    <div className="text-sm text-gray-500">Rating: {player.rating}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No players found
            </div>
          )}
        </div>
      )}
    </div>
  );
} 