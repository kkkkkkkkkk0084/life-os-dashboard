import SubTabs from '@/components/layout/SubTabs';

const TABS = [
  { href: '/others/university', label: '概要' },
  { href: '/others/university/courses', label: '科目' },
  { href: '/others/university/exams', label: '試験' },
  { href: '/others/university/notes', label: 'メモ' },
];

export default function UniversityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SubTabs tabs={TABS} />
      {children}
    </>
  );
}
