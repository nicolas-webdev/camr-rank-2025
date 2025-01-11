import prisma from './prisma';
import { calculatePointsForPosition, getRankByPoints, shouldDropRank, updatePlayerRank, calculateGameRankInfo } from './ranking';
import type { RankInfo, Position } from './ranking';

export { prisma as db };
export {
  calculatePointsForPosition,
  getRankByPoints,
  shouldDropRank,
  updatePlayerRank,
  calculateGameRankInfo,
  type RankInfo,
  type Position,
}; 