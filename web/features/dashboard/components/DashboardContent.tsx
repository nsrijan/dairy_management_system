'use client';

import {
    ActivitySquare,
    ArrowDown,
    ArrowUp,
    CircleDollarSign,
    DropletIcon,
    TrendingUp,
    Users
} from 'lucide-react';
import { StatCard } from './StatCard';
import { ChartCard } from './ChartCard';

export interface DashboardContentProps {
    userName: string;
}

export function DashboardContent({ userName }: DashboardContentProps) {
    return (
        <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {userName || 'User'}!</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Collection Today"
                    value="5,240 L"
                    icon={<DropletIcon />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "12% compared to yesterday"
                    }}
                />

                <StatCard
                    title="Active Farmers"
                    value="412"
                    icon={<Users />}
                    trend={{
                        value: <ArrowDown className="h-3 w-3 mr-1" />,
                        isPositive: false,
                        text: "3% compared to last week"
                    }}
                />

                <StatCard
                    title="Production Output"
                    value="15,280 kg"
                    icon={<ActivitySquare />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "8% compared to last week"
                    }}
                />

                <StatCard
                    title="Revenue (Monthly)"
                    value="₹24,95,000"
                    icon={<CircleDollarSign />}
                    trend={{
                        value: <TrendingUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "15% compared to last month"
                    }}
                />
            </div>

            {/* Additional dashboard content... */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Recent Collections"
                    description="Latest milk collections across branches"
                >
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Loading recent collections...
                    </div>
                </ChartCard>

                <ChartCard
                    title="Collection Trends"
                    description="Weekly milk collection trends"
                />
            </div>
        </div>
    );
} 