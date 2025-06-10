// Define all possible domains
export const Domains = {
    SYSTEM: 'SYSTEM',
    DAIRY: 'DAIRY',
    POULTRY: 'POULTRY',
    // Add more domains as needed
} as const;

export type Domain = keyof typeof Domains;

// Define roles for each domain
export const DomainRoles = {
    [Domains.SYSTEM]: {
        ADMIN: 'SYSTEM_ADMIN',
        TENANT_MANAGER: 'TENANT_MANAGER',

    },
    [Domains.DAIRY]: {
        TENANT_ADMIN: 'TENANT_ADMIN',
        ADMIN: 'DAIRY_ADMIN',
        MANAGER: 'DAIRY_MANAGER',
        FARMER: 'DAIRY_FARMER',
        COLLECTOR: 'MILK_COLLECTOR',
        PROCESSOR: 'MILK_PROCESSOR',
    },
    [Domains.POULTRY]: {
        ADMIN: 'POULTRY_ADMIN',
        MANAGER: 'POULTRY_MANAGER',
        FARMER: 'POULTRY_FARMER',
        INSPECTOR: 'POULTRY_INSPECTOR',
    },
} as const;

// Type for all possible roles across all domains
export type DomainRole = (typeof RouteAccess)[keyof typeof RouteAccess]['roles'][number];

// Define route patterns and their required roles
export const RouteAccess: Record<string, { domain: Domain; roles: string[] }> = {
    // System routes
    '/admin/**': {
        domain: Domains.SYSTEM,
        roles: [DomainRoles[Domains.SYSTEM].ADMIN],
    },
    '/tenant/**': {
        domain: Domains.SYSTEM,
        roles: [DomainRoles[Domains.SYSTEM].TENANT_ADMIN, DomainRoles[Domains.SYSTEM].TENANT_MANAGER],
    },

    // Dairy domain routes
    '/dairy/**': {
        domain: Domains.DAIRY,
        roles: Object.values(DomainRoles[Domains.DAIRY]),
    },
    '/dairy/admin/**': {
        domain: Domains.DAIRY,
        roles: [DomainRoles[Domains.DAIRY].ADMIN],
    },
    '/dairy/collection/**': {
        domain: Domains.DAIRY,
        roles: [DomainRoles[Domains.DAIRY].COLLECTOR, DomainRoles[Domains.DAIRY].ADMIN, DomainRoles[Domains.DAIRY].MANAGER],
    },

    // Poultry domain routes
    '/poultry/**': {
        domain: Domains.POULTRY,
        roles: Object.values(DomainRoles[Domains.POULTRY]),
    },
    '/poultry/admin/**': {
        domain: Domains.POULTRY,
        roles: [DomainRoles[Domains.POULTRY].ADMIN],
    },
};

// Helper function to check if a role belongs to a domain
export const isDomainRole = (role: string, domain: Domain): boolean => {
    return Object.values(DomainRoles[domain]).includes(role as any);
};

// Helper function to get domain from a role
export const getDomainFromRole = (role: string): Domain | null => {
    for (const [domain, roles] of Object.entries(DomainRoles)) {
        if (Object.values(roles).includes(role as any)) {
            return domain as Domain;
        }
    }
    return null;
};

// Helper function to check if a route matches a pattern
export const matchRoute = (route: string, pattern: string): boolean => {
    const routeParts = route.split('/');
    const patternParts = pattern.split('/');

    // If pattern has '**', it matches everything after that point
    const wildcardIndex = patternParts.indexOf('**');
    if (wildcardIndex !== -1) {
        // Check parts before wildcard match exactly
        for (let i = 0; i < wildcardIndex; i++) {
            if (patternParts[i] !== routeParts[i]) {
                return false;
            }
        }
        return true; // If we get here, everything before wildcard matched
    }

    // If no wildcard, lengths must match and all parts must match exactly
    if (routeParts.length !== patternParts.length) {
        return false;
    }

    return patternParts.every((part, i) => part === routeParts[i]);
};

// Helper function to get required roles for a route
export const getRouteAccess = (route: string) => {
    for (const [pattern, access] of Object.entries(RouteAccess)) {
        if (matchRoute(route, pattern)) {
            return access;
        }
    }
    return null;
}; 