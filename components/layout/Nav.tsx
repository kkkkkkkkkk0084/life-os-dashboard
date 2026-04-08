'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', short: 'Home' },
  { href: '/missions', label: 'Missions', short: 'Tasks' },
  { href: '/schedule', label: 'Schedule', short: 'Cal' },
  { href: '/academic', label: 'Academic', short: 'Study' },
  { href: '/health', label: 'Health', short: 'Health' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* ─── Top bar ────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-[64px] md:h-[88px] border-b border-border-subtle backdrop-blur-[20px] backdrop-saturate-[1.6]"
        style={{ background: 'rgba(10,10,10,0.6)' }}
      >
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-full flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[7px] bg-text-1 flex items-center justify-center font-[family-name:var(--font-display)] font-bold text-sm text-bg">
              L
            </div>
            <span className="font-[family-name:var(--font-display)] text-base font-semibold text-text-1 tracking-tight">
              Life OS
            </span>
          </div>

          {/* Center: Nav links (desktop only) */}
          <nav className="hidden md:flex gap-1">
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm px-3.5 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'text-text-1 bg-white/8'
                      : 'text-text-3 hover:text-text-2 hover:bg-white/4'
                  }`}
                  style={{ fontWeight: 400 }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right: empty placeholder（バランス用） */}
          <div className="w-7 md:w-[90px]" aria-hidden />
        </div>
      </header>

      {/* ─── Mobile bottom tab bar ──────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle backdrop-blur-[20px] backdrop-saturate-[1.6]"
        style={{
          background: 'rgba(10,10,10,0.85)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-stretch justify-around h-14">
          {NAV_ITEMS.map(({ href, short }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? 'text-text-1' : 'text-text-3'
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full ${
                    isActive ? 'bg-accent' : 'bg-transparent'
                  }`}
                />
                <span className="text-[11px] font-medium tracking-tight">{short}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
