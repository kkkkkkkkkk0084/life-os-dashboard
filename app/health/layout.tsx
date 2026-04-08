import SubTabs from '@/components/layout/SubTabs';

const TABS = [
  { href: '/health', label: '今日' },
  { href: '/health/week', label: '週次' },
  { href: '/health/sleep', label: '睡眠' },
  { href: '/health/notes', label: 'メモ' },
];

export default function HealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-10">
      <header className="mb-6 md:mb-8">
        <p className="text-text-3 text-sm mb-1">Health</p>
      </header>
      <SubTabs tabs={TABS} />
      {children}
    </div>
  );
}
