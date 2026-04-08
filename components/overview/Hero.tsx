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
    <section className="px-5 md:px-8 pt-4 md:pt-5 pb-3">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
        {/* greeting */}
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-3 tracking-[1.5px] uppercase mb-1">
            This Is What I Do
          </p>
          <h1
            className="font-[family-name:var(--font-display)] text-2xl md:text-[28px] font-medium text-text-1 leading-tight"
            style={{ letterSpacing: '-1px' }}
          >
            {greeting},{' '}
            <em className="font-[family-name:var(--font-serif)] italic font-normal text-text-2">
              Kei
            </em>
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
      </div>
    </section>
  );
}
