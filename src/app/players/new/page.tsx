'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getRankTitle, calculateRankProgress, getNextRank } from '@/lib/ranking';
import type { RankTitle } from '@/lib/ranking';

interface PreviewPlayerType {
  nickname: string;
  legajo: number;
  realName: string;
  nationality: string;
  tenhouName: string | null;
  mahjongSoulName: string | null;
  rating: number;
  points: number;
  rank: RankTitle;
  rankProgress: number;
  pointsToNextRank: number;
}

export default function NewPlayerPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [isDirty, setIsDirty] = useState(false);
  const initialFormData = {
    nickname: '',
    legajo: '',
    realName: '',
    nationality: 'Argentina',
    tenhouName: '',
    mahjongSoulName: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  };

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (showConfirmation) {
        if (e.key === 'Escape') {
          setShowConfirmation(false);
        } else if (e.key === 'Enter' && !isLoading) {
          setShowConfirmation(false);
          setIsLoading(true);
          setError(null);

          try {
            const response = await fetch('/api/players', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...formData,
                legajo: parseInt(formData.legajo, 10),
              }),
            });

            if (!response.ok) {
              const data = await response.text();
              throw new Error(data);
            }

            router.push('/players');
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setIsLoading(false);
          }
        } else if (e.key === 'Tab') {
          if (modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmation, isLoading, formData, router]);

  // Focus management for modal
  useEffect(() => {
    if (showConfirmation) {
      cancelButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showConfirmation]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          legajo: parseInt(formData.legajo, 10),
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data);
      }

      router.push('/players');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  // Create preview data
  const { progress, pointsNeeded } = calculateRankProgress(0, "新人" as RankTitle);
  const previewData: PreviewPlayerType = {
    nickname: formData.nickname || '[Nickname]',
    legajo: parseInt(formData.legajo, 10) || 0,
    realName: formData.realName || '[Real Name]',
    nationality: formData.nationality || 'Argentina',
    tenhouName: formData.tenhouName || null,
    mahjongSoulName: formData.mahjongSoulName || null,
    rating: 1500,
    points: 0,
    rank: "新人" as RankTitle,
    rankProgress: progress,
    pointsToNextRank: pointsNeeded,
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Please sign in to create a player profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Create Player Profile</h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="flex-1 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nickname *
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
                minLength={2}
                maxLength={30}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose a unique nickname between 2 and 30 characters.
              </p>
            </div>

            <div>
              <label htmlFor="legajo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Legajo *
              </label>
              <input
                type="number"
                id="legajo"
                name="legajo"
                value={formData.legajo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
                min={1}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter your unique registration number.
              </p>
            </div>

            <div>
              <label htmlFor="realName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Real Name
              </label>
              <input
                type="text"
                id="realName"
                name="realName"
                value={formData.realName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nationality
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                maxLength={30}
              />
            </div>

            <div>
              <label htmlFor="tenhouName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tenhou Name
              </label>
              <input
                type="text"
                id="tenhouName"
                name="tenhouName"
                value={formData.tenhouName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                maxLength={30}
              />
            </div>

            <div>
              <label htmlFor="mahjongSoulName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mahjong Soul Name
              </label>
              <input
                type="text"
                id="mahjongSoulName"
                name="mahjongSoulName"
                value={formData.mahjongSoulName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                maxLength={30}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Player'}
            </button>
          </div>
        </form>

        {/* Preview Section */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Preview</h2>
          </div>

          <div className="space-y-6">
            {/* Player Header */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{previewData.nickname}</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {previewData.realName ? `${previewData.realName} · ` : ''}{previewData.nationality}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Legajo: {previewData.legajo || '-'}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {previewData.rank} ({getRankTitle(previewData.rank)})
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Rating: {previewData.rating.toFixed(1)}</p>
                  <p className="text-gray-600 dark:text-gray-400">Points: {previewData.points}</p>
                </div>
              </div>
            </div>

            {/* Online Profiles */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Online Profiles</h2>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Tenhou:</span> {previewData.tenhouName || '-'}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Mahjong Soul:</span> {previewData.mahjongSoulName || '-'}
                </p>
              </div>
            </div>

            {/* Rank Progress */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rank Progress</h2>
              <div className="space-y-4">
                {/* Current and Next Rank */}
                <div className="flex justify-between items-center">
                  <div className="text-gray-900 dark:text-white">
                    <span className="font-medium">Current Rank:</span>{' '}
                    <span className="inline-flex items-center gap-1">
                      <span>{previewData.rank}</span>
                      <span className="text-gray-600 dark:text-gray-400">({getRankTitle(previewData.rank)})</span>
                      <div className="group relative inline-block ml-1">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                          aria-label="Rank information"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.06 2.5 2.5 0 113.53 3.53.75.75 0 11-1.06-1.06 1 1 0 10-1.41-1.41zM9 13a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="invisible group-hover:visible absolute left-full ml-2 w-64 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-300 z-10">
                          <p>Players start at 新人 (Beginner) rank with 0 points. Earn points by playing games and achieving good results to progress through ranks.</p>
                        </div>
                      </div>
                    </span>
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    <span className="font-medium">Next Rank:</span>{' '}
                    <span className="inline-flex items-center gap-1">
                      {(() => {
                        const nextRank = getNextRank(previewData.rank);
                        return nextRank ? (
                          <>
                            <span>{nextRank}</span>
                            <span className="text-gray-600 dark:text-gray-400">({getRankTitle(nextRank)})</span>
                          </>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400">Maximum Rank Achieved</span>
                        );
                      })()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:text-blue-200 dark:bg-blue-600/20">
                        Progress to Next Rank
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-200">
                        {previewData.rankProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-600/20">
                    <div
                      style={{ width: `${previewData.rankProgress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-400 transition-all duration-500"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      Current: {previewData.points} points
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Need: {previewData.pointsToNextRank} more points
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Confirmation Modal */}
      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            tabIndex={-1}
          >
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Player Creation
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Please confirm that you want to create a new player with the following details:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                <p className="text-gray-900 dark:text-white">
                  <span className="font-medium">Nickname:</span> {formData.nickname}
                </p>
                <p className="text-gray-900 dark:text-white">
                  <span className="font-medium">Legajo:</span> {formData.legajo}
                </p>
                {formData.realName && (
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-medium">Real Name:</span> {formData.realName}
                  </p>
                )}
                <p className="text-gray-900 dark:text-white">
                  <span className="font-medium">Nationality:</span> {formData.nationality}
                </p>
                {formData.tenhouName && (
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-medium">Tenhou:</span> {formData.tenhouName}
                  </p>
                )}
                {formData.mahjongSoulName && (
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-medium">Mahjong Soul:</span> {formData.mahjongSoulName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Creating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 