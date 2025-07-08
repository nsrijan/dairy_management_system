'use client';

import {
    Users,
    Building2,
    Globe,
    Shield,
    TrendingUp,
    ArrowUp,
    Activity,
    Settings,
    ChevronRight,
    BarChart3,
    Database,
    Server,
    UserCheck,
    AlertTriangle
} from 'lucide-react';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AdminDashboardProps {
    user?: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
    const router = useRouter();

    // Mock data for system admin dashboard - in real app, fetch from API
    const systemStats = {
        totalTenants: 24,
        activeTenants: 21,
        totalUsers: 1567,
        systemLoad: 78,
        storageUsed: 65,
        monthlyRevenue: '$156,850'
    };

    const recentSystemEvents = [
        {
            id: 1,
            type: 'tenant',
            title: 'New tenant created',
            time: '1 hour ago',
            details: 'DairyTech Solutions onboarded',
            severity: 'info'
        },
        {
            id: 2,
            type: 'security',
            title: 'Security alert',
            time: '3 hours ago',
            details: 'Multiple failed login attempts detected',
            severity: 'warning'
        },
        {
            id: 3,
            type: 'system',
            title: 'System maintenance completed',
            time: '6 hours ago',
            details: 'Database optimization finished',
            severity: 'success'
        },
        {
            id: 4,
            type: 'tenant',
            title: 'Tenant subscription updated',
            time: '8 hours ago',
            details: 'ABC Dairy upgraded to premium plan',
            severity: 'info'
        },
    ];

    const quickAdminActions = [
        {
            label: 'Manage Tenants',
            href: '/admin/tenants',
            icon: <Building2 className="h-4 w-4" />,
            description: 'Create and manage tenants',
            color: 'bg-blue-500'
        },
        {
            label: 'System Users',
            href: '/admin/users',
            icon: <Users className="h-4 w-4" />,
            description: 'Manage system administrators',
            color: 'bg-green-500'
        },
        {
            label: 'System Health',
            href: '/admin/system',
            icon: <Server className="h-4 w-4" />,
            description: 'Monitor system performance',
            color: 'bg-purple-500'
        },
        {
            label: 'Security Center',
            href: '/admin/security',
            icon: <Shield className="h-4 w-4" />,
            description: 'Security monitoring & logs',
            color: 'bg-red-500'
        },
        {
            label: 'Analytics',
            href: '/admin/analytics',
            icon: <BarChart3 className="h-4 w-4" />,
            description: 'System-wide analytics',
            color: 'bg-orange-500'
        },
        {
            label: 'Configuration',
            href: '/admin/settings',
            icon: <Settings className="h-4 w-4" />,
            description: 'System configuration',
            color: 'bg-gray-500'
        },
    ];

    const handleNavigate = (href: string) => {
        router.push(href);
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'success': return 'text-green-600 bg-green-50 border-green-200';
            case 'error': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    const getSeverityIcon = (type: string) => {
        switch (type) {
            case 'security': return <Shield className="h-4 w-4" />;
            case 'system': return <Server className="h-4 w-4" />;
            case 'tenant': return <Building2 className="h-4 w-4" />;
            default: return <Activity className="h-4 w-4" />;
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 min-h-screen">
            {/* System Admin Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        System Administration
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">
                        Welcome back, {user?.name || 'Administrator'}. Manage the entire platform from here.
                    </p>
                </div>

                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-800/20 border-none shadow-lg p-4 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            System Admin Access
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Full platform privileges
                        </div>
                    </div>
                </Card>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Tenants"
                    value={systemStats.totalTenants.toString()}
                    icon={<Building2 />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: `${systemStats.activeTenants} active`
                    }}
                    color="blue"
                />

                <StatCard
                    title="Platform Users"
                    value={systemStats.totalUsers.toString()}
                    icon={<Users />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "8% growth"
                    }}
                    color="green"
                />

                <StatCard
                    title="Monthly Revenue"
                    value={systemStats.monthlyRevenue}
                    icon={<TrendingUp />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "15% increase"
                    }}
                    color="purple"
                />
            </div>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Quick Admin Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quickAdminActions.map((action, index) => (
                            <Card
                                key={index}
                                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 border-l-4 border-l-transparent hover:border-l-blue-500"
                                onClick={() => handleNavigate(action.href)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${action.color} text-white`}>
                                            {action.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                                {action.label}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {action.description}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* System Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent System Events */}
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Recent System Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentSystemEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className={`p-3 rounded-lg border ${getSeverityColor(event.severity)}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {getSeverityIcon(event.type)}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">{event.title}</h4>
                                                <span className="text-xs text-gray-500">{event.time}</span>
                                            </div>
                                            <p className="text-sm mt-1">{event.details}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => handleNavigate('/admin/events')}
                        >
                            View All Events
                        </Button>
                    </CardContent>
                </Card>

                {/* System Health */}
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5" />
                            System Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">System Load</span>
                                <Badge variant={systemStats.systemLoad > 80 ? "destructive" : "secondary"}>
                                    {systemStats.systemLoad}%
                                </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                <div
                                    className={`h-2 rounded-full ${systemStats.systemLoad > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${systemStats.systemLoad}%` }}
                                ></div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Storage Used</span>
                                <Badge variant={systemStats.storageUsed > 80 ? "destructive" : "secondary"}>
                                    {systemStats.storageUsed}%
                                </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                <div
                                    className={`h-2 rounded-full ${systemStats.storageUsed > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                                    style={{ width: `${systemStats.storageUsed}%` }}
                                ></div>
                            </div>

                            <div className="pt-2 border-t">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                    <span>All systems operational</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => handleNavigate('/admin/system')}
                        >
                            View System Details
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 