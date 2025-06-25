import React from 'react';
import { StatCard } from './StatCard';
import { ChartCard } from './ChartCard';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface ProductionManagerDashboardProps {
    user: User;
    tenant?: string | null;
}

export function ProductionManagerDashboard({ user, tenant }: ProductionManagerDashboardProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome, {user.name}
                </h2>
                <p className="text-gray-600">
                    {tenant ? `Managing ${tenant} production operations` : 'Managing production operations'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Daily Production"
                    value="2,847L"
                    change="+5.3%"
                    changeType="positive"
                    icon="🏭"
                />
                <StatCard
                    title="Quality Grade A"
                    value="92%"
                    change="+2.1%"
                    changeType="positive"
                    icon="⭐"
                />
                <StatCard
                    title="Active Batches"
                    value="12"
                    change="+1"
                    changeType="positive"
                    icon="📦"
                />
                <StatCard
                    title="Efficiency Rate"
                    value="94.5%"
                    change="+1.2%"
                    changeType="positive"
                    icon="📊"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Production Metrics"
                    description="Daily production and quality trends"
                    type="line"
                />
                <ChartCard
                    title="Quality Distribution"
                    description="Quality grades across batches"
                    type="pie"
                />
            </div>
        </div>
    );
}
