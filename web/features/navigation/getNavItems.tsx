import React from 'react';
import {
    LayoutDashboard,
    Users,
    Building,
    Droplets,
    Package,
    BarChart3,
    Settings,
    Activity,
    FileText,
    Settings2,
    Truck,
    Database,
    MapPin,
    Factory,
    Store,
    Warehouse,
    TestTube,
    BarChart4
} from 'lucide-react';
import { SidebarItem } from '@/components/layout/AppSidebar';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    badge?: string;
    roles?: string[];
}

/**
 * Gets navigation items based on user role (simplified dairy operations - no /dairy prefix)
 */
export function getNavItems(user: User | null): SidebarItem[] {
    // Default items for all authenticated users
    const defaultItems: SidebarItem[] = [
        {
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: 'Dashboard',
            href: '/dashboard'
        }
    ];

    // If no user, return minimal items
    if (!user) {
        return defaultItems;
    }

    // Add role-specific items
    const roleItems: SidebarItem[] = [];

    // System Admin - System-wide management
    if (user.role === 'SYSTEM_ADMIN') {
        roleItems.push({
            icon: <Database className="h-5 w-5" />,
            label: 'System Management',
            href: '/admin'
        });
    }

    // Tenant Admin - Full dairy operations management
    if (user.role === 'TENANT_ADMIN') {
        roleItems.push(
            {
                icon: <MapPin className="h-5 w-5" />,
                label: 'Milk Collection Centers',
                href: '/milkCollectionBranch'
            },
            {
                icon: <Factory className="h-5 w-5" />,
                label: 'Factory Operations',
                href: '/factory'
            },
            {
                icon: <Store className="h-5 w-5" />,
                label: 'Retail Shops',
                href: '/shops'
            },
            {
                icon: <Users className="h-5 w-5" />,
                label: 'Farmers',
                href: '/farmers'
            },
            {
                icon: <Package className="h-5 w-5" />,
                label: 'Products',
                href: '/products'
            },
            {
                icon: <Warehouse className="h-5 w-5" />,
                label: 'Inventory',
                href: '/inventory'
            },
            {
                icon: <TestTube className="h-5 w-5" />,
                label: 'Quality Testing',
                href: '/quality'
            },
            {
                icon: <BarChart4 className="h-5 w-5" />,
                label: 'Reports',
                href: '/reports'
            }
        );
    }

    // Factory Manager - Factory operations only
    if (user.role === 'FACTORY_MANAGER') {
        roleItems.push(
            {
                icon: <Factory className="h-5 w-5" />,
                label: 'Factory Operations',
                href: '/factory'
            },
            {
                icon: <Package className="h-5 w-5" />,
                label: 'Products',
                href: '/products'
            },
            {
                icon: <Warehouse className="h-5 w-5" />,
                label: 'Inventory',
                href: '/inventory'
            }
        );
    }

    // MCB Manager - Milk collection operations
    if (user.role === 'MCB_MANAGER') {
        roleItems.push(
            {
                icon: <MapPin className="h-5 w-5" />,
                label: 'My Collection Center',
                href: '/milkCollectionBranch'
            },
            {
                icon: <Users className="h-5 w-5" />,
                label: 'Farmers',
                href: '/farmers'
            },
            {
                icon: <TestTube className="h-5 w-5" />,
                label: 'Quality Testing',
                href: '/quality'
            }
        );
    }

    // Shop Manager - Retail operations
    if (user.role === 'SHOP_MANAGER') {
        roleItems.push(
            {
                icon: <Store className="h-5 w-5" />,
                label: 'Shop Operations',
                href: '/shops'
            },
            {
                icon: <Warehouse className="h-5 w-5" />,
                label: 'Shop Inventory',
                href: '/inventory'
            }
        );
    }

    // Staff roles - Limited access to their respective areas
    if (user.role === 'FACTORY_STAFF') {
        roleItems.push({
            icon: <Factory className="h-5 w-5" />,
            label: 'Factory Operations',
            href: '/factory'
        });
    }

    if (user.role === 'MCB_STAFF') {
        roleItems.push(
            {
                icon: <MapPin className="h-5 w-5" />,
                label: 'Collection Center',
                href: '/milkCollectionBranch'
            },
            {
                icon: <TestTube className="h-5 w-5" />,
                label: 'Quality Testing',
                href: '/quality'
            }
        );
    }

    if (user.role === 'SHOP_STAFF') {
        roleItems.push({
            icon: <Store className="h-5 w-5" />,
            label: 'Shop Operations',
            href: '/shops'
        });
    }

    // Farmer - Limited access (separate dashboard)
    if (user.role === 'FARMER') {
        roleItems.push(
            {
                icon: <MapPin className="h-5 w-5" />,
                label: 'My Collections',
                href: '/farmer/collections'
            },
            {
                icon: <BarChart4 className="h-5 w-5" />,
                label: 'My Reports',
                href: '/farmer/reports'
            }
        );
    }

    // Settings for all users (except farmers who have limited access)
    if (user.role !== 'FARMER' && user.role !== 'CUSTOMER') {
        roleItems.push({
            icon: <Settings className="h-5 w-5" />,
            label: 'Settings',
            href: '/settings'
        });
    }

    return [...defaultItems, ...roleItems];
}

export function getSidebarNavItems(role: string): NavItem[] {
    const commonItems: NavItem[] = [
        {
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: 'Dashboard',
            href: '/dashboard'
        },
    ];

    switch (role) {
        case 'TENANT_ADMIN':
        case 'DAIRY_ADMIN':
        case 'DAIRY_TENANT_ADMIN':
            return [
                ...commonItems,
                {
                    icon: <Users className="h-5 w-5" />,
                    label: 'User Management',
                    href: '/users'
                },
                {
                    icon: <Building className="h-5 w-5" />,
                    label: 'Company Management',
                    href: '/companies',
                    badge: '3'
                },
                {
                    icon: <Droplets className="h-5 w-5" />,
                    label: 'Milk Collection',
                    href: '/collection'
                },
                {
                    icon: <Package className="h-5 w-5" />,
                    label: 'Inventory',
                    href: '/inventory'
                },
                {
                    icon: <BarChart3 className="h-5 w-5" />,
                    label: 'Reports',
                    href: '/reports'
                },
                {
                    icon: <Settings className="h-5 w-5" />,
                    label: 'Settings',
                    href: '/settings'
                },
            ];

        case 'DAIRY_FARMER':
            return [
                ...commonItems,
                {
                    icon: <Activity className="h-5 w-5" />,
                    label: 'Livestock',
                    href: '/livestock'
                },
                {
                    icon: <Droplets className="h-5 w-5" />,
                    label: 'Milk Production',
                    href: '/production'
                },
                {
                    icon: <Package className="h-5 w-5" />,
                    label: 'Feed Management',
                    href: '/feed'
                },
                {
                    icon: <FileText className="h-5 w-5" />,
                    label: 'Health Records',
                    href: '/health'
                },
            ];

        case 'DAIRY_PRODUCTION_MANAGER':
            return [
                ...commonItems,
                {
                    icon: <BarChart3 className="h-5 w-5" />,
                    label: 'Production Metrics',
                    href: '/production-metrics'
                },
                {
                    icon: <Settings2 className="h-5 w-5" />,
                    label: 'Quality Control',
                    href: '/quality'
                },
                {
                    icon: <Package className="h-5 w-5" />,
                    label: 'Inventory',
                    href: '/inventory'
                },
                {
                    icon: <Package className="h-5 w-5" />,
                    label: 'Processing',
                    href: '/processing'
                },
            ];

        case 'DAIRY_DELIVERY_STAFF':
            return [
                ...commonItems,
                {
                    icon: <Truck className="h-5 w-5" />,
                    label: 'Delivery Routes',
                    href: '/routes'
                },
                {
                    icon: <Activity className="h-5 w-5" />,
                    label: 'Delivery Status',
                    href: '/deliveries'
                },
                {
                    icon: <Users className="h-5 w-5" />,
                    label: 'Customer Info',
                    href: '/customers'
                },
                {
                    icon: <Settings className="h-5 w-5" />,
                    label: 'Vehicle Management',
                    href: '/vehicles'
                },
            ];

        default:
            return commonItems;
    }
}

export function getDisplayRole(role?: string): string | undefined {
    if (!role) return undefined;
    return role.replace('ROLE_', '');
}

export function getTenantName(tenant?: { name?: string }, subdomain?: string): string {
    return tenant?.name || subdomain || 'Unknown Tenant';
}