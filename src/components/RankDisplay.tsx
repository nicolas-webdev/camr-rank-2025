'use client';

import { RankInfo } from '@/types/ranking';

interface RankDisplayProps {
  currentRank: RankInfo;
  currentPoints: number;
}

export const RankDisplay = ({ currentRank, currentPoints }: RankDisplayProps) => {
  const progressPercentage = Math.min(
    (currentPoints / currentRank.pointsToNextRank) * 100,
    100
  );

  return (
    <div className="p-4 rounded-lg bg-white shadow-md">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold">{currentRank.kanji}</div>
        <div className="text-lg text-gray-600">{currentRank.name}</div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress to next rank</span>
          <span>{currentPoints} / {currentRank.pointsToNextRank}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={currentPoints}
            aria-valuemin={0}
            aria-valuemax={currentRank.pointsToNextRank}
          />
        </div>
      </div>

      {currentRank.canDemote && (
        <div className="mt-2 text-sm text-red-600">
          ⚠️ This rank can be demoted if points fall below {currentRank.minimumPoints}
        </div>
      )}
    </div>
  );
}; 