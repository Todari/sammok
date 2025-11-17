import { STONE_TYPES } from '../core/config';
import type { BagState, PlayerId } from '../core/types';
import { stoneInfo } from './StoneBadge';

interface BagViewProps {
  bag: BagState;
}

export function BagView({ bag }: BagViewProps) {
  const owners: PlayerId[] = ['P1', 'AI'];
  return (
    <section className="rounded-2xl border border-white/10 bg-panel/80 p-4 shadow">
      <header className="mb-3 text-sm font-semibold text-text">
        백 구성 (플레이어별)
      </header>
      <div className="grid gap-4 text-xs sm:grid-cols-2">
        {owners.map((owner) => {
          const playerBag = bag.perPlayer[owner];
          return (
            <div key={owner} className="rounded-lg border border-white/5 p-3">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wide text-muted">
                <span>{owner}</span>
                <span>총 {playerBag.total}</span>
              </div>
              <div className="space-y-1.5">
                {STONE_TYPES.map((type) => {
                  const info = stoneInfo[type];
                  return (
                    <div
                      key={`${owner}-${type}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${info.accent}`} />
                        <span className="text-text">{type}</span>
                      </div>
                      <span className="text-muted">{playerBag.counts[type]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

