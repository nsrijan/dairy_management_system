export const Roles = {
    SYSTEM_ADMIN: 'SYSTEM_ADMIN',
    TENANT_ADMIN: 'TENANT_ADMIN',
    TENANT_MANAGER: 'TENANT_MANAGER',
    COMPANY_ADMIN: 'COMPANY_ADMIN',
    MANAGER: 'MANAGER',
    STAFF: 'STAFF',
} as const;

export type Role = keyof typeof Roles;

export const hasRole = (userRole: string | undefined, requiredRole: Role): boolean => {
    if (!userRole) return false;
    return userRole === requiredRole;
};

export const hasAnyRole = (userRole: string | undefined, requiredRoles: Role[]): boolean => {
    if (!userRole) return false;
    return requiredRoles.some(role => userRole === role);
};

// Role hierarchy for permission inheritance
export const RoleHierarchy: Record<Role, Role[]> = {
    SYSTEM_ADMIN: ['SYSTEM_ADMIN', 'TENANT_ADMIN', 'TENANT_MANAGER', 'COMPANY_ADMIN', 'MANAGER', 'STAFF'],
    TENANT_ADMIN: ['TENANT_ADMIN', 'TENANT_MANAGER', 'COMPANY_ADMIN', 'MANAGER', 'STAFF'],
    TENANT_MANAGER: ['TENANT_MANAGER', 'COMPANY_ADMIN', 'MANAGER', 'STAFF'],
    COMPANY_ADMIN: ['COMPANY_ADMIN', 'MANAGER', 'STAFF'],
    MANAGER: ['MANAGER', 'STAFF'],
    STAFF: ['STAFF'],
};

export const hasPermissionLevel = (userRole: string | undefined, requiredRole: Role): boolean => {
    if (!userRole) return false;
    const userRoleEnum = userRole as Role;
    return RoleHierarchy[userRoleEnum]?.includes(requiredRole) || false;
}; 