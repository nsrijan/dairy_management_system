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
    if (isAuthenticated) {
      const userSpecificDashboard = getDashboardByRole(userRole);

      // If authenticated user is on login/register, or on another public route (like '/')
      // that is not their designated dashboard, redirect them.
      if (
        pathname.includes('/login') ||
        pathname.includes('/register') ||
        (pathname === '/' && pathname !== userSpecificDashboard)
      ) {
        console.log(`Authenticated user on public route ${pathname}. Redirecting to their dashboard: ${userSpecificDashboard}`);
        return NextResponse.redirect(new URL(userSpecificDashboard, request.url));
      }
      // If authenticated user is on a public route that IS their correct dashboard (e.g. dashboard is '/' and they are on '/'), allow.
      return NextResponse.next();
    } else {
      // Not authenticated, on a public route. Allow access.
      return NextResponse.next();
    }
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login for protected path:', pathname);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // From here, user is authenticated and on a protected route.
  // Get route access requirements
  const routeAccess = getRouteAccess(pathname);
  console.log('Route access requirements for', pathname, ':', routeAccess);

  // If no specific access requirements for this protected route (e.g., /dashboard)
  if (!routeAccess) {
    console.log('No specific access requirements found for protected path:', pathname);
    const correctDashboard = getDashboardByRole(userRole);
    // If user is on a page with no rules and it's not their correct dashboard, redirect them.
    if (pathname !== correctDashboard) {
      console.log(`User with role ${userRole} on ${pathname} (no specific rules), but their correct dashboard is ${correctDashboard}. Redirecting.`);
      return NextResponse.redirect(new URL(correctDashboard, request.url));
    }
    // Allow access if they are already on their correct dashboard or another page with no rules they landed on.
    console.log(`Allowing access to ${pathname} for role ${userRole} as it has no specific rules and matches their dashboard or is a generic page.`);
    return NextResponse.next();
  }

  // Check if user has required role for the route
  const roleIncludesCheck = routeAccess.roles.includes(userRole);
  const domainRoleCheck = isDomainRole(userRole, routeAccess.domain);
  const hasRequiredRole = roleIncludesCheck || domainRoleCheck;

  console.log('=== ROLE CHECK DEBUG ===');
  console.log('Path:', pathname, 'User role:', userRole, 'Required roles:', routeAccess.roles, 'Route domain:', routeAccess.domain);
  console.log('Role includes check:', roleIncludesCheck, 'Domain role check:', domainRoleCheck, 'Has required role:', hasRequiredRole);
  console.log('========================');

  if (!hasRequiredRole) {
    console.log(`User role ${userRole} does not have required role for ${pathname}.`);
    // Redirect to appropriate dashboard based on user's role
    const redirectPath = getDashboardByRole(userRole);
    console.log(`Redirecting to their correct dashboard: ${redirectPath}`);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  console.log(`User role ${userRole} has required role for ${pathname}. Allowing access.`);
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
  // Enhanced logging to inspect the role string
  console.log(`[getDashboardByRole] Determining dashboard for role: "${role}" (length: ${role.length})`);
  const isStrictlyTenantAdmin = role === 'TENANT_ADMIN';
  console.log(`[getDashboardByRole] Is role strictly 'TENANT_ADMIN'? ${isStrictlyTenantAdmin}`);
  const doesIncludeTenant = role.includes('TENANT_');
  console.log(`[getDashboardByRole] Does role include 'TENANT_'? ${doesIncludeTenant}`);

  // Specific checks for tenant-related roles first
  if (role === 'TENANT_ADMIN' || role === 'TENANT_MANAGER') {
    console.log('[getDashboardByRole] Role is TENANT_ADMIN or TENANT_MANAGER, returning /tenant');
    //for now return /dairy/dashboard
    return '/dairy/dashboard';
  }

  // Broader checks for domain-specific dashboards
  // Ensure these don't unintentionally match before more specific tenant roles if naming overlaps
  if (role.includes('DAIRY_')) { // e.g., DAIRY_ADMIN, DAIRY_FARMER
    console.log('[getDashboardByRole] Role includes DAIRY_, returning /dairy/dashboard');
    return '/dairy/dashboard';
  }
  if (role.includes('POULTRY_')) {
    console.log('[getDashboardByRole] Role includes POULTRY_, returning /poultry/dashboard');
    return '/poultry/dashboard';
  }
  if (role.includes('SYSTEM_')) { // e.g., SYSTEM_ADMIN
    console.log('[getDashboardByRole] Role includes SYSTEM_, returning /admin');
    return '/admin';
  }

  console.log('[getDashboardByRole] No specific role match, returning /dashboard');
  return '/dashboard';
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/dairy/:path*',
    '/poultry/:path*',
    '/dashboard/:path*', // This will match the (dairy) route group dashboard
    '/tenant/:path*',
    '/login',
    '/register',
    '/auth/login',
    '/auth/register',
    '/api/public/:path*',
  ],
}; 