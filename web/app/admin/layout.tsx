'use client';

import { useState, useEffect, ReactNode } from 'react';
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
    LogOut
} from 'lucide-react';
import { useAuth } from '@/app/providers';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    badge?: string;
}

const sidebarNavItems: NavItem[] = [
    {
        icon: <LayoutDashboard className="h-5 w-5" />,
        label: 'Dashboard',
        href: '/admin'
    },
    {
        icon: <Building className="h-5 w-5" />,
        label: 'Tenants',
        href: '/admin/tenants',
        badge: '12'
    },
    {
        icon: <Users className="h-5 w-5" />,
        label: 'Users',
        href: '/admin/users'
    },
    {
        icon: <Package className="h-5 w-5" />,
        label: 'Modules',
        href: '/admin/modules'
    },
    {
        icon: <FileText className="h-5 w-5" />,
        label: 'Reports',
        href: '/admin/reports'
    },
    {
        icon: <CreditCard className="h-5 w-5" />,
        label: 'Billing',
        href: '/admin/billing'
    },
    {
        icon: <Settings className="h-5 w-5" />,
        label: 'Settings',
        href: '/admin/settings'
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    // Check if user is authenticated and has admin role
    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                redirect('/login');
            } else if (user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN') {
                redirect('/dashboard');
            }
        }
    }, [isAuthenticated, isLoading, user]);

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

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    if (!isAuthenticated || (user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN')) {
        return null; // Will redirect in useEffect
    }

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
                    sidebarOpen ? "w-64" : "w-20"
                )}
            >
                {/* Sidebar Header */}
                <div className="flex items-center h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600">
                    <div className={cn("flex items-center", sidebarOpen ? "justify-between w-full" : "justify-center")}>
                        {sidebarOpen && (
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-indigo-600 font-bold text-xl mr-2">M</div>
                                <span className="text-white font-bold text-lg">Modulynx</span>
                            </div>
                        )}
                        {!sidebarOpen && (
                            <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center text-indigo-600 font-bold text-xl">M</div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("text-white hover:bg-indigo-700", !sidebarOpen && "hidden")}
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
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                            return (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "text-gray-700 hover:bg-gray-100",
                                            !sidebarOpen && "justify-center px-0"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center",
                                            isActive ? "text-indigo-600" : "text-gray-500"
                                        )}>
                                            {item.icon}
                                        </div>

                                        {sidebarOpen && (
                                            <div className="flex flex-1 items-center justify-between ml-3">
                                                <span>{item.label}</span>
                                                {item.badge && (
                                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">{item.badge}</Badge>
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
                <div className="p-4 border-t border-gray-200">
                    {sidebarOpen ? (
                        <div className="flex items-center">
                            <Avatar className="h-9 w-9 border-2 border-white">
                                <AvatarImage src="/avatar-placeholder.png" alt="Avatar" />
                                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-gray-500">{user?.role || 'SUPER_ADMIN'}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Avatar className="h-9 w-9 border-2 border-white">
                                <AvatarImage src="/avatar-placeholder.png" alt="Avatar" />
                                <AvatarFallback className="bg-indigo-100 text-indigo-600">
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
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden mr-2"
                            onClick={toggleSidebar}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold text-gray-900">
                            {pathname === '/admin' ? 'Admin Dashboard' :
                                pathname.includes('/tenants') ? 'Tenant Management' :
                                    pathname.includes('/users') ? 'User Management' :
                                        pathname.includes('/modules') ? 'Module Management' :
                                            pathname.includes('/reports') ? 'Reports' :
                                                pathname.includes('/billing') ? 'Billing' :
                                                    pathname.includes('/settings') ? 'Settings' : 'Admin'}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 h-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <Button size="icon" variant="ghost" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                        </Button>

                        <div className="hidden md:flex items-center">
                            <Avatar className="h-8 w-8 border-2 border-white">
                                <AvatarImage src="/avatar-placeholder.png" alt="Avatar" />
                                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-2">
                                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
} 