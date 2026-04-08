export type StatusData = {
  date: string;
  wakeup: string | null;
  sleep: string | null;
  exercise: boolean;
  outing: string | null;
  return: string | null;
  meals: string[];
};

export type CalendarEvent = {
  id: string;
  summary: string;
  start: string;
  end: string;
};

export type GitHubMilestone = {
  id: number;
  number: number;
  title: string;
  description: string | null;
  state: 'open' | 'closed';
  open_issues: number;
  closed_issues: number;
  due_on: string | null;
  html_url: string;
};

export type GitHubIssue = {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  labels: { name: string }[];
  milestone: GitHubMilestone | null;
  html_url: string;
  /**
   * Issue body から `Due: YYYY-MM-DD` をパースした結果。
   * 期限ベースの並べ替えに使う。GitHub API レスポンスには含まれず、
   * `lib/github.ts` 側で付与する。
   */
  dueDate?: string | null;
};

/**
 * Issue body の Markdown checkbox（`- [ ]` / `- [x]`）をパースした結果。
 * Missions 階層の「Detail」に対応する。
 */
export type IssueDetail = {
  text: string;
  checked: boolean;
};

/**
 * Missions 階層の最上位「Goal」。
 * Upstash KV (`goals:{id}`) に保存される。
 * GitHub Milestone を `milestoneNumbers` で紐付ける。
 */
export type Goal = {
  id: string;
  title: string;
  description: string | null;
  milestoneNumbers: number[];
  createdAt: string;
};
