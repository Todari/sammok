import type { GameState, Move, PlayerId, StoneType } from '../core/types';
import { canPlace, otherPlayer } from '../core/rules';

export interface BotStrategy {
  chooseMove(state: GameState, playerId: PlayerId): Move | null;
}

const DIRECTIONS = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: 1 },
  { dx: 1, dy: -1 },
] as const;

const EFFECT_WEIGHTS: Record<StoneType, number> = {
  Basic: 1,
  Strong: 3,
  Tough: 2,
  Cross: 4,
  AoE: 5,
  Kamikaze: 3,
};

export class GreedyHeuristicBot implements BotStrategy {
  chooseMove(state: GameState, playerId: PlayerId): Move | null {
    const moves = enumerateMoves(state, playerId);
    if (moves.length === 0) return null;

    let best: Move | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;
    moves.forEach((move) => {
      const score = evaluateMove(state, move, playerId);
      if (score > bestScore) {
        bestScore = score;
        best = move;
      }
    });
    return best;
  }
}

function enumerateMoves(state: GameState, playerId: PlayerId): Move[] {
  const boardSize = state.board.size;
  const moves: Move[] = [];
  const hand = state.players[playerId].hand.stones;
  hand.forEach((_, handIndex) => {
    for (let y = 0; y < boardSize; y += 1) {
      for (let x = 0; x < boardSize; x += 1) {
        if (canPlace(state, x, y)) {
          moves.push({ handIndex, x, y });
        }
      }
    }
  });
  return moves;
}

function evaluateMove(
  state: GameState,
  move: Move,
  playerId: PlayerId,
): number {
  const { handIndex, x, y } = move;
  const stoneType = state.players[playerId].hand.stones[handIndex];
  const centerBias = -(
    Math.abs(x - Math.floor(state.board.size / 2)) +
    Math.abs(y - Math.floor(state.board.size / 2))
  );

  if (wouldCompleteLine(state, playerId, x, y)) {
    return 1000 + EFFECT_WEIGHTS[stoneType] * 5 + centerBias;
  }

  if (wouldCompleteLine(state, otherPlayer(playerId), x, y)) {
    return 500 + EFFECT_WEIGHTS[stoneType] * 3 + centerBias;
  }

  return EFFECT_WEIGHTS[stoneType] * 10 + centerBias;
}

function wouldCompleteLine(
  state: GameState,
  owner: PlayerId,
  x: number,
  y: number,
): boolean {
  const size = state.board.size;
  return DIRECTIONS.some(({ dx, dy }) => {
    let count = 1; // include the hypothetical stone
    count += countDirection(state, owner, x, y, dx, dy);
    count += countDirection(state, owner, x, y, -dx, -dy);
    return count >= 3;
  });
}

function countDirection(
  state: GameState,
  owner: PlayerId,
  startX: number,
  startY: number,
  dx: number,
  dy: number,
): number {
  let cx = startX + dx;
  let cy = startY + dy;
  let count = 0;
  while (
    cx >= 0 &&
    cy >= 0 &&
    cx < state.board.size &&
    cy < state.board.size &&
    state.board.grid[cy][cx]?.owner === owner
  ) {
    count += 1;
    cx += dx;
    cy += dy;
  }
  return count;
}

export const defaultBot = new GreedyHeuristicBot();

