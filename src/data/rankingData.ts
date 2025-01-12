import { RankInfo } from '@/types/ranking';

export const RANKING_DATA: RankInfo[] = [
  {
    kanji: '新人',
    name: 'Principiante',
    pointsToNextRank: 50,
    canDemote: false,
    totalPointsRequired: 0,
    minimumPoints: 0,
    pointVariation: {
      hanchan: {
        first: 60,
        second: 30,
        third: 0,
        fourth: 0
      },
      tonpuusen: {
        first: 40,
        second: 20,
        third: 0,
        fourth: 0
      }
    }
  },
  {
    kanji: '雀士',
    name: 'Jugador',
    pointsToNextRank: 100,
    canDemote: true,
    totalPointsRequired: 50,
    minimumPoints: 0,
    pointVariation: {
      hanchan: {
        first: 90,
        second: 45,
        third: -15,
        fourth: -45
      },
      tonpuusen: {
        first: 60,
        second: 30,
        third: -10,
        fourth: -30
      }
    }
  },
  {
    kanji: '雀傑',
    name: 'Experto',
    pointsToNextRank: 200,
    canDemote: true,
    totalPointsRequired: 150,
    minimumPoints: 50,
    pointVariation: {
      hanchan: {
        first: 120,
        second: 60,
        third: -20,
        fourth: -60
      },
      tonpuusen: {
        first: 80,
        second: 40,
        third: -15,
        fourth: -40
      }
    }
  },
  {
    kanji: '雀豪',
    name: 'Maestro',
    pointsToNextRank: 400,
    canDemote: true,
    totalPointsRequired: 350,
    minimumPoints: 150,
    pointVariation: {
      hanchan: {
        first: 180,
        second: 90,
        third: -30,
        fourth: -90
      },
      tonpuusen: {
        first: 120,
        second: 60,
        third: -20,
        fourth: -60
      }
    }
  },
  {
    kanji: '雀聖',
    name: 'Santo',
    pointsToNextRank: 800,
    canDemote: true,
    totalPointsRequired: 750,
    minimumPoints: 350,
    pointVariation: {
      hanchan: {
        first: 270,
        second: 135,
        third: -45,
        fourth: -135
      },
      tonpuusen: {
        first: 180,
        second: 90,
        third: -30,
        fourth: -90
      }
    }
  },
  {
    kanji: '天鳳',
    name: 'Celestial',
    pointsToNextRank: 1200,
    canDemote: true,
    totalPointsRequired: 1550,
    minimumPoints: 750,
    pointVariation: {
      hanchan: {
        first: 405,
        second: 202,
        third: -67,
        fourth: -202
      },
      tonpuusen: {
        first: 270,
        second: 135,
        third: -45,
        fourth: -135
      }
    }
  },
  {
    kanji: '天極',
    name: 'Celestial Supremo',
    pointsToNextRank: 2000,
    canDemote: true,
    totalPointsRequired: 2750,
    minimumPoints: 1550,
    pointVariation: {
      hanchan: {
        first: 607,
        second: 303,
        third: -101,
        fourth: -303
      },
      tonpuusen: {
        first: 405,
        second: 202,
        third: -67,
        fourth: -202
      }
    }
  },
  {
    kanji: '神室',
    name: 'Divino',
    pointsToNextRank: 3000,
    canDemote: true,
    totalPointsRequired: 4750,
    minimumPoints: 2750,
    pointVariation: {
      hanchan: {
        first: 910,
        second: 455,
        third: -151,
        fourth: -455
      },
      tonpuusen: {
        first: 607,
        second: 303,
        third: -101,
        fourth: -303
      }
    }
  },
  {
    kanji: '神室王',
    name: 'Rey Dios',
    pointsToNextRank: Infinity,
    canDemote: true,
    totalPointsRequired: 7750,
    minimumPoints: 4750,
    pointVariation: {
      hanchan: {
        first: 1365,
        second: 682,
        third: -227,
        fourth: -682
      },
      tonpuusen: {
        first: 910,
        second: 455,
        third: -151,
        fourth: -455
      }
    }
  }
]; 