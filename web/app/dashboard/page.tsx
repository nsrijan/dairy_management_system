'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { useRouter, usePathname } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getTenantName } from '@/features/navigation/getNavItems';
import {
    Building,
    Users,
    Package,
    CreditCard,
    Droplet,
    CircleDollarSign,
    ShoppingCart,
    ArrowUpRight,
    BarChart3,
    TrendingUp,
    DollarSign
} from 'lucide-react';
import { TenantAdminDashboard } from '@/features/dashboard/components/TenantAdminDashboard';

// Simple StatCard component for dashboard
const StatCard = ({ title, value, icon, color, trend }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'purple' | 'green' | 'yellow' | 'orange';
    trend?: {
        isPositive: boolean;
        text: string;
    };
}) => {
    const colorClasses = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
        yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
        orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            {trend.text}
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Simple dashboard content for different roles
const AdminDashboard = ({ user, tenant }: { user: any, tenant: string }) => (
    <div className="space-y-6">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name || 'Administrator'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening with {tenant} today.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Tenants"
                value={12}
                icon={<Building className="h-5 w-5" />}
                color="blue"
                trend={{ isPositive: true, text: "+12.5% from last month" }}
            />
            <StatCard
                title="Active Users"
                value={156}
                icon={<Users className="h-5 w-5" />}
                color="purple"
                trend={{ isPositive: true, text: "+5.2% from last month" }}
            />
            <StatCard
                title="Monthly Revenue"
                value="₹24,850"
                icon={<CreditCard className="h-5 w-5" />}
                color="green"
                trend={{ isPositive: true, text: "+8.2% from last month" }}
            />
            <StatCard
                title="Active Modules"
                value={3}
                icon={<Package className="h-5 w-5" />}
                color="yellow"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">New tenant registered</span>
                        <span className="text-sm text-gray-500 dark:text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">System backup completed</span>
                        <span className="text-sm text-gray-500 dark:text-gray-500">4 hours ago</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    System Stats
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Server Uptime</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">68%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">42</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const DairyFarmerDashboard = ({ user, tenant }: { user: any, tenant: string }) => (
    <div className="space-y-6">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome, {user?.name || 'Farmer'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
                {tenant} • Dairy Farm Dashboard
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Milk This Week"
                value="1,250 L"
                icon={<Droplet className="h-5 w-5" />}
                color="blue"
                trend={{ isPositive: true, text: "+5.2% from last week" }}
            />
            <StatCard
                title="Average Fat %"
                value="4.2%"
                icon={<BarChart3 className="h-5 w-5" />}
                color="green"
                trend={{ isPositive: true, text: "+0.2% from last week" }}
            />
            <StatCard
                title="Current Balance"
                value="₹15,420"
                icon={<CircleDollarSign className="h-5 w-5" />}
                color="purple"
                trend={{ isPositive: true, text: "+₹2,100 today" }}
            />
            <StatCard
                title="Monthly Purchases"
                value="₹8,750"
                icon={<ShoppingCart className="h-5 w-5" />}
                color="yellow"
                trend={{ isPositive: false, text: "-12% from last month" }}
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Weekly Milk Production
                </h3>
                <div className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                        <div key={day} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{day}</span>
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{180 + index * 5}L</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Transactions
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Milk Payment</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">+₹2,100</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Feed Purchase</span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">-₹1,200</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Veterinary Services</span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">-₹450</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function DairyDashboardPage() {
    const { user, isLoading, isAuthenticated, tenant } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [currentRole, setCurrentRole] = useState<string>('');

    // Get subdomain for tenant context
    const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '';

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

    const renderDashboardByRole = () => {
        const tenantName = getTenantName(tenant, subdomain);

        switch (currentRole) {
            case 'TENANT_ADMIN':
            case 'DAIRY_ADMIN':
            case 'DAIRY_TENANT_ADMIN':
                return <TenantAdminDashboard user={user} tenant={tenantName} />;

            case 'DAIRY_FARMER':
                return <DairyFarmerDashboard user={user} tenant={tenantName} />;

            default:
                return (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Access Not Configured
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your role ({currentRole}) doesn't have a configured dashboard.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <AppLayout
            title="Dairy Dashboard"
            tenantName={getTenantName(tenant, subdomain)}
        >
            {renderDashboardByRole()}
        </AppLayout>
    );
} 