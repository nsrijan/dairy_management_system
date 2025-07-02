import {
    LayoutDashboard,
    Users,
    Building2,
    MapPin,
    Warehouse,
    Factory,
    Store,
    Package,
    TestTube,
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
                href: '/mcb'
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
                href: '/mcb'
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
                href: '/mcb'
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