import SubTabs from '@/components/layout/SubTabs';

const TABS = [
  { href: '/academic', label: '概要' },
  { href: '/academic/courses', label: '科目' },
  { href: '/academic/exams', label: '試験' },
  { href: '/academic/notes', label: 'メモ' },
];

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-10">
      <header className="mb-6 md:mb-8">
        <p className="text-text-3 text-sm mb-1">Academic</p>
      </header>
      <SubTabs tabs={TABS} />
      {children}
    </div>
  );
}
