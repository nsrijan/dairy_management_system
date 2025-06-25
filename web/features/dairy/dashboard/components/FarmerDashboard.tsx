'use client';

import React from 'react';
import { StatCard } from './StatCard';
import { ChartCard } from './ChartCard';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface FarmerDashboardProps {
    user: User;
    tenant?: string | null;
}

export function FarmerDashboard({ user, tenant }: FarmerDashboardProps) {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome, {user.name}
                </h2>
                <p className="text-gray-600">
                    {tenant ? `Managing your farm operations with ${tenant}` : 'Managing your farm operations'}
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Cattle"
                    value="45"
                    change="+2"
                    changeType="positive"
                    icon="🐄"
                />
                <StatCard
                    title="Today's Collection"
                    value="124L"
                    change="+8.5%"
                    changeType="positive"
                    icon="🥛"
                />
                <StatCard
                    title="Average Fat %"
                    value="4.2%"
                    change="+0.3%"
                    changeType="positive"
                    icon="🧪"
                />
                <StatCard
                    title="Monthly Earnings"
                    value="₹12,450"
                    change="+15.2%"
                    changeType="positive"
                    icon="💰"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Daily Milk Production"
                    description="Your milk production over the past 30 days"
                    type="line"
                />
                <ChartCard
                    title="Quality Metrics"
                    description="Fat content and SNF distribution"
                    type="bar"
                />
            </div>

            {/* Farm Management */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cattle Health */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cattle Health</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Healthy Cattle</span>
                            <span className="font-semibold text-green-600">42</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Under Treatment</span>
                            <span className="font-semibold text-orange-600">2</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Vaccinations Due</span>
                            <span className="font-semibold text-red-600">1</span>
                        </div>
                    </div>
                </div>

                {/* Feed Inventory */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Feed Inventory</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Dry Feed</span>
                            <span className="font-semibold">850 kg</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Green Fodder</span>
                            <span className="font-semibold">420 kg</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Concentrate</span>
                            <span className="font-semibold text-orange-600">Low</span>
                        </div>
                    </div>
                </div>

                {/* Recent Collections */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Collections</h3>
                    <div className="space-y-3">
                        {[
                            { date: 'Today', amount: '124L', fat: '4.2%', status: 'Accepted' },
                            { date: 'Yesterday', amount: '118L', fat: '4.1%', status: 'Accepted' },
                            { date: '2 days ago', amount: '122L', fat: '4.3%', status: 'Accepted' },
                        ].map((collection, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div>
                                    <span className="text-sm font-medium">{collection.date}</span>
                                    <p className="text-xs text-gray-500">{collection.amount} • {collection.fat}</p>
                                </div>
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                    {collection.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Vaccination Schedule</h4>
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Due</span>
                        </div>
                        <p className="text-sm text-gray-600">Cow #23 needs FMD vaccination</p>
                        <p className="text-xs text-gray-500 mt-1">Due: Tomorrow</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Feed Order</h4>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                        </div>
                        <p className="text-sm text-gray-600">Order concentrate feed - 200kg</p>
                        <p className="text-xs text-gray-500 mt-1">Low stock alert</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Vet Checkup</h4>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Scheduled</span>
                        </div>
                        <p className="text-sm text-gray-600">Monthly health checkup</p>
                        <p className="text-xs text-gray-500 mt-1">Next week</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 