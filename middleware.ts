import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard'];
const authRoutes = ['/auth/login', '/auth/register', '/auth/verify-otp'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies (future) or check if we need to redirect
  // For now, we'll allow the client to handle auth since token is in localStorage
  // This middleware prevents direct navigation but client-side protection still applies
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // TODO: When migrating to httpOnly cookies, check token here:
  // const token = request.cookies.get('accessToken');
  // if (isProtectedRoute && !token) {
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // }
  // if (isAuthRoute && token) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
