'use client';

import {
    DropletIcon,
    Users,
    Building2,
    Package,
    TrendingUp,
    ArrowUp,
    ArrowDown,
    CircleDollarSign,
    Activity,
    Calendar,
    Clock,
    Bell,
    Settings,
    ChevronRight,
    BarChart3,
    Zap
} from 'lucide-react';
import { StatCard } from './StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/providers';
import { useCompanies, type Company } from '../hooks/useCompanies';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface TenantAdminDashboardProps {
    user: User;
    tenant?: string | null;
}

export function TenantAdminDashboard({ user, tenant }: TenantAdminDashboardProps) {
    const { data: companies, isLoading: companiesLoading } = useCompanies();
    const router = useRouter();

    // Calculate stats from real data
    const totalCompanies = companies?.length || 0;
    const activeCompanies = companies?.filter((c: Company) => c.isActive).length || 0;

    // Mock data for demonstration - in real app, fetch from API
    const dashboardStats = {
        totalCompanies,
        activeUsers: 156,
        monthlyRevenue: '$24,850',
        modulesActive: 3,
        inventoryValue: '$78,500',
        productsManaged: 42
    };

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
            title: 'User registered',
            time: '4 hours ago',
            details: 'jane.doe@example.com',
            user: 'System',
            urgent: false
        },
        {
            id: 3,
            type: 'inventory',
            title: 'Low stock alert',
            time: '6 hours ago',
            details: 'Milk bottles - 15 units left',
            user: 'Inventory System',
            urgent: true
        },
        {
            id: 4,
            type: 'production',
            title: 'Production completed',
            time: '8 hours ago',
            details: 'Batch #2024-001 - 500L processed',
            user: 'Production Team',
            urgent: false
        },
    ];

    const quickActions = [
        {
            label: 'Add Company',
            href: '/tenant/companies',
            icon: <Building2 className="h-4 w-4" />,
            description: 'Create a new company',
            color: 'bg-blue-500'
        },
        {
            label: 'Manage Users',
            href: '/tenant/users',
            icon: <Users className="h-4 w-4" />,
            description: 'User management',
            color: 'bg-green-500'
        },
        {
            label: 'View Inventory',
            href: '/tenant/inventory',
            icon: <Package className="h-4 w-4" />,
            description: 'Stock management',
            color: 'bg-purple-500'
        },
        {
            label: 'Reports',
            href: '/tenant/reports',
            icon: <BarChart3 className="h-4 w-4" />,
            description: 'Analytics & insights',
            color: 'bg-orange-500'
        },
    ];

    const handleNavigate = (href: string) => {
        router.push(href);
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 min-h-screen">
            {/* Enhanced Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Welcome back, {user?.name || 'User'}!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">
                        Here's what's happening with your organization today.
                    </p>
                </div>

                {/* Enhanced Date/Time Info */}
                <Card className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-800/20 border-none shadow-lg p-4 flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date().toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Enhanced Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Companies"
                    value={companiesLoading ? '...' : dashboardStats.totalCompanies.toString()}
                    icon={<Building2 />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: `${activeCompanies} active`
                    }}
                    color="blue"
                />

                <StatCard
                    title="Active Users"
                    value={dashboardStats.activeUsers.toString()}
                    icon={<Users />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "12% increase"
                    }}
                    color="green"
                />

                <StatCard
                    title="Products Managed"
                    value={dashboardStats.productsManaged.toString()}
                    icon={<Package />}
                    trend={{
                        value: <ArrowDown className="h-3 w-3 mr-1" />,
                        isPositive: false,
                        text: "3 discontinued"
                    }}
                    color="purple"
                />

                <StatCard
                    title="Monthly Revenue"
                    value={dashboardStats.monthlyRevenue}
                    icon={<CircleDollarSign />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "8% vs last month"
                    }}
                    color="amber"
                />

                <StatCard
                    title="Inventory Value"
                    value={dashboardStats.inventoryValue}
                    icon={<DropletIcon />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "5% increase"
                    }}
                    color="teal"
                />

                <StatCard
                    title="Active Modules"
                    value={dashboardStats.modulesActive.toString()}
                    icon={<Zap />}
                    trend={{
                        value: <span className="text-green-500">●</span>,
                        isPositive: true,
                        text: "All systems operational"
                    }}
                    color="purple"
                />
            </div>

            {/* Enhanced Quick Actions and Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enhanced Quick Actions */}
                <Card className="shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">Quick Actions</h3>
                            <Settings className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        {quickActions.map((action, index) => (
                            <div
                                key={index}
                                onClick={() => handleNavigate(action.href)}
                                className="group flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                            >
                                <div className={`${action.color} p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-200`}>
                                    {action.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        {action.label}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {action.description}
                                    </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Enhanced Recent Activities */}
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
            </div>

            {/* Enhanced System Status */}
            <Card className="shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">System Status</h3>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">All Systems Online</span>
                        </div>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: 'Inventory Module', status: 'Online', uptime: '99.9%' },
                        { name: 'Production Module', status: 'Online', uptime: '99.7%' },
                        { name: 'Sales Module', status: 'Online', uptime: '99.8%' }
                    ].map((module, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{module.name}</span>
                                <p className="text-xs text-green-600 dark:text-green-400">Uptime: {module.uptime}</p>
                            </div>
                            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                                {module.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}