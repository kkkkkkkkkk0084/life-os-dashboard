import SubTabs from '@/components/layout/SubTabs';

const TABS = [
  { href: '/others', label: 'Index' },
  { href: '/others/university', label: 'University' },
  { href: '/others/finance', label: 'Finance' },
  { href: '/others/books', label: 'Books' },
  { href: '/others/notes', label: 'Notes' },
  { href: '/others/tools', label: 'Tools' },
];

export default function OthersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-10">
      <header className="mb-6 md:mb-8">
        <p className="text-text-3 text-sm mb-1">Others</p>
      </header>
      <SubTabs tabs={TABS} />
      {children}
    </div>
  );
}
