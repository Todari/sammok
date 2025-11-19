import { produce } from 'immer';
import type { Draft } from 'immer';

import { DEFAULT_CONFIG, getStoneStats, STONE_TYPES } from './config';
import { initRng, randomInt } from './rng';
import type {
  BagState,
  BoardState,
  GameConfig,
  GamePhase,
  GameState,
  LineMatch,
  PlayerBagState,
  PlayerId,
  StoneInstance,
  StoneType,
} from './types';

const LOG_LIMIT = 120;

const directions = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: 1 },
  { dx: 1, dy: -1 },
] as const;

const crossOffsets = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

const diagonalOffsets = [
  { dx: 1, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: -1 },
];

const mooreOffsets = [
  ...crossOffsets,
  ...diagonalOffsets,
];

type MutableGame = Draft<GameState>;

export function otherPlayer(player: PlayerId): PlayerId {
  return player === 'P1' ? 'AI' : 'P1';
}

export function initGame(
  overrides?: Partial<GameConfig>,
  seed: string = Date.now().toString(),
): GameState {
  const config = mergeConfig(overrides);
  const board = createEmptyBoard(config.boardSize);
  const bag = createBag(config.initialBag);
  let game: GameState = {
    config,
    board,
    bag,
    players: {
      P1: { id: 'P1', hp: config.startingHp, hand: { stones: [] } },
      AI: { id: 'AI', hp: config.startingHp, hand: { stones: [] } },
    },
    turn: 'P1',
    phase: 'AwaitPlacement',
    rngSeed: seed,
    rngState: initRng(seed),
    sequence: 0,
    log: ['게임이 시작되었습니다.'],
  };

  game = drawHand(game, 'P1');
  game = drawHand(game, 'AI');
  return game;
}

function mergeConfig(overrides?: Partial<GameConfig>): GameConfig {
  if (!overrides) {
    return DEFAULT_CONFIG;
  }
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    initialBag: overrides.initialBag ?? DEFAULT_CONFIG.initialBag,
    damage: overrides.damage ?? DEFAULT_CONFIG.damage,
    stoneStats: overrides.stoneStats ?? DEFAULT_CONFIG.stoneStats,
  };
}

function createEmptyBoard(size: number): BoardState {
  return {
    size,
    grid: Array.from({ length: size }, () => Array(size).fill(null)),
  };
}

function createBag(
  initialBag: Record<PlayerId, Record<StoneType, number>>,
): BagState {
  const perPlayer: Record<PlayerId, PlayerBagState> = {
    P1: createPlayerBag(initialBag.P1),
    AI: createPlayerBag(initialBag.AI),
  };
  return { perPlayer };
}

function createPlayerBag(
  source: Record<StoneType, number>,
): PlayerBagState {
  const counts: Record<StoneType, number> = {
    Basic: 0,
    Strong: 0,
    Tough: 0,
    Cross: 0,
    AoE: 0,
    Diagonal: 0,
    Kamikaze: 0,
  };
  STONE_TYPES.forEach((type) => {
    counts[type] = source?.[type] ?? 0;
  });
  const total = STONE_TYPES.reduce((sum, type) => sum + counts[type], 0);
  return { counts, total };
}

function addLog(draft: MutableGame, message: string) {
  draft.log.push(
    `[${new Date().toLocaleTimeString()}] ${message}`.slice(0, 200),
  );
  if (draft.log.length > LOG_LIMIT) {
    draft.log.shift();
  }
}

function consumeRandomInt(draft: MutableGame, maxExclusive: number): number {
  const { state, value } = randomInt(draft.rngState, maxExclusive);
  draft.rngState = state;
  return value;
}

export function canPlace(state: GameState, x: number, y: number): boolean {
  if (state.phase === 'GameOver') return false;
  if (x < 0 || y < 0 || x >= state.board.size || y >= state.board.size) {
    return false;
  }
  return state.board.grid[y][x] === null;
}

export function drawHand(state: GameState, playerId: PlayerId): GameState {
  return produce(state, (draft) => {
    const player = draft.players[playerId];
    if (player.hand.stones.length > 0) return;
    const drawn = drawFromBagMutable(draft, draft.config.handSize, playerId);
    if (!drawn) return;
    player.hand.stones = drawn;
    addLog(draft, `${playerId} 핸드 리필: ${drawn.join(', ')}`);
  });
}

function drawFromBagMutable(
  draft: MutableGame,
  count: number,
  playerId: PlayerId,
): StoneType[] | null {
  const result: StoneType[] = [];
  while (result.length < count) {
    const playerBag = draft.bag.perPlayer[playerId];
    if (playerBag.total <= 0) {
      draft.phase = 'GameOver';
      draft.winner = otherPlayer(playerId);
      addLog(draft, `${playerId} 백이 고갈되어 패배`);
      return null;
    }
    const roll = consumeRandomInt(draft, playerBag.total);
    let cumulative = 0;
    let picked: StoneType = STONE_TYPES[0];
    for (const type of STONE_TYPES) {
      cumulative += playerBag.counts[type];
      if (roll < cumulative) {
        picked = type;
        break;
      }
    }
    playerBag.counts[picked] -= 1;
    playerBag.total -= 1;
    result.push(picked);
  }
  return result;
}

function returnToBagMutable(
  draft: MutableGame,
  owner: PlayerId,
  stones: StoneType[],
) {
  const bag = draft.bag.perPlayer[owner];
  stones.forEach((type) => {
    bag.counts[type] += 1;
    bag.total += 1;
  });
}

interface PendingDamage {
  P1: number;
  AI: number;
}

export function placeStone(
  state: GameState,
  playerId: PlayerId,
  handIndex: number,
  x: number,
  y: number,
): GameState {
  if (!canPlace(state, x, y)) return state;
  if (state.turn !== playerId || state.phase === 'GameOver') return state;
  const handStone = state.players[playerId].hand.stones[handIndex];
  if (!handStone) return state;

  return produce(state, (draft) => {
    const player = draft.players[playerId];
    const stoneType = player.hand.stones[handIndex];
    if (!stoneType) return;

    draft.phase = 'Resolving';

    const stats = getStoneStats(stoneType, draft.config);
    const stone: StoneInstance = {
      id: `stone-${draft.sequence + 1}`,
      owner: playerId,
      type: stoneType,
      hp: stats.maxHp,
      maxHp: stats.maxHp,
    };
    draft.sequence += 1;
    draft.board.grid[y][x] = stone;
    player.hand.stones.splice(handIndex, 1);
    addLog(
      draft,
      `${playerId}가 ${stoneType} 돌을 (${x + 1}, ${y + 1}) 위치에 배치`,
    );

    const pendingDamage: PendingDamage = { P1: 0, AI: 0 };
    if (stats.onPlace === 'Cross') {
      applyOnPlaceDamage(
        draft,
        x,
        y,
        crossOffsets,
        pendingDamage,
        playerId,
      );
    } else if (stats.onPlace === 'AoE') {
      applyOnPlaceDamage(
        draft,
        x,
        y,
        mooreOffsets,
        pendingDamage,
        playerId,
      );
    } else if (stats.onPlace === 'Diagonal') {
      applyOnPlaceDamage(
        draft,
        x,
        y,
        diagonalOffsets,
        pendingDamage,
        playerId,
      );
    }

    const lines = findLines(draft.board);
    if (lines.length > 0) {
      resolveLines(draft, lines, pendingDamage);
    }

    applyPendingDamage(draft, pendingDamage, playerId);
    if ((draft.phase as GamePhase) === 'GameOver') return;

    if (player.hand.stones.length === 0) {
      const refill = drawFromBagMutable(
        draft,
        draft.config.handSize,
        playerId,
      );
      if (!refill) return;
      player.hand.stones = refill;
    }

    draft.turn = otherPlayer(playerId);
    draft.phase = 'AwaitPlacement';
  });
}

function applyOnPlaceDamage(
  draft: MutableGame,
  x: number,
  y: number,
  offsets: Array<{ dx: number; dy: number }>,
  pendingDamage: PendingDamage,
  source: PlayerId,
) {
  const boardSize = draft.config.boardSize;
  offsets.forEach(({ dx, dy }) => {
    const nx = x + dx;
    const ny = y + dy;
    if (!inBounds(nx, ny, boardSize)) return;
    damageCellMutable(draft, nx, ny, 1, pendingDamage, source);
  });
}

function damageCellMutable(
  draft: MutableGame,
  x: number,
  y: number,
  amount: number,
  pendingDamage: PendingDamage,
  source?: PlayerId,
) {
  const cell = draft.board.grid[y][x];
  if (!cell) return;
  const stats = getStoneStats(cell.type, draft.config);
  const nextHp = Math.max(0, (cell.hp as number) - amount);
  cell.hp = nextHp as StoneInstance['hp'];

  const destroyedByDamage = source !== undefined && cell.hp === 0;
  if (
    destroyedByDamage &&
    cell.type === 'Kamikaze' &&
    stats.onBrokenEnemyHp
  ) {
    const target = otherPlayer(cell.owner);
    pendingDamage[target] += stats.onBrokenEnemyHp;
    addLog(
      draft,
      `${cell.owner}의 Kamikaze가 폭발하여 ${target} HP에 ${stats.onBrokenEnemyHp} 데미지`,
    );
  }

  if (cell.hp === 0) {
    draft.board.grid[y][x] = null;
    returnToBagMutable(draft, cell.owner, [cell.type]);
    addLog(draft, `${cell.type} 돌이 제거되어 백으로 귀환`);
  }
}

function resolveLines(
  draft: MutableGame,
  lines: LineMatch[],
  pendingDamage: PendingDamage,
) {
  const removedSet = new Set<string>();
  lines.forEach((line) => {
    const strongCount = line.cells.reduce((acc, { x, y }) => {
      const cell = draft.board.grid[y][x];
      return cell?.type === 'Strong' ? acc + 1 : acc;
    }, 0);
    const damage =
      draft.config.damage.lineBase +
      strongCount * draft.config.damage.strongBonusPerLineStone;
    const target = otherPlayer(line.owner);
    pendingDamage[target] += damage;
    addLog(
      draft,
      `${line.owner} 라인 완성 (${line.cells.length}칸) → ${target} HP -${damage}`,
    );

    line.cells.forEach(({ x, y }) => {
      const key = `${x},${y}`;
      if (removedSet.has(key)) return;
      removedSet.add(key);
      const cell = draft.board.grid[y][x];
      if (!cell) return;
      draft.board.grid[y][x] = null;
      returnToBagMutable(draft, cell.owner, [cell.type]);
    });
  });
}

function applyPendingDamage(
  draft: MutableGame,
  pending: PendingDamage,
  attacker: PlayerId,
) {
  (['P1', 'AI'] as PlayerId[]).forEach((playerId) => {
    const dmg = pending[playerId];
    if (!dmg) return;
    draft.players[playerId].hp = Math.max(
      0,
      draft.players[playerId].hp - dmg,
    );
    addLog(
      draft,
      `${playerId} HP ${dmg} 감소 (잔여 ${draft.players[playerId].hp})`,
    );
  });

  const p1Dead = draft.players.P1.hp <= 0;
  const aiDead = draft.players.AI.hp <= 0;
  if (p1Dead || aiDead) {
    draft.phase = 'GameOver';
    if (p1Dead && aiDead) {
      draft.winner = attacker;
      addLog(draft, `양측 동시 파괴 → ${attacker} 승리`);
    } else if (p1Dead) {
      draft.winner = 'AI';
    } else if (aiDead) {
      draft.winner = 'P1';
    }
  }
}

export function findLines(board: BoardState): LineMatch[] {
  const lines: LineMatch[] = [];
  const boardSize = board.size;
  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      const cell = board.grid[y][x];
      if (!cell) continue;
      directions.forEach(({ dx, dy }) => {
        const prevX = x - dx;
        const prevY = y - dy;
        if (
          inBounds(prevX, prevY, boardSize) &&
          board.grid[prevY][prevX]?.owner === cell.owner
        ) {
          return;
        }
        const cells: Array<{ x: number; y: number }> = [];
        let cx = x;
        let cy = y;
        while (
          inBounds(cx, cy, boardSize) &&
          board.grid[cy][cx]?.owner === cell.owner
        ) {
          cells.push({ x: cx, y: cy });
          cx += dx;
          cy += dy;
        }
        if (cells.length >= 3) {
          lines.push({ owner: cell.owner, cells });
        }
      });
    }
  }
  return lines;
}

export function neighborsCross(x: number, y: number, boardSize: number) {
  return crossOffsets
    .map(({ dx, dy }) => ({ x: x + dx, y: y + dy }))
    .filter(({ x: nx, y: ny }) => inBounds(nx, ny, boardSize));
}

export function neighborsDiagonal(x: number, y: number, boardSize: number) {
  return diagonalOffsets
    .map(({ dx, dy }) => ({ x: x + dx, y: y + dy }))
    .filter(({ x: nx, y: ny }) => inBounds(nx, ny, boardSize));
}

export function neighborsMoore(x: number, y: number, boardSize: number) {
  return mooreOffsets
    .map(({ dx, dy }) => ({ x: x + dx, y: y + dy }))
    .filter(({ x: nx, y: ny }) => inBounds(nx, ny, boardSize));
}

/**
 * Immutable helper that exposes the bag draw mechanic for tests.
 */
export function drawFromBag(
  state: GameState,
  count: number,
  playerId: PlayerId,
): { state: GameState; stones: StoneType[] | null } {
  let stones: StoneType[] | null = null;
  const next = produce(state, (draft) => {
    stones = drawFromBagMutable(draft, count, playerId);
  });
  return { state: next, stones };
}

export function returnToBag(
  state: GameState,
  owner: PlayerId,
  stones: StoneType[],
): GameState {
  return produce(state, (draft) => {
    returnToBagMutable(draft, owner, stones);
  });
}

export function applyDamageToCell(
  state: GameState,
  x: number,
  y: number,
  amount: number,
  baseDamage?: Partial<Record<PlayerId, number>>,
  source?: PlayerId,
): { state: GameState; pendingDamage: PendingDamage } {
  const buffer: PendingDamage = {
    P1: baseDamage?.P1 ?? 0,
    AI: baseDamage?.AI ?? 0,
  };
  const next = produce(state, (draft) => {
    damageCellMutable(draft, x, y, amount, buffer, source);
  });
  return { state: next, pendingDamage: buffer };
}

function inBounds(x: number, y: number, boardSize: number) {
  return x >= 0 && y >= 0 && x < boardSize && y < boardSize;
}

