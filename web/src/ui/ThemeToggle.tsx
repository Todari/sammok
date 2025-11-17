interface ThemeToggleProps {
  mode: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
    >
      {mode === 'light' ? '다크 모드' : '라이트 모드'}
    </button>
  );
}

