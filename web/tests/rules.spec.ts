import { describe, expect, it } from 'vitest';
import { produce } from 'immer';

import {
  initGame,
  findLines,
  placeStone,
  drawFromBag,
  applyDamageToCell,
} from '../src/core/rules';
import { getStoneStats } from '../src/core/config';
import type { StoneInstance } from '../src/core/types';

function makeStone(owner: 'P1' | 'AI', type: StoneInstance['type']): StoneInstance {
  const stats = getStoneStats(type);
  return {
    id: `${owner}-${type}-${Math.random()}`,
    owner,
    type,
    hp: stats.maxHp,
    maxHp: stats.maxHp,
  };
}

describe('findLines', () => {
  it('detects horizontal and diagonal lines of length ≥3', () => {
    const state = initGame();
    const board = produce(state.board, (draft) => {
      draft.grid[0][0] = makeStone('P1', 'Basic');
      draft.grid[0][1] = makeStone('P1', 'Strong');
      draft.grid[0][2] = makeStone('P1', 'Basic');
      draft.grid[1][1] = makeStone('P1', 'Basic');
      draft.grid[2][2] = makeStone('P1', 'Basic');
      draft.grid[3][3] = makeStone('P1', 'Basic');
    });
    const lines = findLines(board);
    expect(lines.length).toBeGreaterThanOrEqual(2);
    const owners = new Set(lines.map((line) => line.owner));
    expect(owners.has('P1')).toBe(true);
  });
});

describe('on-place effects', () => {
  it('Cross stone damages orthogonal neighbors immediately', () => {
    let state = initGame(undefined, 'cross-seed');
    state = produce(state, (draft) => {
      draft.players.P1.hand.stones = ['Cross'];
      draft.board.grid[2][1] = makeStone('AI', 'Basic');
    });
    state = placeStone(state, 'P1', 0, 2, 2);
    const damaged = state.board.grid[2][1];
    expect(damaged?.hp).toBe(1);
  });

  it('Kamikaze stones only trigger when destroyed by damage', () => {
    let state = initGame(undefined, 'kamikaze-seed');
    state = produce(state, (draft) => {
      draft.board.grid[2][2] = makeStone('P1', 'Kamikaze');
    });
    const firstHit = applyDamageToCell(state, 2, 2, 1, undefined, 'AI');
    expect(firstHit.pendingDamage.AI).toBe(0);
    const secondHit = applyDamageToCell(
      firstHit.state,
      2,
      2,
      1,
      undefined,
      'AI',
    );
    expect(secondHit.pendingDamage.AI).toBe(1);
  });
});

describe('bag and RNG', () => {
  it('drawFromBag returns deterministic sequences per seed', () => {
    const first = initGame(undefined, 'seed-a');
    const second = initGame(undefined, 'seed-a');
    const draw1 = drawFromBag(first, 3, 'P1');
    const draw2 = drawFromBag(second, 3, 'P1');
    expect(draw1.stones).toEqual(draw2.stones);
  });

  it('same seed and actions keep states in sync', () => {
    const s1 = initGame(undefined, 'mirror-seed');
    const s2 = initGame(undefined, 'mirror-seed');
    const next1 = placeStone(s1, 'P1', 0, 2, 2);
    const next2 = placeStone(s2, 'P1', 0, 2, 2);
    expect(next1.players.AI.hp).toBe(next2.players.AI.hp);
    expect(next1.board.grid[2][2]?.type).toBe(next2.board.grid[2][2]?.type);
  });
});

