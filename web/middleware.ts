import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccessRoute } from './constants/routes';

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

  // Check if user can access this route
  const hasAccess = canAccessRoute(userRole, pathname);
  console.log(`Route access check for ${pathname}: User role ${userRole} has access: ${hasAccess}`);

  if (!hasAccess) {
    console.log(`User role ${userRole} cannot access ${pathname}. Redirecting to dashboard.`);
    const redirectPath = getDashboardByRole(userRole);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  console.log(`User role ${userRole} can access ${pathname}. Allowing access.`);
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

  // Role-based dashboard routing (simplified for dairy operations)
  switch (role) {
    case 'SYSTEM_ADMIN':
      console.log('[getDashboardByRole] SYSTEM_ADMIN, returning /admin');
      return '/admin';

    case 'TENANT_ADMIN':
      console.log('[getDashboardByRole] TENANT_ADMIN, returning /dashboard');
      return '/dashboard';

    case 'FACTORY_MANAGER':
      console.log('[getDashboardByRole] FACTORY_MANAGER, returning /dashboard');
      return '/dashboard';

    case 'MCB_MANAGER':
      console.log('[getDashboardByRole] MCB_MANAGER, returning /dashboard');
      return '/dashboard';

    case 'SHOP_MANAGER':
      console.log('[getDashboardByRole] SHOP_MANAGER, returning /dashboard');
      return '/dashboard';

    case 'FARMER':
      console.log('[getDashboardByRole] FARMER, returning /farmer');
      return '/farmer';

    default:
      // For any staff roles or unrecognized roles
      if (role.includes('_STAFF')) {
        console.log('[getDashboardByRole] Staff role, returning /dashboard');
        return '/dashboard';
      }
      break;
  }

  console.log('[getDashboardByRole] No specific role match, returning /dashboard');
  return '/dashboard';
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/dashboard/:path*',
    '/mcb/:path*',
    '/factory/:path*',
    '/shops/:path*',
    '/inventory/:path*',
    '/storage/:path*',
    '/products/:path*',
    '/farmers/:path*',
    '/farmer/:path*',
    '/quality/:path*',
    '/reports/:path*',
    '/login',
    '/register',
    '/auth/login',
    '/auth/register',
    '/api/public/:path*',
  ],
}; 