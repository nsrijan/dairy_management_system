'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { useSubdomain } from '@/app/subdomain-login-helper';
import { TenantAdminDashboard } from '@/features/dairy/dashboard/components/TenantAdminDashboard';
import { FarmerDashboard } from '@/features/dairy/dashboard/components/FarmerDashboard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Users,
    Building,
    Settings,
    Bell,
    Search,
    Package,
    LayoutDashboard,
    FileText,
    Calendar,
    CreditCard,
    HelpCircle,
    Menu,
    LogOut,
    Moon,
    Sun,
    User,
    Settings2,
    Droplets,
    Truck,
    Activity,
    Database
} from 'lucide-react';
import { useTheme } from '@/app/providers';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    badge?: string;
    roles?: string[];
}

export default function DairyDashboardPage() {
    const { user, tenant, isLoading, isAuthenticated, logout } = useAuth();
    const { subdomain } = useSubdomain();
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const [currentRole, setCurrentRole] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notificationCount, setNotificationCount] = useState(2);

    // Define navigation items based on role
    const getSidebarNavItems = (role: string): NavItem[] => {
        const commonItems: NavItem[] = [
            {
                icon: <LayoutDashboard className="h-5 w-5" />,
                label: 'Dashboard',
                href: '/dairy/dashboard'
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
                        href: '/dairy/users'
                    },
                    {
                        icon: <Building className="h-5 w-5" />,
                        label: 'Companies',
                        href: '/dairy/companies',
                        badge: '3'
                    },
                    {
                        icon: <Droplets className="h-5 w-5" />,
                        label: 'Milk Collection',
                        href: '/dairy/collection'
                    },
                    {
                        icon: <Database className="h-5 w-5" />,
                        label: 'Inventory',
                        href: '/dairy/inventory'
                    },
                    {
                        icon: <BarChart3 className="h-5 w-5" />,
                        label: 'Reports',
                        href: '/dairy/reports'
                    },
                    {
                        icon: <Settings className="h-5 w-5" />,
                        label: 'Settings',
                        href: '/dairy/settings'
                    },
                ];

            case 'DAIRY_FARMER':
                return [
                    ...commonItems,
                    {
                        icon: <Activity className="h-5 w-5" />,
                        label: 'Livestock',
                        href: '/dairy/livestock'
                    },
                    {
                        icon: <Droplets className="h-5 w-5" />,
                        label: 'Milk Production',
                        href: '/dairy/production'
                    },
                    {
                        icon: <Package className="h-5 w-5" />,
                        label: 'Feed Management',
                        href: '/dairy/feed'
                    },
                    {
                        icon: <FileText className="h-5 w-5" />,
                        label: 'Health Records',
                        href: '/dairy/health'
                    },
                ];

            case 'DAIRY_PRODUCTION_MANAGER':
                return [
                    ...commonItems,
                    {
                        icon: <BarChart3 className="h-5 w-5" />,
                        label: 'Production Metrics',
                        href: '/dairy/production-metrics'
                    },
                    {
                        icon: <Settings2 className="h-5 w-5" />,
                        label: 'Quality Control',
                        href: '/dairy/quality'
                    },
                    {
                        icon: <Database className="h-5 w-5" />,
                        label: 'Inventory',
                        href: '/dairy/inventory'
                    },
                    {
                        icon: <Package className="h-5 w-5" />,
                        label: 'Processing',
                        href: '/dairy/processing'
                    },
                ];

            case 'DAIRY_DELIVERY_STAFF':
                return [
                    ...commonItems,
                    {
                        icon: <Truck className="h-5 w-5" />,
                        label: 'Delivery Routes',
                        href: '/dairy/routes'
                    },
                    {
                        icon: <Activity className="h-5 w-5" />,
                        label: 'Delivery Status',
                        href: '/dairy/deliveries'
                    },
                    {
                        icon: <Users className="h-5 w-5" />,
                        label: 'Customer Info',
                        href: '/dairy/customers'
                    },
                    {
                        icon: <Settings className="h-5 w-5" />,
                        label: 'Vehicle Management',
                        href: '/dairy/vehicles'
                    },
                ];

            default:
                return commonItems;
        }
    };

    // Adjust sidebar based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user?.role) {
            // Remove ROLE_ prefix if it exists
            const primaryRole = user.role.replace('ROLE_', '');
            setCurrentRole(primaryRole);

            // Check if user has access to dairy dashboard
            const allowedRoles = ['TENANT_ADMIN', 'DAIRY_ADMIN', 'DAIRY_TENANT_ADMIN', 'DAIRY_FARMER'];
            if (!allowedRoles.includes(primaryRole)) {
                router.push('/unauthorized');
                return;
            }
        }
    }, [user, isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user || !currentRole) {
        return null; // Router push will handle redirect
    }

    const getTenantName = () => {
        return tenant?.name || subdomain || 'Unknown Tenant';
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const sidebarNavItems = getSidebarNavItems(currentRole);

    const renderDashboardByRole = () => {
        const tenantName = getTenantName();

        switch (currentRole) {
            case 'TENANT_ADMIN':
            case 'DAIRY_ADMIN':
            case 'DAIRY_TENANT_ADMIN':
                return <TenantAdminDashboard user={user} tenant={tenantName} />;

            case 'DAIRY_FARMER':
                return <FarmerDashboard user={user} tenant={tenantName} />;

            default:
                return (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Access Not Configured
                            </h2>
                            <p className="text-gray-600">
                                Your role ({currentRole}) doesn't have a configured dashboard.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${theme === 'dark' ? 'dark' : ''}`}>
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
                    sidebarOpen ? "w-64" : "w-20"
                )}
            >
                {/* Sidebar Header */}
                <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-teal-600">
                    <div className={cn("flex items-center", sidebarOpen ? "justify-between w-full" : "justify-center")}>
                        {sidebarOpen && (
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-blue-600 font-bold text-xl mr-2">
                                    <Droplets className="h-5 w-5" />
                                </div>
                                <span className="text-white font-bold text-lg">Dairy Management</span>
                            </div>
                        )}
                        {!sidebarOpen && (
                            <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center text-blue-600 font-bold text-xl">
                                <Droplets className="h-6 w-6" />
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("text-white hover:bg-blue-700", !sidebarOpen && "hidden")}
                            onClick={toggleSidebar}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        {sidebarNavItems.map((item, index) => {
                            const isActive = pathname === item.href || (item.href !== '/dairy/dashboard' && pathname.startsWith(item.href));

                            return (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60",
                                            !sidebarOpen && "justify-center px-0"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center",
                                            isActive ? "text-blue-600 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"
                                        )}>
                                            {item.icon}
                                        </div>

                                        {sidebarOpen && (
                                            <div className="flex flex-1 items-center justify-between ml-3">
                                                <span>{item.label}</span>
                                                {item.badge && (
                                                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">{item.badge}</Badge>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {sidebarOpen ? (
                        <div className="flex items-center">
                            <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
                                <AvatarImage src="/avatar-placeholder.png" alt="Avatar" />
                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{currentRole}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
                                <AvatarImage src="/avatar-placeholder.png" alt="Avatar" />
                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "flex-1 transition-all duration-300",
                sidebarOpen ? "ml-64" : "ml-20"
            )}>
                {/* Top Navbar */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden mr-2 dark:text-gray-300"
                            onClick={toggleSidebar}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center space-x-2">
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Dairy Dashboard
                            </h1>
                            {getTenantName() && (
                                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                    {getTenantName()}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <Search className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 h-10 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        {/* Notifications Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <Bell className="h-5 w-5" />
                                    {notificationCount > 0 && (
                                        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold">
                                            {notificationCount}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                                <div className="max-h-80 overflow-y-auto space-y-1">
                                    <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        <p className="font-medium text-sm text-gray-900 dark:text-white">Low Stock Alert</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Milk bottles - 15 units left</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</p>
                                    </div>
                                    <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        <p className="font-medium text-sm text-gray-900 dark:text-white">Production Update</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Batch #2024-001 completed</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* User Menu Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 px-2 transition-colors">
                                    <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                                        <AvatarImage src="/avatar-placeholder.png" alt="Avatar" />
                                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-2 hidden md:block">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{user?.name || 'User'}</p>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                                <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-200">
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuItem className="rounded-md px-2 py-1.5 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                    <Link href="/dairy/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-md px-2 py-1.5 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <Settings className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                    <Link href="/dairy/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />
                                <DropdownMenuItem
                                    className="rounded-md px-2 py-1.5 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={logout}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <div className="dark:bg-gray-900">
                    {renderDashboardByRole()}
                </div>
            </main>
        </div>
    );
} 