import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname);

  // Check if auth token cookie is present
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authToken;

  console.log('Auth token found:', !!authToken, 'Path:', request.nextUrl.pathname);

  const isLoginPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/auth/login';
  const isRegisterPage = request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/auth/register';
  const isPublicApiRoute = request.nextUrl.pathname.startsWith('/api/public');
  const isRootPath = request.nextUrl.pathname === '/';
  const isDashboardPath = request.nextUrl.pathname === '/dashboard' || request.nextUrl.pathname.startsWith('/dashboard/');
  const isAdminPath = request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/');

  // Don't redirect public API routes
  if (isPublicApiRoute) {
    console.log('Public API route - no redirection');
    return NextResponse.next();
  }

  // Redirect to dashboard if logged in and trying to access login/register page
  if ((isLoginPage || isRegisterPage) && isAuthenticated) {
    console.log('User authenticated on login/register page, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to dashboard if logged in and accessing root path
  if (isRootPath && isAuthenticated) {
    console.log('User authenticated at root, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if not logged in and not on login/register page or public API
  if (!isAuthenticated && !isLoginPage && !isRegisterPage && !isPublicApiRoute) {
    console.log('Protected route accessed without authentication, redirecting to login');
    console.log('Current path:', request.nextUrl.pathname, 'isDashboard:', isDashboardPath, 'isAdmin:', isAdminPath);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('Access allowed');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login',
    '/register',
    '/auth/login',
    '/auth/register',
    '/api/public/:path*',
    '/features/:path*',
  ],
}; 