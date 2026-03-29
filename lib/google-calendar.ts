import { CalendarEvent } from './types';

async function getAccessToken(): Promise<string | null> {
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN || '',
        grant_type: 'refresh_token',
      }),
    });
    if (!res.ok) return null;
    const { access_token } = await res.json();
    return access_token;
  } catch {
    return null;
  }
}

export async function getTodayEvents(): Promise<CalendarEvent[]> {
  try {
    const access_token = await getAccessToken();
    if (!access_token) return [];

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const now = new Date();
    const jst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const dateStr = `${jst.getFullYear()}-${String(jst.getMonth() + 1).padStart(2, '0')}-${String(jst.getDate()).padStart(2, '0')}`;
    const timeMin = `${dateStr}T00:00:00+09:00`;
    const timeMax = `${dateStr}T23:59:59+09:00`;

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((item: { id: string; summary: string; start: { dateTime?: string; date?: string }; end: { dateTime?: string; date?: string } }) => ({
      id: item.id,
      summary: item.summary,
      start: item.start.dateTime || item.start.date || '',
      end: item.end.dateTime || item.end.date || '',
    }));
  } catch {
    return [];
  }
}
