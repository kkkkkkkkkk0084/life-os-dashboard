import { getTodayStatus } from '@/lib/kv';
import { getTodayEvents } from '@/lib/google-calendar';
import { getOpenIssues } from '@/lib/github';
import Dashboard from '@/components/Dashboard';

export const revalidate = 60;

export default async function Home() {
  const [status, events, issues] = await Promise.all([
    getTodayStatus(),
    getTodayEvents(),
    getOpenIssues(),
  ]);

  return <Dashboard initialStatus={status} events={events} issues={issues} />;
}
