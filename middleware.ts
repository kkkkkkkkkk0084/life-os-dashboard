import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // API routes skip auth (they use token auth)
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Static assets skip auth
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
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
