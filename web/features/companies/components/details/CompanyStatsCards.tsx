'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Building,
    MapPin,
    Factory,
    Store,
    Users,
    Droplets,
    TrendingUp,
    TrendingDown,
    DollarSign
} from 'lucide-react';
import { StatsCardProps } from '../../types';

interface CompanyStatsCardsProps {
    companyId: string;
}

export function CompanyStatsCards({ companyId }: CompanyStatsCardsProps) {
    // Mock data - replace with actual API calls
    const mockStats = {
        totalMilkCollectionBranches: 8,
        totalFarmers: 245,
        totalMilkCollection: 12450,
        totalRevenue: 892340,
        totalChillVats: 24,
        totalFactories: 3,
        totalShops: 12,
        totalUsers: 45,
        trends: {
            milkCollectionBranches: { value: 2, isPositive: true },
            farmers: { value: 12, isPositive: true },
            milkCollection: { value: 8.5, isPositive: true },
            revenue: { value: 15.3, isPositive: true },
            chillVats: { value: 4, isPositive: true },
            factories: { value: 1, isPositive: true },
            shops: { value: 3, isPositive: true },
            users: { value: 8, isPositive: true }
        }
    };

    const statsCards: StatsCardProps[] = [
        {
            title: 'Milk Collection Branches',
            value: mockStats.totalMilkCollectionBranches,
            icon: <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            color: 'blue' as const,
            trend: mockStats.trends.milkCollectionBranches
        },
        {
            title: 'Total Farmers',
            value: mockStats.totalFarmers,
            icon: <Users className="h-5 w-5 text-green-600 dark:text-green-400" />,
            color: 'green' as const,
            trend: mockStats.trends.farmers
        },
        {
            title: 'Daily Milk Collection',
            value: `${mockStats.totalMilkCollection} L`,
            icon: <Droplets className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
            color: 'purple' as const,
            trend: mockStats.trends.milkCollection
        },
        {
            title: 'Total Revenue',
            value: `₹${mockStats.totalRevenue.toLocaleString()}`,
            icon: <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
            color: 'orange' as const,
            trend: mockStats.trends.revenue
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
            icon: <Factory className="h-5 w-5 text-red-600 dark:text-red-400" />,
            color: 'red' as const,
            trend: mockStats.trends.factories
        },
        {
            title: 'Retail Shops',
            value: mockStats.totalShops,
            icon: <Store className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
            color: 'purple' as const,
            trend: mockStats.trends.shops
        },
        {
            title: 'Total Users',
            value: mockStats.totalUsers,
            icon: <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
            color: 'orange' as const,
            trend: mockStats.trends.users
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((card, index) => (
                <StatsCard key={index} {...card} />
            ))}
        </div>
    );
}

function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
    const cardColors = {
        blue: 'border-blue-200 dark:border-blue-800',
        green: 'border-green-200 dark:border-green-800',
        purple: 'border-purple-200 dark:border-purple-800',
        orange: 'border-orange-200 dark:border-orange-800',
        teal: 'border-teal-200 dark:border-teal-800',
        red: 'border-red-200 dark:border-red-800'
    };

    const trendColors = {
        positive: 'text-green-600 dark:text-green-400',
        negative: 'text-red-600 dark:text-red-400'
    };

    return (
        <Card className={`${cardColors[color]} transition-all duration-200 hover:shadow-md`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className={`flex items-center ${trend?.isPositive ? trendColors.positive : trendColors.negative}`}>
                        {trend?.isPositive ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {trend?.value}%
                    </div>
                    <span>from last month</span>
                </div>
            </CardContent>
        </Card>
    );
} 