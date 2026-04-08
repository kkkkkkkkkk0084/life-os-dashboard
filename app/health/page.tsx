import { getTodayStatus } from '@/lib/kv';
import LifeLogEditor from '@/components/health/LifeLogEditor';

export const dynamic = 'force-dynamic';

export default async function HealthPage() {
  const status = await getTodayStatus();
  const today = new Date().toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-10">
      <header className="mb-6 md:mb-8">
        <p className="text-text-3 text-sm mb-1">Health</p>
        <h1 className="section-title">今日の生活ログ</h1>
      </header>

      <p className="text-text-3 text-xs mb-3">
        {today} ・ 各カードをタップで記録 / 時間はクリックで編集
      </p>
      <LifeLogEditor initial={status} />
    </div>
  );
}
