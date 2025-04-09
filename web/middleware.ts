import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname);
  
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log('Token found:', !!token);
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isRootPath = request.nextUrl.pathname === '/';

  if (isAuthPage) {
    console.log('Auth page detected');
    if (token) {
      console.log('User authenticated, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    console.log('User not authenticated, allowing access to auth page');
    return NextResponse.next();
  }

  if (isRootPath) {
    console.log('Root path detected');
    if (token) {
      console.log('User authenticated, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    console.log('User not authenticated, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (!token) {
    console.log('Protected route accessed without authentication');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  console.log('User authenticated, allowing access to protected route');
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
}; 