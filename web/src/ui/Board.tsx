import { useMemo } from 'react';

import {
  neighborsCross,
  neighborsDiagonal,
  neighborsMoore,
} from '../core/rules';
import type {
  BoardState,
  PlayerId,
  StoneInstance,
  StoneType,
} from '../core/types';

interface Coordinate {
  x: number;
  y: number;
}

interface BoardProps {
  board: BoardState;
  turn: PlayerId;
  canInteract: boolean;
  hoveredCell: Coordinate | null;
  focusedCell: Coordinate;
  selectedStone: StoneType | null;
  onSelect: (coord: Coordinate) => void;
  onHover: (coord: Coordinate | null) => void;
}

export function Board({
  board,
  turn,
  canInteract,
  hoveredCell,
  focusedCell,
  selectedStone,
  onSelect,
  onHover,
}: BoardProps) {
  const previewSet = useMemo(() => {
    if (!selectedStone || !hoveredCell) return new Set<string>();
    if (selectedStone === 'Cross') {
      return new Set(
        neighborsCross(hoveredCell.x, hoveredCell.y, board.size).map(
          ({ x, y }) => `${x},${y}`,
        ),
      );
    }
    if (selectedStone === 'Diagonal') {
      return new Set(
        neighborsDiagonal(hoveredCell.x, hoveredCell.y, board.size).map(
          ({ x, y }) => `${x},${y}`,
        ),
      );
    }
    if (selectedStone === 'AoE') {
      return new Set(
        neighborsMoore(hoveredCell.x, hoveredCell.y, board.size).map(
          ({ x, y }) => `${x},${y}`,
        ),
      );
    }
    return new Set<string>();
  }, [selectedStone, hoveredCell, board.size]);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted">
        보드 · 현재 턴: <span className="font-semibold">{turn}</span>
      </div>
      <div
        className={`grid h-[480px] w-[480px] gap-2 rounded-xl bg-board/80 p-4 shadow-lg`}
        style={{
          gridTemplateColumns: `repeat(${board.size}, 1fr)`,
        }}
        role="grid"
        aria-label="Sammok Board"
      >
        {board.grid.map((row, y) =>
          row.map((cell, x) => {
            const isFocused = focusedCell.x === x && focusedCell.y === y;
            const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
            const preview =
              previewSet.has(`${x},${y}`) || isHovered ? 'ring-2 ring-primary/60' : '';
            const disabled = !canInteract || cell !== null;
            return (
              <button
                key={`${x}-${y}`}
                type="button"
                className={`relative flex items-center justify-center rounded-lg border border-white/10 bg-slate-900/60 transition
                  ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-primary'}
                  ${isFocused ? 'outline outline-2 outline-primary/70' : ''}
                  ${preview}
                `}
                role="gridcell"
                aria-disabled={disabled}
                aria-label={`(${x + 1}, ${y + 1})`}
                onClick={() => !disabled && onSelect({ x, y })}
                onMouseEnter={() => onHover({ x, y })}
                onMouseLeave={() => onHover(null)}
              >
                {cell ? <Stone token={cell} /> : null}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}

function Stone({ token }: { token: StoneInstance }) {
  const ownerColor =
    token.owner === 'P1'
      ? 'bg-primary/70 border-primary/80'
      : 'bg-danger/70 border-danger/80';
  const cracked = token.hp === 1 ? 'cracked' : '';
  return (
    <div
      className={`flex h-16 w-16 flex-col items-center justify-center rounded-lg border text-center text-xs font-semibold text-white ${ownerColor} ${cracked}`}
    >
      <span className="text-[10px] uppercase tracking-wide opacity-80">
        {token.owner}
      </span>
      <span>{token.type}</span>
      <span className="text-[11px]">
        HP {token.hp}/{token.maxHp}
      </span>
    </div>
  );
}

