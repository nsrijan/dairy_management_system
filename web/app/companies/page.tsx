'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { useTheme } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CompanyList } from '@/features/companies/components/CompanyList';
import { CompanyFormDialog } from '@/features/companies/components/CompanyFormDialog';
import { DeleteCompanyDialog } from '@/features/companies/components/DeleteCompanyDialog';
import { useCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany, type Company } from '@/features/companies/hooks/useCompanies';
import {
    LayoutDashboard,
    Users,
    Building,
    Settings,
    Bell,
    Search,
    Package,
    FileText,
    Menu,
    LogOut,
    Moon,
    Sun,
    User,
    Droplets,
    BarChart3,
    Plus,
    Building2,
    Activity,
    ChevronRight
} from 'lucide-react';
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
}

export default function CompaniesPage() {
    const { user, isLoading, isAuthenticated, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const [currentRole, setCurrentRole] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notificationCount, setNotificationCount] = useState(2);

    // Company management state
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);

    const { data: companies, isLoading: companiesLoading } = useCompanies();
    const createCompanyMutation = useCreateCompany();
    const updateCompanyMutation = useUpdateCompany();
    const deleteCompanyMutation = useDeleteCompany();

    // Define navigation items based on role
    const getSidebarNavItems = (role: string): NavItem[] => {
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
                        badge: companies?.length?.toString() || '0'
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
            default:
                return commonItems;
        }
    };

    const sidebarNavItems = getSidebarNavItems(currentRole || '');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user?.role) {
            const primaryRole = user.role.replace('ROLE_', '');
            setCurrentRole(primaryRole);

            const allowedRoles = ['TENANT_ADMIN', 'DAIRY_ADMIN', 'DAIRY_TENANT_ADMIN', 'COMPANY_ADMIN'];
            if (!allowedRoles.includes(primaryRole)) {
                router.push('/unauthorized');
                return;
            }
        }
    }, [user, isLoading, isAuthenticated, router]);

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

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    // Company management handlers
    const handleCreate = async (data: { name: string; description?: string; isActive: boolean }) => {
        await createCompanyMutation.mutateAsync(data);
        setIsCreateDialogOpen(false);
    };

    const handleUpdate = async (id: string, data: { name: string; description?: string; isActive: boolean }) => {
        await updateCompanyMutation.mutateAsync({ id, data });
        setEditingCompany(null);
    };

    const handleDelete = async (id: string) => {
        await deleteCompanyMutation.mutateAsync(id);
        setDeletingCompany(null);
    };

    // Recent activities data
    const recentActivities = [
        {
            id: 1,
            type: 'company',
            title: 'New company added',
            time: '2 hours ago',
            details: 'ABC Dairy Ltd.',
            user: 'John Smith',
            urgent: false
        },
        {
            id: 2,
            type: 'user',
            title: 'Company updated',
            time: '4 hours ago',
            details: 'XYZ Foods - status changed to active',
            user: 'Jane Doe',
            urgent: false
        },
        {
            id: 3,
            type: 'inventory',
            title: 'Company integration',
            time: '6 hours ago',
            details: 'Fresh Dairy - API integration completed',
            user: 'System',
            urgent: false
        },
        {
            id: 4,
            type: 'production',
            title: 'Company audit',
            time: '1 day ago',
            details: 'Monthly compliance check completed',
            user: 'Audit Team',
            urgent: false
        },
    ];

    if (isLoading || companiesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user || !currentRole) {
        return null;
    }

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
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

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

                {/* Search bar at bottom of sidebar */}
                {sidebarOpen && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-9 pr-4 py-2 h-10 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                )}

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
                {/* Top Header */}
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
                                Company Management
                            </h1>
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                {companies?.length || 0} Companies
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <Search className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search companies..."
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
                                        <p className="font-medium text-sm text-gray-900 dark:text-white">New Chrome available</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Update your browser for better performance</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                                    </div>
                                    <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        <p className="font-medium text-sm text-gray-900 dark:text-white">Company Integration</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">ABC Dairy connected successfully</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
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
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-md px-2 py-1.5 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <Settings className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                    <Link href="/settings">Settings</Link>
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
                <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Companies Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Companies Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Companies ({companies?.length || 0})
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Manage your organization's companies and their settings.
                                    </p>
                                </div>
                                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Company
                                </Button>
                            </div>

                            {/* Companies List Card */}
                            <Card className="shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className="p-6">
                                    <CompanyList
                                        companies={companies || []}
                                        onEdit={setEditingCompany}
                                        onDelete={setDeletingCompany}
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* Recent Activities Sidebar */}
                        <div className="space-y-6">
                            {/* Recent Activities Card */}
                            <Card className="shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">Recent Activities</h3>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-700">Today</Badge>
                                        <Bell className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                                    {recentActivities.map(activity => (
                                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                                            <div className="flex-shrink-0 relative">
                                                <div className={`p-2 rounded-full ${activity.type === 'company' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                    activity.type === 'user' ? 'bg-green-100 dark:bg-green-900/30' :
                                                        activity.type === 'inventory' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                            'bg-purple-100 dark:bg-purple-900/30'
                                                    }`}>
                                                    {activity.type === 'company' && <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                                                    {activity.type === 'user' && <Users className="h-4 w-4 text-green-600 dark:text-green-400" />}
                                                    {activity.type === 'inventory' && <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                                                    {activity.type === 'production' && <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                                                </div>
                                                {activity.urgent && (
                                                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {activity.title}
                                                    </p>
                                                    {activity.urgent && (
                                                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {activity.details}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                                        {activity.time}
                                                    </span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                                        by {activity.user}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-center pt-2">
                                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                            View all activities
                                            <ChevronRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* New Chrome Notification */}
                            <Card className="shadow-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                                <div className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                New Chrome available
                                            </h4>
                                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                Update your browser for better performance and security.
                                            </p>
                                            <Button size="sm" variant="outline" className="mt-2 text-blue-600 border-blue-300 hover:bg-blue-100">
                                                Update Now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            {/* Dialogs */}
            <CompanyFormDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreate}
                isLoading={createCompanyMutation.isPending}
                title="Create New Company"
                description="Add a new company to your organization."
            />

            {editingCompany && (
                <CompanyFormDialog
                    open={true}
                    onOpenChange={(open) => !open && setEditingCompany(null)}
                    onSubmit={(data) => handleUpdate(editingCompany.id, data)}
                    isLoading={updateCompanyMutation.isPending}
                    title="Edit Company"
                    description="Update company information."
                    initialData={{
                        name: editingCompany.name,
                        description: editingCompany.description || '',
                        isActive: editingCompany.isActive,
                    }}
                />
            )}

            {deletingCompany && (
                <DeleteCompanyDialog
                    open={true}
                    onOpenChange={(open) => !open && setDeletingCompany(null)}
                    onConfirm={() => handleDelete(deletingCompany.id)}
                    isLoading={deleteCompanyMutation.isPending}
                    companyName={deletingCompany.name}
                />
            )}
        </div>
    );
} 