declare module '@/lib' {
  import { PrismaClient } from '@prisma/client';
  export const db: PrismaClient;
  
  export interface RankInfo {
    kanji: string;
    translation: string;
    pointsToNextRank: number;
    pointsToDropRank: number;
    pointsForPosition: {
      hanchan: number[];
      tonpuusen: number[];
    };
  }
  
  export function calculatePointsForPosition(position: string | number, isHanchan: boolean, currentRank: string): number;
  export function getRankByPoints(points: number): RankInfo;
  export function shouldDropRank(points: number, currentRank: string): boolean;
} 