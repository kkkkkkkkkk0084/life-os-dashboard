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
    <>
      <p className="text-text-3 text-xs mb-3">
        {today} ・ 各カードをタップで記録 / 時間はクリックで編集
      </p>
      <LifeLogEditor initial={status} />
    </>
  );
}
