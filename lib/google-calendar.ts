import { CalendarEvent } from './types';

export async function getTodayEvents(): Promise<CalendarEvent[]> {
  try {
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

    // JWT認証トークン取得
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
      iss: serviceAccountKey.client_email,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    // base64url encode
    const encodeBase64 = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString('base64url');

    const signingInput = `${encodeBase64(header)}.${encodeBase64(payload)}`;

    // RSA署名（crypto module）
    const { createSign } = await import('crypto');
    const sign = createSign('SHA256');
    sign.update(signingInput);
    const signature = sign.sign(serviceAccountKey.private_key, 'base64url');
    const jwt = `${signingInput}.${signature}`;

    // トークン取得
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!tokenRes.ok) return [];
    const { access_token } = await tokenRes.json();

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const jst = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo' });
    const todayStr = jst.format(new Date()).replace(/\//g, '-');
    const timeMin = `${todayStr}T00:00:00+09:00`;
    const timeMax = `${todayStr}T23:59:59+09:00`;

    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
        next: { revalidate: 300 },
      }
    );

    if (!calRes.ok) return [];
    const data = await calRes.json();
    return (data.items || []).map((item: { id: string; summary: string; start: { dateTime?: string; date?: string }; end: { dateTime?: string; date?: string } }) => ({
      id: item.id,
      summary: item.summary,
      start: item.start.dateTime || item.start.date,
      end: item.end.dateTime || item.end.date,
    }));
  } catch {
    return [];
  }
}
