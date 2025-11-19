import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { defaultBot } from '../ai/bot';
import { drawHand, initGame, placeStone, canPlace } from '../core/rules';
import type { GameState } from '../core/types';

type ThemeMode = 'light' | 'dark';

interface Coordinate {
  x: number;
  y: number;
}

interface UiState {
  selectedHandIndex: number | null;
  hoveredCell: Coordinate | null;
  focusedCell: Coordinate;
  theme: ThemeMode;
}

interface GameStoreState {
  game: GameState;
  ui: UiState;
  init: (seed?: string) => void;
  selectHand: (index: number | null) => void;
  hoverCell: (cell: Coordinate | null) => void;
  moveFocus: (dx: number, dy: number) => void;
  placeAt: (x: number, y: number) => void;
  performAiTurn: () => void;
  toggleTheme: () => void;
}

const initialUiState: UiState = {
  selectedHandIndex: null,
  hoveredCell: null,
  focusedCell: { x: 2, y: 2 },
  theme: 'light',
};

const createInitialState = (seed?: string): GameStoreState => ({
  game: initGame(undefined, seed),
  ui: { ...initialUiState },
  init: () => undefined,
  selectHand: () => undefined,
  hoverCell: () => undefined,
  moveFocus: () => undefined,
  placeAt: () => undefined,
  performAiTurn: () => undefined,
  toggleTheme: () => undefined,
});

export const useGameStore = create<GameStoreState>()(
  immer((set) => ({
    ...createInitialState('SAMMOK-SEED'),
    init: (seed?: string) =>
      set(() => ({
        game: initGame(undefined, seed),
        ui: { ...initialUiState },
      })),
    selectHand: (index: number | null) =>
      set((state) => {
        if (index === null) {
          state.ui.selectedHandIndex = null;
          return;
        }
        const hand = state.game.players.P1.hand.stones;
        if (index >= 0 && index < hand.length) {
          state.ui.selectedHandIndex = index;
        }
      }),
    hoverCell: (cell: Coordinate | null) =>
      set((state) => {
        state.ui.hoveredCell = cell;
        if (cell) {
          state.ui.focusedCell = cell;
        }
      }),
    moveFocus: (dx: number, dy: number) =>
      set((state) => {
        const next = {
          x: clampCell(state.ui.focusedCell.x + dx),
          y: clampCell(state.ui.focusedCell.y + dy),
        };
        state.ui.focusedCell = next;
      }),
    placeAt: (x: number, y: number) =>
      set((state) => {
        if (state.game.phase !== 'AwaitPlacement') return;
        const selected = state.ui.selectedHandIndex ?? 0;
        if (!canPlace(state.game, x, y)) return;
        if (
          selected < 0 ||
          selected >= state.game.players.P1.hand.stones.length
        ) {
          return;
        }
        const nextState = placeStone(state.game, 'P1', selected, x, y);
        state.game = nextState;
        if (nextState.turn !== 'P1') {
          state.ui.selectedHandIndex = null;
        } else if (nextState.players.P1.hand.stones.length === 0) {
          state.ui.selectedHandIndex = null;
        } else if (selected >= nextState.players.P1.hand.stones.length) {
          state.ui.selectedHandIndex =
            nextState.players.P1.hand.stones.length - 1;
        }
      }),
    performAiTurn: () =>
      set((state) => {
        if (
          state.game.phase !== 'AwaitPlacement' ||
          state.game.turn !== 'AI'
        ) {
          return;
        }
        const move = defaultBot.chooseMove(state.game, 'AI');
        if (move) {
          state.game = placeStone(state.game, 'AI', move.handIndex, move.x, move.y);
          return;
        }
        state.game.players.AI.hand.stones = [];
        state.game = drawHand(state.game, 'AI');
      }),
    toggleTheme: () =>
      set((state) => {
        state.ui.theme = state.ui.theme === 'light' ? 'dark' : 'light';
      }),
  })),
);

function clampCell(value: number) {
  return Math.max(0, Math.min(BOARD_LIMIT, value));
}

const BOARD_SIZE = 5;
const BOARD_LIMIT = BOARD_SIZE - 1;

