import type { StoneType } from '../core/types';
import { StoneBadge, stoneInfo } from './StoneBadge';

interface HandProps {
  stones: StoneType[];
  selectedIndex: number | null;
  disabled?: boolean;
  onSelect: (index: number) => void;
}

export function Hand({
  stones,
  selectedIndex,
  disabled,
  onSelect,
}: HandProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">플레이어 핸드</h3>
        <span className="text-xs text-muted">번호키 1~3 선택</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {stones.map((stone, index) => {
          const isSelected = selectedIndex === index;
          const info = stoneInfo[stone];
          return (
            <button
              key={`${stone}-${index}`}
              type="button"
              className={`w-full min-w-[130px] flex-1 rounded-xl border bg-panel/80 p-3 text-left shadow transition hover:-translate-y-0.5
                ${isSelected ? 'border-primary shadow-glow' : 'border-white/10'}
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              onClick={() => !disabled && onSelect(index)}
              disabled={disabled}
            >
              <div className="flex items-center justify-between">
                <StoneBadge type={stone} active={isSelected} />
                <span className="text-[11px] text-muted">[{index + 1}]</span>
              </div>
              <p className="mt-2 text-xs text-muted">{info.description}</p>
            </button>
          );
        })}
        {stones.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-panel/60 p-4 text-center text-sm text-muted">
            핸드를 리필 중...
          </div>
        ) : null}
      </div>
    </div>
  );
}

