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

export type GitHubIssue = {
  id: number;
  number: number;
  title: string;
  labels: { name: string }[];
  html_url: string;
};
