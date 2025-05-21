import {
    LayoutDashboard,
    Users,
    Building2,
    Store,
    Warehouse,
    Factory,
    ShoppingCart,
    Truck,
    BarChart4,
    Settings,
    Database
} from 'lucide-react';
import { SidebarItem } from '@/components/layout/AppSidebar';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

/**
 * Gets navigation items based on user role
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

    // Add tenant management for TENANT_MANAGER and SUPER_ADMIN
    if (user.role === 'TENANT_MANAGER' || user.role === 'SUPER_ADMIN') {
        roleItems.push({
            icon: <Database className="h-5 w-5" />,
            label: 'Tenant Management',
            href: '/admin/tenants'
        });
    }

    // Add other module items based on roles (common for tenant users)
    if (user.role === 'SUPER_ADMIN' || user.role === 'COMPANY_ADMIN' || user.role === 'MANAGER') {
        roleItems.push({
            icon: <Building2 className="h-5 w-5" />,
            label: 'Company',
            href: '/dashboard/company'
        });

        roleItems.push({
            icon: <Users className="h-5 w-5" />,
            label: 'Users',
            href: '/dashboard/users'
        });
    }

    // For authenticated users in a tenant context
    if (user.role !== 'TENANT_MANAGER') {
        roleItems.push(
            {
                icon: <Store className="h-5 w-5" />,
                label: 'Suppliers',
                href: '/dashboard/suppliers'
            },
            {
                icon: <Warehouse className="h-5 w-5" />,
                label: 'Inventory',
                href: '/dashboard/inventory'
            },
            {
                icon: <Factory className="h-5 w-5" />,
                label: 'Production',
                href: '/dashboard/production'
            },
            {
                icon: <ShoppingCart className="h-5 w-5" />,
                label: 'Sales',
                href: '/dashboard/sales'
            },
            {
                icon: <Truck className="h-5 w-5" />,
                label: 'Distribution',
                href: '/dashboard/distribution'
            },
            {
                icon: <BarChart4 className="h-5 w-5" />,
                label: 'Reports',
                href: '/dashboard/reports'
            }
        );
    }

    // Settings for all users
    roleItems.push({
        icon: <Settings className="h-5 w-5" />,
        label: 'Settings',
        href: '/dashboard/settings'
    });

    return [...defaultItems, ...roleItems];
} 