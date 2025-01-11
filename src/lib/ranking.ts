export type RankInfo = {
  kanji: string;
  translation: string;
  pointsToNextRank: number;
  canDropBelowZero: boolean;
  cumulativePointsToNextRank: number;
  minimumPointsToKeepRank: number;
  hanchanPoints: {
    first: number;
    second: number;
    third: number;
    fourth: number;
  };
  tonpuusenPoints: {
    first: number;
    second: number;
    third: number;
    fourth: number;
  };
};

export const ranks: RankInfo[] = [
  {
    kanji: '新人',
    translation: 'Principiante',
    pointsToNextRank: 50,
    canDropBelowZero: false,
    cumulativePointsToNextRank: 50,
    minimumPointsToKeepRank: 0,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: 0 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: 0 }
  },
  {
    kanji: '9級',
    translation: '9no kyu',
    pointsToNextRank: 50,
    canDropBelowZero: false,
    cumulativePointsToNextRank: 100,
    minimumPointsToKeepRank: 0,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: 0 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: 0 }
  },
  {
    kanji: '8級',
    translation: '8vo kyu',
    pointsToNextRank: 100,
    canDropBelowZero: false,
    cumulativePointsToNextRank: 200,
    minimumPointsToKeepRank: 0,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: 0 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: 0 }
  },
  {
    kanji: '7級',
    translation: '7mo kyu',
    pointsToNextRank: 100,
    canDropBelowZero: false,
    cumulativePointsToNextRank: 300,
    minimumPointsToKeepRank: 0,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: 0 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: 0 }
  },
  {
    kanji: '6級',
    translation: '6to kyu',
    pointsToNextRank: 100,
    canDropBelowZero: false,
    cumulativePointsToNextRank: 400,
    minimumPointsToKeepRank: 0,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: 0 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: 0 }
  },
  {
    kanji: '5級',
    translation: '5to kyu',
    pointsToNextRank: 100,
    canDropBelowZero: false,
    cumulativePointsToNextRank: 500,
    minimumPointsToKeepRank: 0,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: 0 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: 0 }
  },
  {
    kanji: '4級',
    translation: '4to kyu',
    pointsToNextRank: 100,
    canDropBelowZero: false,
    cumulativePointsToNextRank: 600,
    minimumPointsToKeepRank: 0,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: 0 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: 0 }
  },
  {
    kanji: '3級',
    translation: '3er kyu',
    pointsToNextRank: 100,
    canDropBelowZero: false,
    cumulativePointsToNextRank: 700,
    minimumPointsToKeepRank: 0,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: 0 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: 0 }
  },
  {
    kanji: '2級',
    translation: '2do kyu',
    pointsToNextRank: 150,
    canDropBelowZero: false,
    cumulativePointsToNextRank: 850,
    minimumPointsToKeepRank: 0,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: 0 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: 0 }
  },
  {
    kanji: '1級',
    translation: '1er kyu',
    pointsToNextRank: 150,
    canDropBelowZero: false,
    cumulativePointsToNextRank: 1000,
    minimumPointsToKeepRank: 0,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: -30 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: -20 }
  },
  {
    kanji: '初段',
    translation: '1er dan',
    pointsToNextRank: 200,
    canDropBelowZero: true,
    cumulativePointsToNextRank: 1200,
    minimumPointsToKeepRank: 1200,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: -30 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: -20 }
  },
  {
    kanji: '二段',
    translation: '2do dan',
    pointsToNextRank: 400,
    canDropBelowZero: true,
    cumulativePointsToNextRank: 1600,
    minimumPointsToKeepRank: 1200,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: -30 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: -20 }
  },
  {
    kanji: '三段',
    translation: '3er dan',
    pointsToNextRank: 400,
    canDropBelowZero: true,
    cumulativePointsToNextRank: 2000,
    minimumPointsToKeepRank: 1600,
    hanchanPoints: { first: 60, second: 30, third: 0, fourth: -30 },
    tonpuusenPoints: { first: 40, second: 20, third: 0, fourth: -20 }
  },
  {
    kanji: '四段',
    translation: '4to dan',
    pointsToNextRank: 600,
    canDropBelowZero: true,
    cumulativePointsToNextRank: 2600,
    minimumPointsToKeepRank: 2000,
    hanchanPoints: { first: 60, second: 30, third: -15, fourth: -45 },
    tonpuusenPoints: { first: 40, second: 20, third: -10, fourth: -30 }
  },
  {
    kanji: '五段',
    translation: '5to dan',
    pointsToNextRank: 600,
    canDropBelowZero: true,
    cumulativePointsToNextRank: 3200,
    minimumPointsToKeepRank: 2600,
    hanchanPoints: { first: 60, second: 30, third: -15, fourth: -45 },
    tonpuusenPoints: { first: 40, second: 20, third: -10, fourth: -30 }
  },
  {
    kanji: '六段',
    translation: '6to dan',
    pointsToNextRank: 800,
    canDropBelowZero: true,
    cumulativePointsToNextRank: 4000,
    minimumPointsToKeepRank: 3200,
    hanchanPoints: { first: 60, second: 30, third: -15, fourth: -45 },
    tonpuusenPoints: { first: 40, second: 20, third: -10, fourth: -30 }
  },
  {
    kanji: '七段',
    translation: '7mo dan',
    pointsToNextRank: 1000,
    canDropBelowZero: true,
    cumulativePointsToNextRank: 5000,
    minimumPointsToKeepRank: 4000,
    hanchanPoints: { first: 60, second: 30, third: -30, fourth: -60 },
    tonpuusenPoints: { first: 40, second: 20, third: -20, fourth: -40 }
  },
  {
    kanji: '八段',
    translation: '8vo dan',
    pointsToNextRank: 1000,
    canDropBelowZero: true,
    cumulativePointsToNextRank: 6000,
    minimumPointsToKeepRank: 5000,
    hanchanPoints: { first: 60, second: 30, third: -30, fourth: -60 },
    tonpuusenPoints: { first: 40, second: 20, third: -20, fourth: -40 }
  },
  {
    kanji: '九段',
    translation: '9no dan',
    pointsToNextRank: 1500,
    canDropBelowZero: true,
    cumulativePointsToNextRank: 7500,
    minimumPointsToKeepRank: 6000,
    hanchanPoints: { first: 60, second: 30, third: -30, fourth: -75 },
    tonpuusenPoints: { first: 40, second: 20, third: -20, fourth: -50 }
  },
  {
    kanji: '十段',
    translation: '10mo dan',
    pointsToNextRank: 1500,
    canDropBelowZero: true,
    cumulativePointsToNextRank: 9000,
    minimumPointsToKeepRank: 7500,
    hanchanPoints: { first: 60, second: 30, third: -45, fourth: -75 },
    tonpuusenPoints: { first: 40, second: 20, third: -30, fourth: -50 }
  },
  {
    kanji: '神室王',
    translation: 'Rey Dios',
    pointsToNextRank: 0,
    canDropBelowZero: true,
    cumulativePointsToNextRank: Infinity,
    minimumPointsToKeepRank: 9000,
    hanchanPoints: { first: 60, second: 30, third: -30, fourth: -60 },
    tonpuusenPoints: { first: 40, second: 20, third: -20, fourth: -40 }
  }
];

export function getRankByPoints(points: number): RankInfo {
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (points >= ranks[i].cumulativePointsToNextRank) {
      return ranks[i];
    }
  }
  return ranks[0]; // Return beginner rank if points are too low
}

export function calculatePointsForPosition(rank: RankInfo, position: number, isHanchan: boolean = true): number {
  const pointsTable = isHanchan ? rank.hanchanPoints : rank.tonpuusenPoints;
  switch (position) {
    case 0:
      return pointsTable.first;
    case 1:
      return pointsTable.second;
    case 2:
      return pointsTable.third;
    case 3:
      return pointsTable.fourth;
    default:
      return 0;
  }
}

export function shouldDropRank(rank: RankInfo, points: number): boolean {
  return rank.canDropBelowZero && points < rank.minimumPointsToKeepRank;
} 