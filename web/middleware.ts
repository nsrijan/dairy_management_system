import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRouteAccess, isDomainRole } from './constants/domains';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('Middleware called for path:', pathname);

  // Check if auth token cookie is present
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authToken;

  // Get user role from token (you'll need to implement this based on your token structure)
  const userRole = getUserRoleFromToken(authToken);
  console.log('User role:', userRole);

  // Public routes that don't need authentication
  const publicRoutes = [
    '/login',
    '/auth/login',
    '/register',
    '/auth/register',
    '/',
    '/api/public'
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/'));

  // If it's a public route, allow access
  if (isPublicRoute) {
    // Redirect authenticated users trying to access login/register to dashboard
    if (isAuthenticated && (pathname.includes('/login') || pathname.includes('/register'))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Get route access requirements
  const routeAccess = getRouteAccess(pathname);
  console.log('Route access requirements:', routeAccess);

  // If no specific access requirements, allow authenticated users
  if (!routeAccess) {
    console.log('No specific access requirements found');
    return NextResponse.next();
  }

  // Check if user has required role for the route
  const hasRequiredRole = routeAccess.roles.includes(userRole) ||
    isDomainRole(userRole, routeAccess.domain);
  console.log('Has required role:', hasRequiredRole, 'Required roles:', routeAccess.roles, 'User role:', userRole);

  if (!hasRequiredRole) {
    console.log('User does not have required role, redirecting to dashboard');
    // Redirect to appropriate dashboard based on user's role
    const redirectPath = getDashboardByRole(userRole);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

// Helper function to get user role from JWT token
function getUserRoleFromToken(token: string | undefined): string {
  if (!token) return '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Get the first role from the roles array and remove the ROLE_ prefix
    if (payload.roles && payload.roles.length > 0) {
      console.log('User role:', payload.roles[0].replace('ROLE_', ''));
      return payload.roles[0].replace('ROLE_', '');
    }
    return '';
  } catch {
    return '';
  }
}

// Helper function to determine dashboard based on role
function getDashboardByRole(role: string): string {
  if (role.includes('DAIRY_')) return '/dairy/dashboard';
  if (role.includes('POULTRY_')) return '/poultry/dashboard';
  if (role.includes('SYSTEM_')) return '/admin';
  if (role.includes('TENANT_')) return '/tenant';
  return '/dashboard';
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/dairy/:path*',
    '/poultry/:path*',
    '/dashboard/:path*',
    '/tenant/:path*',
    '/login',
    '/register',
    '/auth/login',
    '/auth/register',
    '/api/public/:path*',
  ],
}; 