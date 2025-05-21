'use client';

import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Users,
    Building,
    Package,
    LayoutDashboard,
    FileText,
    Calendar,
    CreditCard,
    ArrowUpRight,
    HelpCircle,
    ChevronRight,
    PlusCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ModuleType } from '@/features/tenant/types';
import Link from 'next/link';

interface DashboardStats {
    totalTenants: number;
    activeTenants: number;
    totalUsers: number;
    tenantsByModule: {
        [ModuleType.DAIRY]: number;
        [ModuleType.POTTERY]: number;
        [ModuleType.GARMENTS]: number;
    };
    revenue: number;
    growthRate: number;
}

export default function AdminPage() {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalTenants: 0,
        activeTenants: 0,
        totalUsers: 0,
        tenantsByModule: {
            [ModuleType.DAIRY]: 0,
            [ModuleType.POTTERY]: 0,
            [ModuleType.GARMENTS]: 0
        },
        revenue: 0,
        growthRate: 0
    });

    // Check if user is authenticated and has admin role
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        } else if (!isLoading && isAuthenticated && user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN') {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, router, user]);

    // This would be replaced with a real API call
    useEffect(() => {
        if (isAuthenticated && (user?.role === 'TENANT_MANAGER' || user?.role === 'SUPER_ADMIN')) {
            // Simulate loading stats
            setTimeout(() => {
                setStats({
                    totalTenants: 12,
                    activeTenants: 8,
                    totalUsers: 156,
                    tenantsByModule: {
                        [ModuleType.DAIRY]: 5,
                        [ModuleType.POTTERY]: 4,
                        [ModuleType.GARMENTS]: 3
                    },
                    revenue: 24850,
                    growthRate: 8.2
                });
            }, 500);
        }
    }, [isAuthenticated, user]);

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    if (!isAuthenticated || (user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN')) {
        return null; // Will redirect in useEffect
    }

    return (
        <>
            {/* Welcome Section */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'System Administrator'}</h2>
                <p className="text-gray-600">Here's what's happening with your platform today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="overflow-hidden border-none shadow-md">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-bl-full opacity-20"></div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Tenants</CardTitle>
                            <div className="p-2 bg-blue-50 rounded-md">
                                <Building className="h-5 w-5 text-blue-500" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalTenants}</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>+12.5% from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-purple-400 to-purple-500 rounded-bl-full opacity-20"></div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
                            <div className="p-2 bg-purple-50 rounded-md">
                                <Users className="h-5 w-5 text-purple-500" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>+5.2% from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-amber-400 to-amber-500 rounded-bl-full opacity-20"></div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Monthly Revenue</CardTitle>
                            <div className="p-2 bg-amber-50 rounded-md">
                                <CreditCard className="h-5 w-5 text-amber-500" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>+{stats.growthRate}% from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-bl-full opacity-20"></div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-500">Modules Active</CardTitle>
                            <div className="p-2 bg-emerald-50 rounded-md">
                                <Package className="h-5 w-5 text-emerald-500" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">3</div>
                        <div className="flex items-center text-xs mt-1 space-x-2">
                            <Badge className="bg-blue-100 text-blue-800 border-0 rounded-full">Dairy</Badge>
                            <Badge className="bg-amber-100 text-amber-800 border-0 rounded-full">Pottery</Badge>
                            <Badge className="bg-purple-100 text-purple-800 border-0 rounded-full">Garments</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Section */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                    { icon: <PlusCircle className="h-6 w-6" />, label: "Create Tenant", color: "bg-blue-500 hover:bg-blue-600", href: "/admin/tenants/new" },
                    { icon: <Users className="h-6 w-6" />, label: "Manage Users", color: "bg-purple-500 hover:bg-purple-600", href: "/admin/users" },
                    { icon: <Package className="h-6 w-6" />, label: "Configure Modules", color: "bg-amber-500 hover:bg-amber-600", href: "/admin/modules" },
                    { icon: <BarChart3 className="h-6 w-6" />, label: "View Reports", color: "bg-emerald-500 hover:bg-emerald-600", href: "/admin/reports" },
                    { icon: <Calendar className="h-6 w-6" />, label: "Schedule Tasks", color: "bg-pink-500 hover:bg-pink-600", href: "/admin/tasks" },
                    { icon: <HelpCircle className="h-6 w-6" />, label: "Get Support", color: "bg-indigo-500 hover:bg-indigo-600", href: "/admin/support" }
                ].map((action, index) => (
                    <Button
                        key={index}
                        className={`h-auto py-6 flex flex-col items-center justify-center gap-3 text-white ${action.color} shadow-sm hover:shadow-md transition-all`}
                        onClick={() => router.push(action.href)}
                    >
                        {action.icon}
                        <span>{action.label}</span>
                    </Button>
                ))}
            </div>

            {/* Recent Activity and Summary Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Card */}
                <Card className="lg:col-span-2 border-none shadow-md">
                    <CardHeader className="border-b pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Activity</CardTitle>
                            <Button variant="outline" size="sm" className="text-xs">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {[
                                { icon: <Users className="h-4 w-4 text-blue-500" />, title: "New user registered", time: "2 hours ago", color: "bg-blue-50" },
                                { icon: <Building className="h-4 w-4 text-green-500" />, title: "New tenant created", time: "Yesterday at 3:45 PM", color: "bg-green-50" },
                                { icon: <Package className="h-4 w-4 text-purple-500" />, title: "Module settings updated", time: "2 days ago", color: "bg-purple-50" },
                                { icon: <CreditCard className="h-4 w-4 text-amber-500" />, title: "Billing cycle completed", time: "3 days ago", color: "bg-amber-50" },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                                    <div className={`p-2 rounded-full ${activity.color}`}>
                                        {activity.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{activity.title}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links Card */}
                <Card className="border-none shadow-md">
                    <CardHeader className="border-b pb-3">
                        <CardTitle>Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {[
                                { label: "View all tenants", icon: <ChevronRight className="h-4 w-4" />, href: "/admin/tenants" },
                                { label: "User management", icon: <ChevronRight className="h-4 w-4" />, href: "/admin/users" },
                                { label: "Module configuration", icon: <ChevronRight className="h-4 w-4" />, href: "/admin/modules" },
                                { label: "System settings", icon: <ChevronRight className="h-4 w-4" />, href: "/admin/settings" },
                                { label: "Billing & subscriptions", icon: <ChevronRight className="h-4 w-4" />, href: "/admin/billing" }
                            ].map((link, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer"
                                    onClick={() => router.push(link.href)}
                                >
                                    <span className="font-medium text-gray-700">{link.label}</span>
                                    {link.icon}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
} 