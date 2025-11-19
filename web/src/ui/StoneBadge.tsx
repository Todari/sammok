import type { StoneType } from '../core/types';

const STONE_INFO: Record<
  StoneType,
  { label: string; description: string; accent: string }
> = {
  Basic: {
    label: 'Basic',
    description: '기본 돌, 추가 효과 없음',
    accent: 'bg-slate-400',
  },
  Strong: {
    label: 'Strong',
    description: '라인 데미지 +1 (라인 내 중첩)',
    accent: 'bg-indigo-500',
  },
  Tough: {
    label: 'Tough',
    description: 'HP 3으로 생존력 증가',
    accent: 'bg-amber-500',
  },
  Cross: {
    label: 'Cross',
    description: '배치 즉시 십자 4칸에 피해 1',
    accent: 'bg-cyan-500',
  },
  AoE: {
    label: 'AoE',
    description: '배치 즉시 8방향에 피해 1',
    accent: 'bg-emerald-500',
  },
  Diagonal: {
    label: 'Diagonal',
    description: '배치 즉시 대각선 4칸에 피해 1',
    accent: 'bg-purple-500',
  },
  Persistent: {
    label: 'Persistent',
    description: '라인 완성 시에도 제거되지 않음',
    accent: 'bg-teal-500',
  },
  Kamikaze: {
    label: 'Kamikaze',
    description: 'HP가 1이 되는 순간 적 HP -1',
    accent: 'bg-rose-500',
  },
};

export const stoneInfo = STONE_INFO;

interface StoneBadgeProps {
  type: StoneType;
  active?: boolean;
  compact?: boolean;
}

export function StoneBadge({ type, active, compact }: StoneBadgeProps) {
  const info = STONE_INFO[type];
  return (
    <div
      className={`flex items-center gap-2 rounded-md border px-2 py-1 text-xs transition
        ${active ? 'border-primary shadow-glow' : 'border-white/10'}
        ${compact ? 'text-[11px]' : ''}`}
      title={info.description}
    >
      <span className={`inline-block h-2 w-2 rounded-full ${info.accent}`} />
      <span className="font-semibold text-text">{info.label}</span>
    </div>
  );
}

