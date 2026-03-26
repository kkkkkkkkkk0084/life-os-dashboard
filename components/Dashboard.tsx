'use client';
import { useEffect, useState } from 'react';
import StatusPanel from './StatusPanel';
import { StatusData, CalendarEvent, GitHubIssue } from '@/lib/types';
import CalendarPanel from './CalendarPanel';
import IssuesPanel from './IssuesPanel';
import AcademicPanel from './AcademicPanel';

type Props = {
  initialStatus: StatusData;
  events: CalendarEvent[];
  issues: GitHubIssue[];
};

export default function Dashboard({ initialStatus, events, issues }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [now, setNow] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setNow(new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/status');
      if (res.ok) setStatus(await res.json());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white p-4">
      {/* Header */}
      <div className="mb-6 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-green-400 font-mono text-xl font-bold tracking-widest">LIFE OS</h1>
            <p className="text-gray-500 font-mono text-xs">KEITO OHASHI — STATUS BOARD</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 font-mono text-xs">{now}</p>
            <div className="flex items-center gap-1 justify-end mt-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 font-mono text-xs">ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusPanel status={status} />
        <CalendarPanel events={events} />
        <IssuesPanel issues={issues} />
        <AcademicPanel />
      </div>
    </div>
  );
}
