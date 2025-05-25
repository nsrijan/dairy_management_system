import { ReactNode } from 'react';

// Import dashboards as we create them
import { AdminDashboard } from '../domains/admin/components/AdminDashboard';
import { DairyFarmerDashboard } from '../domains/dairy/components/dashboard/DairyFarmerDashboard';

// Define domain types
export enum DomainType {
    ADMIN = 'ADMIN',
    DAIRY = 'DAIRY',
    POTTERY = 'POTTERY',
    GARMENTS = 'GARMENTS',
}

// Define role types (will expand as needed)
export enum RoleType {
    DEFAULT = 'default',
    FARMER = 'FARMER',
    SUPPLIER = 'SUPPLIER',
    ARTISAN = 'ARTISAN',
}

// Dashboard component type
export type DashboardComponent = React.ComponentType<{ user: any }>;

// Create registry mapping
interface DashboardRegistry {
    [domain: string]: {
        [role: string]: DashboardComponent;
    };
}

// The registry maps domain+role combinations to their dashboard components
export const dashboardRegistry: DashboardRegistry = {
    // System level
    [DomainType.ADMIN]: {
        [RoleType.DEFAULT]: AdminDashboard,
    },

    // Dairy domain
    [DomainType.DAIRY]: {
        [RoleType.FARMER]: DairyFarmerDashboard,
        // Add more roles later as needed:
        // [RoleType.SUPPLIER]: DairySupplierDashboard,
    },

    // Other domains will be added here as we implement them
};

// Generic fallback dashboard - will implement later
export const GenericDashboard: DashboardComponent = ({ user }) => {
    return (
        <div>Generic Dashboard for {user?.name || 'User'}</div>
    );
};

// Dashboard resolver function
export function resolveDashboard(domain: string, role: string): DashboardComponent {
    // Check if domain exists in registry
    if (!dashboardRegistry[domain]) {
        console.warn(`No dashboard found for domain: ${domain}`);
        return GenericDashboard;
    }

    // Return role-specific dashboard or default for that domain
    return dashboardRegistry[domain][role] || dashboardRegistry[domain][RoleType.DEFAULT] || GenericDashboard;
} 