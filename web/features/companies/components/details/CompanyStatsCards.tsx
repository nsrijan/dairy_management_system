'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Users,
    Building2,
    MapPin,
    Store,
    Droplets,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { StatsCardProps } from '../../types';

interface CompanyStatsCardsProps {
    companyId: string;
}

// Mock data - replace with actual API calls
const mockStats = {
    totalMCBs: 8,
    totalChillVats: 24,
    totalFactories: 3,
    totalShops: 12,
    totalUsers: 45,
    trends: {
        mcbs: { value: 2, isPositive: true },
        factories: { value: 1, isPositive: true },
        shops: { value: 3, isPositive: true },
        users: { value: 8, isPositive: true },
        chillVats: { value: 4, isPositive: true }
    }
};

function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
    const colorClasses = {
        blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
        green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
        purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
        orange: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20',
        teal: 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20',
        red: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
    };

    return (
        <Card className={`${colorClasses[color]} border transition-all duration-200 hover:shadow-lg hover:scale-105`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex-shrink-0">
                                {icon}
                            </div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {title}
                            </p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {value}
                        </p>
                        {trend && (
                            <div className="flex items-center gap-1 mt-2">
                                {trend.isPositive ? (
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                )}
                                <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    +{trend.value} this month
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function StatsCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
            </CardContent>
        </Card>
    );
}

export function CompanyStatsCards({ companyId }: CompanyStatsCardsProps) {
    // This would be replaced with actual API calls
    const isLoading = false;
    const error = null;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <StatsCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <CardContent className="p-6">
                    <p className="text-red-600 dark:text-red-400">Failed to load statistics</p>
                </CardContent>
            </Card>
        );
    }

    const stats = [
        {
            title: 'Milk Collection Branches',
            value: mockStats.totalMCBs,
            icon: <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            color: 'blue' as const,
            trend: mockStats.trends.mcbs
        },
        {
            title: 'Chill Vats',
            value: mockStats.totalChillVats,
            icon: <Droplets className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
            color: 'teal' as const,
            trend: mockStats.trends.chillVats
        },
        {
            title: 'Factories',
            value: mockStats.totalFactories,
            icon: <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
            color: 'purple' as const,
            trend: mockStats.trends.factories
        },
        {
            title: 'Shops & Outlets',
            value: mockStats.totalShops,
            icon: <Store className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
            color: 'orange' as const,
            trend: mockStats.trends.shops
        },
        {
            title: 'Total Users',
            value: mockStats.totalUsers,
            icon: <Users className="h-5 w-5 text-green-600 dark:text-green-400" />,
            color: 'green' as const,
            trend: mockStats.trends.users
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Company Statistics
                </h2>
                <Badge variant="outline" className="text-xs">
                    Real-time data
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        trend={stat.trend}
                    />
                ))}
            </div>
        </div>
    );
} 