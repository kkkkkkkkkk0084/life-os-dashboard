'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'DASHBOARD' },
  { href: '/academic', label: 'ACADEMIC' },
  { href: '/finance', label: 'FINANCE' },
  { href: '/health', label: 'HEALTH' },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 mt-3">
      {NAV_ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-1 font-mono text-xs rounded border transition-colors ${
            pathname === href
              ? 'border-green-500 text-green-400 bg-green-950'
              : 'border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-500'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
