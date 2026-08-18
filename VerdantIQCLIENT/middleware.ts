import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'verdantiq_session';

// Role dashboard path mappings
const ROLE_DASHBOARDS: Record<string, string> = {
  user: '/user/dashboard',
  student: '/student/dashboard',
  dept: '/dept/dashboard',
  institution: '/institution/dashboard',
  region: '/region/dashboard',
  admin: '/admin-dashboard',
  mlops: '/mlops-dashboard',
  audit: '/audit-dashboard',
};

// Protected routes prefix patterns
const PROTECTED_PREFIXES = [
  '/user',
  '/student',
  '/dept',
  '/institution',
  '/region',
  '/admin',
  '/mlops',
  '/audit',
  '/admin-dashboard',
  '/audit-dashboard',
  '/dept-dashboard',
  '/institution-dashboard',
  '/mlops-dashboard',
  '/region-dashboard',
  '/student-dashboard',
  '/dashboard',
  '/my-activity',
  '/notifications',
  '/profile',
  '/settings',
  '/assistant',
];

// Public paths that do not require authentication
const PUBLIC_PATHS = [
  '/login',
  '/landing',
  '/tenant-request',
  '/onboarding',
  '/403',
  '/help',
  '/design-system',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, Next.js internal requests, images, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Retrieve session cookie from incoming request
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  let session: { token?: string; role?: string; email?: string } | null = null;

  if (sessionCookie?.value) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      session = null;
    }
  }

  const hasValidToken = Boolean(session && session.token);
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Case 1: Attempting to access protected route without a valid session token cookie
  if (isProtectedRoute && !hasValidToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: User has a valid session token and visits /login -> redirect to their role dashboard
  if (pathname === '/login' && hasValidToken && session?.role) {
    const targetDashboard = ROLE_DASHBOARDS[session.role] || '/user/dashboard';
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset images
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
