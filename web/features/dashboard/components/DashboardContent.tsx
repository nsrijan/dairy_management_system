'use client';

import {
    ActivitySquare,
    ArrowDown,
    ArrowUp,
    CircleDollarSign,
    DropletIcon,
    TrendingUp,
    Users,
    BarChart3,
    Thermometer,
    Utensils,
    Package
} from 'lucide-react';
import { StatCard } from './StatCard';
import { ChartCard } from './ChartCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface DashboardContentProps {
    userName: string;
}

export function DashboardContent({ userName }: DashboardContentProps) {
    // Demo data for activity feed
    const recentActivities = [
        { id: 1, type: 'collection', title: 'Morning Collection Complete', time: '07:30 AM', quantity: '2,340 L', branch: 'Main Center' },
        { id: 2, type: 'quality', title: 'Quality Check Passed', time: '09:15 AM', details: 'Fat: 3.8%, SNF: 8.6%', collection: 'Morning Batch' },
        { id: 3, type: 'production', title: 'Production Started', time: '10:30 AM', product: 'Pasteurized Milk', quantity: '1,200 L' },
        { id: 4, type: 'alert', title: 'Low Stock Alert', time: '11:45 AM', item: 'Packaging Material', action: 'Order Placed' },
    ];

    // Weather data for farmer insights
    const weatherData = {
        temperature: 24,
        humidity: 68,
        conditions: 'Partly Cloudy',
        forecast: [
            { day: 'Today', temp: 24, icon: '🌤️' },
            { day: 'Tue', temp: 26, icon: '☀️' },
            { day: 'Wed', temp: 23, icon: '🌦️' },
            { day: 'Thu', temp: 22, icon: '🌧️' },
            { day: 'Fri', temp: 25, icon: '🌤️' },
        ]
    };

    // Recent milk collections data
    const recentMilkCollections = [
        { id: 1, date: '4/28/2023', branch: 'North County Collection', farmer: 'Green Pastures Co-op', quantity: '520 L', amount: '₹18,200' },
        { id: 2, date: '4/28/2023', branch: 'South Branch', farmer: 'Highland Dairy Farm', quantity: '320 L', amount: '₹11,200' },
        { id: 3, date: '4/28/2023', branch: 'East Valley Center', farmer: 'Meadow View Farms', quantity: '430 L', amount: '₹15,050' },
        { id: 4, date: '4/27/2023', branch: 'West County Pickup', farmer: 'Sunrise Dairy Co-op', quantity: '580 L', amount: '₹20,300' },
        { id: 5, date: '4/27/2023', branch: 'North County Collection', farmer: 'Green Valley Farms', quantity: '390 L', amount: '₹13,650' },
    ];

    // Recent curd production data
    const recentCurdProduction = [
        { id: 1, batch: 'CP-2304-12', date: '4/28/2023', milkUsed: '860 L', curdProduced: '720 kg', quality: 'A' },
        { id: 2, batch: 'CP-2304-11', date: '4/27/2023', milkUsed: '740 L', curdProduced: '610 kg', quality: 'A+' },
        { id: 3, batch: 'CP-2304-10', date: '4/26/2023', milkUsed: '800 L', curdProduced: '665 kg', quality: 'A' },
        { id: 4, batch: 'CP-2304-09', date: '4/25/2023', milkUsed: '750 L', curdProduced: '620 kg', quality: 'B+' },
    ];

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
            {/* Dashboard Header with Weather */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dairy Management Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {userName || 'User'}!</p>
                </div>

                {/* Weather Widget for Farmer Insights */}
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-none shadow-sm p-3 flex items-center gap-3">
                    <div className="text-3xl">{weatherData.conditions === 'Partly Cloudy' ? '🌤️' : '☀️'}</div>
                    <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                            <Thermometer className="h-4 w-4 mr-1" />
                            {weatherData.temperature}°C
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Humidity: {weatherData.humidity}%</div>
                    </div>
                    <div className="hidden md:flex gap-2 ml-2">
                        {weatherData.forecast.map(day => (
                            <div key={day.day} className="text-center px-1">
                                <div className="text-xs text-gray-500 dark:text-gray-400">{day.day}</div>
                                <div className="text-sm">{day.icon}</div>
                                <div className="text-xs font-medium">{day.temp}°</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Collection Today"
                    value="5,240 L"
                    icon={<DropletIcon />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "12% compared to yesterday"
                    }}
                    color="blue"
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
                    color="green"
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
                    color="purple"
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
                    color="amber"
                />

                <StatCard
                    title="Curd Production"
                    value="2,615 kg"
                    icon={<Utensils />}
                    trend={{
                        value: <ArrowUp className="h-3 w-3 mr-1" />,
                        isPositive: true,
                        text: "5% compared to last week"
                    }}
                    color="teal"
                />

                <StatCard
                    title="Raw Materials Value"
                    value="₹7,85,000"
                    icon={<Package />}
                    trend={{
                        value: <ArrowDown className="h-3 w-3 mr-1" />,
                        isPositive: false,
                        text: "2% compared to last month"
                    }}
                    color="blue"
                />
            </div>

            {/* Collection and Production Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Milk Collections */}
                <Card className="shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 flex items-center justify-between">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Recent Milk Collections</h3>
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-700">Today</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                                    <th className="text-left whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Date</th>
                                    <th className="text-left whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Branch</th>
                                    <th className="text-left whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Farmer</th>
                                    <th className="text-right whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                                    <th className="text-right whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {recentMilkCollections.map(collection => (
                                    <tr key={collection.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/80">
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{collection.date}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{collection.branch}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{collection.farmer}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">{collection.quantity}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right font-medium text-gray-700 dark:text-gray-300">{collection.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800">
                        <Button variant="ghost" size="sm" className="w-full text-gray-600 dark:text-gray-300 text-xs">
                            View All Collections
                        </Button>
                    </div>
                </Card>

                {/* Recent Curd Production */}
                <Card className="shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 flex items-center justify-between">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Recent Curd Production</h3>
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-700">This Week</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                                    <th className="text-left whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Batch #</th>
                                    <th className="text-left whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Date</th>
                                    <th className="text-right whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Milk Used</th>
                                    <th className="text-right whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Curd Produced</th>
                                    <th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Quality</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {recentCurdProduction.map(production => (
                                    <tr key={production.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/80">
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300 font-medium">{production.batch}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{production.date}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">{production.milkUsed}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">{production.curdProduced}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium
                                                ${production.quality === 'A+' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    production.quality === 'A' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                {production.quality}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800">
                        <Button variant="ghost" size="sm" className="w-full text-gray-600 dark:text-gray-300 text-xs">
                            View All Production Batches
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Middle Section - Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Milk Collection Trend */}
                <div className="lg:col-span-2">
                    <ChartCard
                        title="Milk Collection Trends"
                        description="Weekly milk collection volume across all centers"
                        headerActions={<Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">This Week</Badge>}
                    >
                        <div className="p-6">
                            <div className="h-[240px] w-full flex flex-col justify-end">
                                <div className="w-full h-[200px] flex items-end justify-between gap-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                                        const height = [70, 85, 65, 80, 90, 75, 60][i];
                                        return (
                                            <div key={day} className="flex flex-col items-center gap-1 flex-1">
                                                <div
                                                    className={`w-full rounded-t-md ${['bg-blue-500', 'bg-blue-600', 'bg-blue-400', 'bg-blue-500', 'bg-blue-700', 'bg-blue-500', 'bg-blue-300'][i]} dark:opacity-80`}
                                                    style={{ height: `${height}%` }}
                                                ></div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{day}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </ChartCard>
                </div>

                {/* Recent Activity Feed */}
                <div>
                    <Card className="h-full shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 flex items-center justify-between">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Recent Activity</h3>
                            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-700">Today</Badge>
                        </div>
                        <div className="flex-1 overflow-auto px-4 divide-y divide-gray-100 dark:divide-gray-800">
                            {recentActivities.map(activity => (
                                <div key={activity.id} className="py-3">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 p-1.5 rounded-full ${activity.type === 'collection' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' :
                                            activity.type === 'quality' ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' :
                                                activity.type === 'production' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400' :
                                                    'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                                            }`}>
                                            {activity.type === 'collection' ? <DropletIcon className="h-4 w-4" /> :
                                                activity.type === 'quality' ? <BarChart3 className="h-4 w-4" /> :
                                                    activity.type === 'production' ? <ActivitySquare className="h-4 w-4" /> :
                                                        <CircleDollarSign className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{activity.title}</p>
                                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                                {activity.branch && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Branch: {activity.branch}
                                                    </span>
                                                )}
                                                {activity.quantity && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Quantity: {activity.quantity}
                                                    </span>
                                                )}
                                                {activity.details && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {activity.details}
                                                    </span>
                                                )}
                                                {activity.product && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Product: {activity.product}
                                                    </span>
                                                )}
                                                {activity.item && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Item: {activity.item}
                                                    </span>
                                                )}
                                                {activity.action && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Action: {activity.action}
                                                    </span>
                                                )}
                                                {activity.collection && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Collection: {activity.collection}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800">
                            <Button variant="ghost" size="sm" className="w-full text-gray-600 dark:text-gray-300 text-xs">
                                View All Activities
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bottom Row - Milk Quality Metrics and Production Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quality Metrics */}
                <ChartCard
                    title="Milk Quality Metrics"
                    description="Average quality parameters of collected milk"
                >
                    <div className="flex flex-col md:flex-row justify-between gap-4 p-6">
                        <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-4 text-center">
                            <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Fat Content</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3.8%</div>
                            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '76%' }}></div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: 4-5%</div>
                        </div>

                        <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-4 text-center">
                            <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">SNF</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">8.6%</div>
                            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: '82%' }}></div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: 8.5-9%</div>
                        </div>

                        <div className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-4 text-center">
                            <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Protein</div>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3.2%</div>
                            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: 3.5%</div>
                        </div>
                    </div>
                </ChartCard>

                {/* Product Distribution */}
                <ChartCard
                    title="Production Distribution"
                    description="Product type breakdown for current month"
                >
                    <div className="flex items-center justify-between gap-8 p-6">
                        {/* Simple Donut Chart Representation */}
                        <div className="relative w-[160px] h-[160px]">
                            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />

                                {/* Pasteurized Milk - 45% */}
                                <circle
                                    cx="18" cy="18" r="15.915" fill="none"
                                    stroke="#3b82f6" strokeWidth="3.5" strokeDasharray="45, 100"
                                    strokeDashoffset="25"
                                    className="drop-shadow-sm"
                                />

                                {/* Cheese - 25% */}
                                <circle
                                    cx="18" cy="18" r="15.915" fill="none"
                                    stroke="#10b981" strokeWidth="3.5" strokeDasharray="25, 100"
                                    strokeDashoffset="80"
                                    className="drop-shadow-sm"
                                />

                                {/* Butter - 15% */}
                                <circle
                                    cx="18" cy="18" r="15.915" fill="none"
                                    stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="15, 100"
                                    strokeDashoffset="55"
                                    className="drop-shadow-sm"
                                />

                                {/* Yogurt - 15% */}
                                <circle
                                    cx="18" cy="18" r="15.915" fill="none"
                                    stroke="#8b5cf6" strokeWidth="3.5" strokeDasharray="15, 100"
                                    strokeDashoffset="40"
                                    className="drop-shadow-sm"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
                                <span className="text-lg font-bold text-gray-800 dark:text-white">12,540 L</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Pasteurized Milk</span>
                                <span className="ml-auto text-sm font-medium text-gray-800 dark:text-gray-200">45%</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Cheese</span>
                                <span className="ml-auto text-sm font-medium text-gray-800 dark:text-gray-200">25%</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Butter</span>
                                <span className="ml-auto text-sm font-medium text-gray-800 dark:text-gray-200">15%</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Yogurt</span>
                                <span className="ml-auto text-sm font-medium text-gray-800 dark:text-gray-200">15%</span>
                            </div>
                        </div>
                    </div>
                </ChartCard>
            </div>
        </div>
    );
} 