import { db } from '@/lib/prisma';
import { calculatePointsForPosition, getRankByPoints, shouldDropRank, updatePlayerRank, calculateGameRankInfo } from '@/lib/ranking';
import type { RankInfo, Position } from '@/lib/ranking';

export {
  db,
  calculatePointsForPosition,
  getRankByPoints,
  shouldDropRank,
  updatePlayerRank,
  calculateGameRankInfo,
  type RankInfo,
  type Position
}; 