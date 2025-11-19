export type PlayerId = 'P1' | 'AI';

export type StoneType =
  | 'Basic'
  | 'Strong'
  | 'Tough'
  | 'Cross'
  | 'AoE'
  | 'Diagonal'
  | 'Kamikaze';

export type OnPlaceEffect = 'Cross' | 'AoE' | 'Diagonal' | null;

export interface StoneStats {
  type: StoneType;
  maxHp: number;
  onPlace?: OnPlaceEffect;
  onBrokenEnemyHp?: number;
}

export interface StoneInstance {
  id: string;
  owner: PlayerId;
  type: StoneType;
  hp: number;
  maxHp: number;
}

export type Cell = StoneInstance | null;

export interface BoardState {
  size: number;
  grid: Cell[][];
}

export interface PlayerBagState {
  counts: Record<StoneType, number>;
  total: number;
}

export interface BagState {
  perPlayer: Record<PlayerId, PlayerBagState>;
}

export interface HandState {
  stones: StoneType[];
}

export interface PlayerState {
  id: PlayerId;
  hp: number;
  hand: HandState;
}

export interface DamageConfig {
  lineBase: number;
  strongBonusPerLineStone: number;
}

export interface GameConfig {
  boardSize: number;
  startingHp: number;
  handSize: number;
  bagTotal: number;
  initialBag: Record<PlayerId, Record<StoneType, number>>;
  damage: DamageConfig;
  stoneStats: Record<StoneType, StoneStats>;
}

export type GamePhase = 'Idle' | 'AwaitPlacement' | 'Resolving' | 'GameOver';

export interface LineMatch {
  owner: PlayerId;
  cells: Array<{ x: number; y: number }>;
}

export interface GameState {
  config: GameConfig;
  board: BoardState;
  bag: BagState;
  players: Record<PlayerId, PlayerState>;
  turn: PlayerId;
  phase: GamePhase;
  rngSeed: string;
  rngState: number;
  sequence: number;
  log: string[];
  winner?: PlayerId;
}

export interface Move {
  handIndex: number;
  x: number;
  y: number;
}

