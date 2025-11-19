import type { GameConfig, StoneStats, StoneType } from './types';

export const STONE_TYPES: StoneType[] = [
  'Basic',
  'Strong',
  'Tough',
  'Cross',
  'AoE',
  'Diagonal',
  'Kamikaze',
];

export const STONE_STATS: Record<StoneType, StoneStats> = {
  Basic: { type: 'Basic', maxHp: 1, onPlace: null },
  Strong: { type: 'Strong', maxHp: 1, onPlace: null },
  Tough: { type: 'Tough', maxHp: 2, onPlace: null },
  Cross: { type: 'Cross', maxHp: 1, onPlace: 'Cross' },
  AoE: { type: 'AoE', maxHp: 1, onPlace: 'AoE' },
  Diagonal: { type: 'Diagonal', maxHp: 1, onPlace: 'Diagonal' },
  Kamikaze: { type: 'Kamikaze', maxHp: 1, onPlace: null, onBrokenEnemyHp: 1 },
};

export const DEFAULT_CONFIG: GameConfig = {
  boardSize: 4,
  startingHp: 10,
  handSize: 3,
  bagTotal: 10,
  initialBag: {
    P1: {
      Basic: 5,
      Strong: 1,
      Tough: 1,
      Cross: 1,
      AoE: 0,
      Diagonal: 1,
      Kamikaze: 1,
    },
    AI: {
      Basic: 5,
      Strong: 1,
      Tough: 1,
      Cross: 1,
      AoE: 0,
      Diagonal: 1,
      Kamikaze: 1,
    },
  },
  damage: {
    lineBase: 1,
    strongBonusPerLineStone: 1,
  },
  stoneStats: STONE_STATS,
};

export function getStoneStats(
  type: StoneType,
  config?: GameConfig,
): StoneStats {
  if (config) {
    return config.stoneStats[type];
  }
  return STONE_STATS[type];
}

