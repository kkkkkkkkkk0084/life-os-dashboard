'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Overview' },
  { href: '/academic', label: 'Academic' },
  { href: '/finance', label: 'Finance' },
  { href: '/health', label: 'Health' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[88px] flex items-center justify-between px-8 border-b border-border-subtle backdrop-blur-[20px] backdrop-saturate-[1.6]" style={{ background: 'rgba(10,10,10,0.6)' }}>
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-[7px] bg-text-1 flex items-center justify-center font-[family-name:var(--font-display)] font-bold text-sm text-bg">
          L
        </div>
        <span className="font-[family-name:var(--font-display)] text-base font-semibold text-text-1 tracking-tight">
          Life OS
        </span>
      </div>

      {/* Center: Nav links */}
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

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button className="btn-secondary text-sm !py-2 !px-4 hidden md:block">Log</button>
        <button className="btn-primary text-sm !py-2 !px-4">+ New</button>
      </div>
    </header>
  );
}
