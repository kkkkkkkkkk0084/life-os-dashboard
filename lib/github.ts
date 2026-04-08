import { GitHubIssue, GitHubMilestone, IssueDetail } from './types';

const REPO = 'kkkkkkkkkk0084/life-os';
const API_BASE = `https://api.github.com/repos/${REPO}`;

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };
}

export async function getOpenIssues(): Promise<GitHubIssue[]> {
  const res = await fetch(
    `${API_BASE}/issues?state=open&per_page=20`,
    {
      headers: authHeaders(),
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

/**
 * 指定 Milestone に紐付く Issue 一覧。
 * Missions 階層の「Project → Tasks」表示に使う。
 */
export async function getIssuesByMilestone(
  milestoneNumber: number,
  state: 'open' | 'closed' | 'all' = 'open'
): Promise<GitHubIssue[]> {
  const res = await fetch(
    `${API_BASE}/issues?milestone=${milestoneNumber}&state=${state}&per_page=100`,
    {
      headers: authHeaders(),
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

/**
 * 単一 Issue の詳細を取得。
 * Missions 階層の「Task → Details（checkbox）」表示に使う。
 */
export async function getIssue(issueNumber: number): Promise<GitHubIssue | null> {
  const res = await fetch(`${API_BASE}/issues/${issueNumber}`, {
    headers: authHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

/**
 * Milestone 一覧を取得。
 * Missions 階層の「Project」に対応する。
 */
export async function getMilestones(
  state: 'open' | 'closed' | 'all' = 'open'
): Promise<GitHubMilestone[]> {
  const res = await fetch(
    `${API_BASE}/milestones?state=${state}&per_page=100&sort=due_on&direction=asc`,
    {
      headers: authHeaders(),
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

/**
 * 単一 Milestone の詳細を取得。
 */
export async function getMilestone(milestoneNumber: number): Promise<GitHubMilestone | null> {
  const res = await fetch(`${API_BASE}/milestones/${milestoneNumber}`, {
    headers: authHeaders(),
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

/**
 * Issue body の Markdown checkbox を Detail として抽出する。
 * - `- [ ] foo` → { text: 'foo', checked: false }
 * - `- [x] bar` / `- [X] bar` → { text: 'bar', checked: true }
 *
 * 行頭の空白・タブにも対応（ネストされた checkbox 含む）。
 */
export function parseIssueDetails(body: string | null): IssueDetail[] {
  if (!body) return [];
  const pattern = /^[ \t]*[-*+]\s+\[([ xX])\]\s+(.+)$/gm;
  const details: IssueDetail[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(body)) !== null) {
    details.push({
      checked: match[1].toLowerCase() === 'x',
      text: match[2].trim(),
    });
  }
  return details;
}
