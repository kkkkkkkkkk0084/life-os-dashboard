import { NextRequest, NextResponse } from 'next/server';

// PWA / アイコン関連は認証なしで配信する。
// 認証が掛かっていると iOS Safari の「ホーム画面に追加」や Chrome の
// インストールプロンプトが manifest を取得できず PWA インストールが失敗する。
const PUBLIC_PATHS = [
  '/manifest.webmanifest',
  '/manifest.json',
  '/icon',
  '/apple-icon',
  '/favicon.ico',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // API routes skip auth (they use token auth)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Static assets skip auth
  if (pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // PWA-related routes skip auth
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // Check Basic Auth
  const auth = request.headers.get('authorization');

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(':');
      if (
        user === process.env.AUTH_USER &&
        pass === process.env.AUTH_PASS
      ) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Life OS"',
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
