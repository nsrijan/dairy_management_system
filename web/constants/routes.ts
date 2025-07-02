import { ROLES } from './roles';

// Simple route access control for dairy operations (no /dairy prefix)
export const ROUTE_ACCESS: Record<string, string[]> = {
    // System admin only
    '/admin': [ROLES.SYSTEM_ADMIN],

    // Core dairy operations (no /dairy prefix)
    '/dashboard': [ROLES.TENANT_ADMIN, ROLES.FACTORY_MANAGER, ROLES.MCB_MANAGER, ROLES.SHOP_MANAGER, ROLES.FACTORY_STAFF, ROLES.MCB_STAFF, ROLES.SHOP_STAFF, ROLES.FARMER],

    // Specific dairy sections (clean URLs)
    '/mcb': [ROLES.TENANT_ADMIN, ROLES.MCB_MANAGER, ROLES.MCB_STAFF],
    '/factory': [ROLES.TENANT_ADMIN, ROLES.FACTORY_MANAGER, ROLES.FACTORY_STAFF],
    '/shops': [ROLES.TENANT_ADMIN, ROLES.SHOP_MANAGER, ROLES.SHOP_STAFF],
    '/farmers': [ROLES.TENANT_ADMIN, ROLES.MCB_MANAGER, ROLES.MCB_STAFF, ROLES.FARMER],
    '/products': [ROLES.TENANT_ADMIN, ROLES.FACTORY_MANAGER],
    '/inventory': [ROLES.TENANT_ADMIN, ROLES.FACTORY_MANAGER, ROLES.SHOP_MANAGER],
    '/storage': [ROLES.TENANT_ADMIN, ROLES.FACTORY_MANAGER, ROLES.SHOP_MANAGER],
    '/quality': [ROLES.TENANT_ADMIN, ROLES.MCB_MANAGER, ROLES.MCB_STAFF],
    '/reports': [ROLES.TENANT_ADMIN, ROLES.FACTORY_MANAGER, ROLES.MCB_MANAGER, ROLES.SHOP_MANAGER],

    // Farmer-specific routes (personal dashboard)
    '/farmer': [ROLES.FARMER],
};

// Simple function to check if user can access a route
export const canAccessRoute = (userRole: string | undefined, path: string): boolean => {
    if (!userRole) return false;

    // System admin can access everything
    if (userRole === ROLES.SYSTEM_ADMIN) return true;

    // Find the most specific route match
    const matchingRoutes = Object.keys(ROUTE_ACCESS)
        .filter(route => path.startsWith(route))
        .sort((a, b) => b.length - a.length); // Most specific first

    const matchingRoute = matchingRoutes[0];
    if (!matchingRoute) return false;

    return ROUTE_ACCESS[matchingRoute].includes(userRole);
}; 