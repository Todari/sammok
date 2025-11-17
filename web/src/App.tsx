import { useEffect } from 'react';

import { useGameStore } from './store/gameStore';
import { Board } from './ui/Board';
import { Hand } from './ui/Hand';
import { Hud } from './ui/Hud';
import { BagView } from './ui/BagView';
import { LogPanel } from './ui/LogPanel';
import { ThemeToggle } from './ui/ThemeToggle';

function App() {
  const game = useGameStore((state) => state.game);
  const ui = useGameStore((state) => state.ui);
  const selectHand = useGameStore((state) => state.selectHand);
  const hoverCell = useGameStore((state) => state.hoverCell);
  const moveFocus = useGameStore((state) => state.moveFocus);
  const placeAt = useGameStore((state) => state.placeAt);
  const performAiTurn = useGameStore((state) => state.performAiTurn);
  const init = useGameStore((state) => state.init);
  const toggleTheme = useGameStore((state) => state.toggleTheme);

  const isPlayerTurn =
    game.turn === 'P1' && game.phase === 'AwaitPlacement' && !game.winner;

  const selectedStone =
    ui.selectedHandIndex !== null
      ? game.players.P1.hand.stones[ui.selectedHandIndex] ?? null
      : null;

  useEffect(() => {
    document.documentElement.dataset.theme = ui.theme;
  }, [ui.theme]);

  useEffect(() => {
    if (game.turn === 'AI' && game.phase === 'AwaitPlacement' && !game.winner) {
      const handle = window.setTimeout(() => performAiTurn(), 400);
      return () => window.clearTimeout(handle);
    }
    return undefined;
  }, [game.turn, game.phase, game.winner, performAiTurn]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!isPlayerTurn) return;
      switch (event.key) {
        case 'ArrowUp':
          moveFocus(0, -1);
          event.preventDefault();
          break;
        case 'ArrowDown':
          moveFocus(0, 1);
          event.preventDefault();
          break;
        case 'ArrowLeft':
          moveFocus(-1, 0);
          event.preventDefault();
          break;
        case 'ArrowRight':
          moveFocus(1, 0);
          event.preventDefault();
          break;
        case ' ':
        case 'Enter':
          placeAt(ui.focusedCell.x, ui.focusedCell.y);
          event.preventDefault();
          break;
        case '1':
        case '2':
        case '3': {
          const idx = Number(event.key) - 1;
          selectHand(idx);
          event.preventDefault();
          break;
        }
        default:
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlayerTurn, moveFocus, placeAt, selectHand, ui.focusedCell]);

  return (
    <div className="min-h-screen bg-[var(--color-neutral)] p-6 text-text">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col items-center gap-4">
          <Board
            board={game.board}
            turn={game.turn}
            canInteract={isPlayerTurn}
            hoveredCell={ui.hoveredCell}
            focusedCell={ui.focusedCell}
            selectedStone={selectedStone}
            onSelect={(coord) => placeAt(coord.x, coord.y)}
            onHover={(coord) => hoverCell(coord)}
          />
          <Hand
            stones={game.players.P1.hand.stones}
            selectedIndex={ui.selectedHandIndex}
            disabled={!isPlayerTurn}
            onSelect={(index) => selectHand(index)}
          />
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-96">
          <div className="flex items-center justify-between">
            <ThemeToggle mode={ui.theme} onToggle={toggleTheme} />
            <span className="text-xs text-muted">Seed: {game.rngSeed}</span>
          </div>
          <Hud
            hp={{
              P1: game.players.P1.hp,
              AI: game.players.AI.hp,
            }}
            maxHp={game.config.startingHp}
            turn={game.turn}
            phase={game.phase}
            winner={game.winner}
            onReset={() => init(Date.now().toString())}
          />
          <BagView bag={game.bag} />
          <LogPanel logs={game.log} />
        </div>
      </div>
    </div>
  );
}

export default App;
