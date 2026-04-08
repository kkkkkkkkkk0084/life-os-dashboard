function getJstNow(): Date {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}

function getGreeting(hour: number): string {
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getYearProgressPct(now: Date): number {
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = now.getTime() - start.getTime();
  return (elapsedMs / totalMs) * 100;
}

export default function Hero() {
  const jstNow = getJstNow();
  const greeting = getGreeting(jstNow.getHours());
  const pct = getYearProgressPct(jstNow);
  const year = jstNow.getFullYear();

  return (
    <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-6">
      {/* greeting — 他ページと同じ構造 (text-sm <p> + section-title <h1>) */}
      <div>
        <p className="text-text-3 text-sm mb-1">Overview</p>
        <h1 className="section-title">
          {greeting}, <em className="font-[family-name:var(--font-serif)] italic font-normal text-text-2">Kei</em>
        </h1>
      </div>

      {/* Year progress */}
      <div className="flex items-center gap-3 w-full md:max-w-[360px]">
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-2 whitespace-nowrap">
          {year}
        </span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-[#a4abdf]"
            style={{ width: `${pct.toFixed(2)}%` }}
          />
        </div>
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-3 whitespace-nowrap">
          {pct.toFixed(1)}%
        </span>
      </div>
    </header>
  );
}
