'use client';

import { useState, useEffect } from 'react';
import { StatCard, ChartCard } from '../../../dashboard/widgets';
import {
    Building,
    Users,
    Package,
    CreditCard,
    ArrowUpRight,
} from 'lucide-react';
import { TenantStatsPanel } from './panels/TenantStatsPanel';
import { SystemStatsPanel } from './panels/SystemStatsPanel';

// Mock data types
interface AdminDashboardStats {
    totalTenants: number;
    activeTenants: number;
    totalUsers: number;
    tenantsByModule: {
        DAIRY: number;
        POTTERY: number;
        GARMENTS: number;
    };
    revenue: number;
    growthRate: number;
}

export interface AdminDashboardProps {
    user: any; // Will type properly with user interface
}

export function AdminDashboard({ user }: AdminDashboardProps) {
    const [stats, setStats] = useState<AdminDashboardStats>({
        totalTenants: 0,
        activeTenants: 0,
        totalUsers: 0,
        tenantsByModule: {
            DAIRY: 0,
            POTTERY: 0,
            GARMENTS: 0
        },
        revenue: 0,
        growthRate: 0
    });

    // Simulating API call to get stats
    useEffect(() => {
        // This would be replaced with a real API call
        setTimeout(() => {
            setStats({
                totalTenants: 12,
                activeTenants: 8,
                totalUsers: 156,
                tenantsByModule: {
                    DAIRY: 5,
                    POTTERY: 4,
                    GARMENTS: 3
                },
                revenue: 24850,
                growthRate: 8.2
            });
        }, 500);
    }, []);

    return (
        <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Welcome Section */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name || 'System Administrator'}</h2>
                <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your platform today.</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Tenants"
                    value={stats.totalTenants}
                    icon={<Building />}
                    trend={{
                        value: <ArrowUpRight className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "+12.5% from last month"
                    }}
                    color="blue"
                />

                <StatCard
                    title="Active Users"
                    value={stats.totalUsers}
                    icon={<Users />}
                    trend={{
                        value: <ArrowUpRight className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "+5.2% from last month"
                    }}
                    color="purple"
                />

                <StatCard
                    title="Monthly Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    icon={<CreditCard />}
                    trend={{
                        value: <ArrowUpRight className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: `+${stats.growthRate}% from last month`
                    }}
                    color="amber"
                />

                <StatCard
                    title="Modules Active"
                    value="3"
                    icon={<Package />}
                    color="green"
                />
            </div>

            {/* Domain-specific panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TenantStatsPanel stats={stats} />
                <SystemStatsPanel />
            </div>
        </div>
    );
} 