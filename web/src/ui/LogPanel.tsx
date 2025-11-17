interface LogPanelProps {
  logs: string[];
}

export function LogPanel({ logs }: LogPanelProps) {
  const recent = logs.slice(-10).reverse();
  return (
    <section className="rounded-2xl border border-white/10 bg-panel/80 p-4 shadow">
      <header className="mb-3 text-sm font-semibold text-text">
        로그 (최근 10개)
      </header>
      <ol className="max-h-48 space-y-2 overflow-y-auto text-xs text-muted">
        {recent.length === 0 ? (
          <li className="text-center text-muted">기록 없음</li>
        ) : (
          recent.map((entry, idx) => (
            <li key={`${entry}-${idx}`} className="rounded bg-white/5 p-2">
              {entry}
            </li>
          ))
        )}
      </ol>
    </section>
  );
}

