// Dairy Management System Roles
export const ROLES = {
    SYSTEM_ADMIN: 'SYSTEM_ADMIN',
    TENANT_ADMIN: 'TENANT_ADMIN',
    FACTORY_MANAGER: 'FACTORY_MANAGER',
    MCB_MANAGER: 'MCB_MANAGER',
    SHOP_MANAGER: 'SHOP_MANAGER',
    FACTORY_STAFF: 'FACTORY_STAFF',
    MCB_STAFF: 'MCB_STAFF',
    SHOP_STAFF: 'SHOP_STAFF',
    FARMER: 'FARMER',
    CUSTOMER: 'CUSTOMER',
} as const;

export type Role = keyof typeof ROLES;

// Simple role checking utilities
export const hasRole = (userRole: string | undefined, requiredRole: keyof typeof ROLES): boolean => {
    return userRole === requiredRole;
};

export const hasAnyRole = (userRole: string | undefined, requiredRoles: (keyof typeof ROLES)[]): boolean => {
    if (!userRole) return false;
    return requiredRoles.includes(userRole as keyof typeof ROLES);
};

// Simple permission checking - managers can do what their staff can do
export const canAccess = (userRole: string | undefined, requiredRole: keyof typeof ROLES): boolean => {
    if (!userRole) return false;

    // System admin can access everything
    if (userRole === ROLES.SYSTEM_ADMIN) return true;

    // Tenant admin can access all dairy operations
    if (userRole === ROLES.TENANT_ADMIN && requiredRole !== ROLES.SYSTEM_ADMIN) return true;

    // Managers can access their staff functions
    if (userRole === ROLES.FACTORY_MANAGER && requiredRole === ROLES.FACTORY_STAFF) return true;
    if (userRole === ROLES.MCB_MANAGER && requiredRole === ROLES.MCB_STAFF) return true;
    if (userRole === ROLES.SHOP_MANAGER && requiredRole === ROLES.SHOP_STAFF) return true;

    // Exact role match
    return userRole === requiredRole;
}; 