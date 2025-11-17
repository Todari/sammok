import type { GameConfig, StoneStats, StoneType } from './types';

export const STONE_TYPES: StoneType[] = [
  'Basic',
  'Strong',
  'Tough',
  'Cross',
  'AoE',
  'Kamikaze',
];

export const STONE_STATS: Record<StoneType, StoneStats> = {
  Basic: { type: 'Basic', maxHp: 2, onPlace: null },
  Strong: { type: 'Strong', maxHp: 2, onPlace: null },
  Tough: { type: 'Tough', maxHp: 3, onPlace: null },
  Cross: { type: 'Cross', maxHp: 2, onPlace: 'Cross' },
  AoE: { type: 'AoE', maxHp: 2, onPlace: 'AoE' },
  Kamikaze: { type: 'Kamikaze', maxHp: 2, onPlace: null, onBrokenEnemyHp: 1 },
};

export const DEFAULT_CONFIG: GameConfig = {
  boardSize: 5,
  startingHp: 10,
  handSize: 3,
  bagTotal: 10,
  initialBag: {
    P1: {
      Strong: 2,
      Tough: 1,
      Cross: 2,
      AoE: 2,
      Kamikaze: 1,
      Basic: 2,
    },
    AI: {
      Strong: 2,
      Tough: 1,
      Cross: 2,
      AoE: 2,
      Kamikaze: 1,
      Basic: 2,
    },
  },
  damage: {
    lineBase: 1,
    strongBonusPerLineStone: 1,
  },
};

export function getStoneStats(type: StoneType): StoneStats {
  return STONE_STATS[type];
}

