'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '../../../../dashboard/components/StatCard';
import { MilkProductionPanel } from './panels/MilkProductionPanel';
import { FinancialSummaryPanel } from './panels/FinancialSummaryPanel';
import { SupplyPurchasesPanel } from './panels/SupplyPurchasesPanel';
import { FarmerDashboardData } from '../../types';
import { getMockFarmerData } from '../../mockData';
import { Droplet, CircleDollarSign, ShoppingCart, ArrowUpRight, ArrowDown } from 'lucide-react';

export interface DairyFarmerDashboardProps {
    user: any; // Will type properly with user interface
}

export function DairyFarmerDashboard({ user }: DairyFarmerDashboardProps) {
    const [dashboardData, setDashboardData] = useState<FarmerDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch dashboard data - would be replaced with a real API call
    useEffect(() => {
        setIsLoading(true);
        // Simulate API call with delay
        setTimeout(() => {
            const data = getMockFarmerData(user?.id || 'farmer-123');
            setDashboardData(data);
            setIsLoading(false);
        }, 500);
    }, [user?.id]);

    if (isLoading || !dashboardData) {
        return <div className="flex justify-center p-8">Loading farmer dashboard...</div>;
    }

    // Calculate some metrics for the dashboard
    const totalMilkThisWeek = dashboardData.milkRecords.reduce((sum, record) => sum + record.quantity, 0);
    const avgFatContent = dashboardData.milkRecords.reduce((sum, record) => sum + record.fatPercentage, 0) /
        dashboardData.milkRecords.length;

    return (
        <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Welcome Section */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome, {dashboardData.farmer.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {dashboardData.farmer.farmName} • {dashboardData.farmer.location}
                </p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Milk This Week"
                    value={`${totalMilkThisWeek} L`}
                    icon={<Droplet className="h-5 w-5" />}
                    trend={{
                        value: <ArrowUpRight className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "+5.2% from last week"
                    }}
                    color="blue"
                />

                <StatCard
                    title="Average Fat %"
                    value={avgFatContent.toFixed(1) + '%'}
                    icon={<Droplet className="h-5 w-5" />}
                    trend={{
                        value: <ArrowUpRight className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "+0.2% from last week"
                    }}
                    color="green"
                />

                <StatCard
                    title="Current Balance"
                    value={`₹${dashboardData.financialSummary.currentBalance}`}
                    icon={<CircleDollarSign className="h-5 w-5" />}
                    trend={{
                        value: <ArrowUpRight className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: `+₹${dashboardData.transactions[0].amount} today`
                    }}
                    color="purple"
                />

                <StatCard
                    title="Purchases"
                    value={`₹${dashboardData.financialSummary.totalPurchases}`}
                    icon={<ShoppingCart className="h-5 w-5" />}
                    trend={{
                        value: <ArrowDown className="h-3 w-3 mr-1" />,
                        isPositive: false,
                        text: "-12% from last month"
                    }}
                    color="yellow"
                />
            </div>

            {/* Detailed Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <MilkProductionPanel milkRecords={dashboardData.milkRecords} />
                <FinancialSummaryPanel
                    financialSummary={dashboardData.financialSummary}
                    transactions={dashboardData.transactions}
                />
            </div>

            <div className="mb-6">
                <SupplyPurchasesPanel supplyPurchases={dashboardData.supplyPurchases} />
            </div>
        </div>
    );
} 