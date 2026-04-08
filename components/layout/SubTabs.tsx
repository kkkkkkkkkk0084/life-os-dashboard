'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type SubTab = {
  href: string;
  label: string;
};

type Props = {
  tabs: SubTab[];
};

export default function SubTabs({ tabs }: Props) {
  const pathname = usePathname();

  return (
    <div className="border-b border-border-subtle mb-6 md:mb-8 -mx-5 md:mx-0">
      <nav className="flex gap-1 overflow-x-auto px-5 md:px-0">
        {tabs.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 text-sm whitespace-nowrap transition-colors relative ${
                isActive
                  ? 'text-text-1'
                  : 'text-text-3 hover:text-text-2'
              }`}
            >
              {label}
              {isActive && (
                <span
                  className="absolute left-0 right-0 -bottom-px h-px bg-text-1"
                  aria-hidden
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
