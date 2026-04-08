'use client';
import { useState } from 'react';
import { GitHubIssue } from '@/lib/types';

const LABEL_COLORS: Record<string, string> = {
  academic: 'text-yellow-400',
  finance: 'text-green-400',
  life: 'text-blue-400',
  business: 'text-purple-400',
  urgent: 'text-red-400',
};

export default function IssuesPanel({ issues: initialIssues }: { issues: GitHubIssue[] }) {
  const [issues, setIssues] = useState(initialIssues);
  const [closing, setClosing] = useState<number | null>(null);

  const handleClose = async (issueNumber: number) => {
    setClosing(issueNumber);
    const res = await fetch('/api/close-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issueNumber }),
    });
    if (res.ok) {
      setIssues(issues.filter(i => i.number !== issueNumber));
    }
    setClosing(null);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-yellow-400 font-mono text-sm font-bold mb-3 tracking-widest">▶ ACTIVE QUESTS ({issues.length})</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {issues.map(issue => (
          <div key={issue.id} className="flex items-start gap-2 text-sm group">
            <span className="text-gray-600 font-mono text-xs mt-0.5">#{issue.number}</span>
            <div className="flex-1">
              <span className="text-gray-300 font-mono text-xs">{issue.title}</span>
              <div className="flex gap-1 mt-0.5">
                {issue.labels.map(label => (
                  <span key={label.name} className={`text-xs font-mono ${LABEL_COLORS[label.name] || 'text-gray-500'}`}>
                    [{label.name}]
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => handleClose(issue.number)}
              disabled={closing === issue.number}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono px-2 py-0.5 rounded border border-green-700 text-green-500 hover:bg-green-900 disabled:opacity-30 whitespace-nowrap"
            >
              {closing === issue.number ? '...' : 'DONE'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
