import type { GamePhase, PlayerId } from '../core/types';

interface HudProps {
  hp: Record<PlayerId, number>;
  maxHp: number;
  turn: PlayerId;
  phase: GamePhase;
  winner?: PlayerId;
  onReset: () => void;
}

export function Hud({ hp, maxHp, turn, phase, winner, onReset }: HudProps) {
  const players: PlayerId[] = ['P1', 'AI'];
  return (
    <section className="rounded-2xl border border-white/10 bg-panel/80 p-4 shadow-lg">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">전장 상황</h2>
          <p className="text-xs text-muted">
            턴: {turn} · 단계: {phase}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
          onClick={onReset}
        >
          새 게임
        </button>
      </header>
      <div className="space-y-3">
        {players.map((player) => (
          <div key={player}>
            <div className="mb-1 flex items-center justify-between text-xs text-muted">
              <span className="font-semibold text-text">{player}</span>
              <span>
                {hp[player]}/{maxHp}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${
                  player === 'P1' ? 'bg-primary' : 'bg-danger'
                }`}
                style={{
                  width: `${Math.max(0, Math.min(1, hp[player] / maxHp)) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {winner ? (
        <div className="mt-4 rounded-lg border border-primary/40 bg-primary/10 p-3 text-center text-sm font-semibold text-primary">
          {winner} 승리! 새 게임으로 이어가세요.
        </div>
      ) : null}
    </section>
  );
}

