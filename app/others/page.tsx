import Link from 'next/link';

const SECTIONS = [
  {
    href: '/others/university',
    label: 'University',
    description: '単位取得進捗 / 科目 / 試験 / メモ',
  },
  {
    href: '/others/finance',
    label: 'Finance',
    description: '家計・固定費・大型支出',
  },
  {
    href: '/others/books',
    label: 'Books',
    description: '読書記録・読みたい本',
  },
  {
    href: '/others/notes',
    label: 'Notes',
    description: '自由記述メモ',
  },
  {
    href: '/others/tools',
    label: 'Tools',
    description: '自分用の小物・ユーティリティ',
  },
];

export default function OthersIndexPage() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SECTIONS.map(({ href, label, description }) => (
        <li key={href}>
          <Link href={href} className="card block p-5 cursor-pointer">
            <h2 className="text-text-1 text-base font-medium tracking-tight mb-1">
              {label}
            </h2>
            <p className="text-text-3 text-sm">{description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
