import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Identity Locales for AuraLock Global
const locales = ['en', 'hi', 'es'];
const defaultLocale = 'en';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // Maintains clean URLs for the default language
});

/**
 * AURALOCK GLOBAL GUARDIAN:
 * Cascades Admin Security and Localization logic.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. PHASE 2: ADMIN SECURITY HANDSHAKE
  if (pathname.includes('/admin')) {
    const isAuthRoute = pathname.includes('/admin/login') || pathname.includes('/admin/verify');
    if (!isAuthRoute) {
      const sessionToken = request.cookies.get('auralock_admin_session')?.value;
      const adminSecret = process.env.ADMIN_SECRET || '4c7e50ee-9621-408c-80ff-bc299ee3a299';

      if (!sessionToken || sessionToken !== adminSecret) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  // 2. PHASE 3: GLOBAL LOCALIZATION
  return intlMiddleware(request);
}

export const config = {
  // Matcher for all routes except internal Next.js assets and API endpoints
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
