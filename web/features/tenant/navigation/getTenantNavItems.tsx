import {
    LayoutDashboard,
    Building2,
    Users,
    Package,
    BarChart4,
    Settings,
    Store,
    Truck,
    ClipboardList
} from 'lucide-react';
import { SidebarItem } from '@/components/layout/AppSidebar';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

/**
 * Gets navigation items for tenant users
 */
export function getTenantNavItems(user: User | null): SidebarItem[] {
    // Default items for all tenant users
    const defaultItems: SidebarItem[] = [
        {
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: 'Dashboard',
            href: '/tenant'
        }
    ];

    // If no user, return minimal items
    if (!user) {
        return defaultItems;
    }

    // Add tenant-specific navigation items
    const tenantItems: SidebarItem[] = [
        {
            icon: <Building2 className="h-5 w-5" />,
            label: 'Companies',
            href: '/tenant/companies'
        },
        {
            icon: <Users className="h-5 w-5" />,
            label: 'Users',
            href: '/tenant/users'
        },
        {
            icon: <Store className="h-5 w-5" />,
            label: 'Suppliers',
            href: '/tenant/suppliers'
        },
        {
            icon: <Package className="h-5 w-5" />,
            label: 'Inventory',
            href: '/tenant/inventory'
        },
        {
            icon: <ClipboardList className="h-5 w-5" />,
            label: 'Production',
            href: '/tenant/production'
        },
        {
            icon: <Truck className="h-5 w-5" />,
            label: 'Distribution',
            href: '/tenant/distribution'
        },
        {
            icon: <BarChart4 className="h-5 w-5" />,
            label: 'Reports',
            href: '/tenant/reports'
        },
        {
            icon: <Settings className="h-5 w-5" />,
            label: 'Settings',
            href: '/tenant/settings'
        }
    ];

    return [...defaultItems, ...tenantItems];
} 