'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SystemStatsPanel() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>System Activity</CardTitle>
                <CardDescription>Recent system events</CardDescription>
                <CardAction>
                    <Button variant="outline" size="sm" className="text-xs">View All</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="divide-y">
                        {[
                            { title: "New user registered", time: "2 hours ago", color: "bg-blue-50 dark:bg-blue-900/20", icon: "👤" },
                            { title: "New tenant created", time: "Yesterday at 3:45 PM", color: "bg-green-50 dark:bg-green-900/20", icon: "🏢" },
                            { title: "Module settings updated", time: "2 days ago", color: "bg-purple-50 dark:bg-purple-900/20", icon: "⚙️" },
                            { title: "Billing cycle completed", time: "3 days ago", color: "bg-amber-50 dark:bg-amber-900/20", icon: "💰" },
                            { title: "System backup completed", time: "4 days ago", color: "bg-teal-50 dark:bg-teal-900/20", icon: "💾" },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 py-3">
                                <div className={`p-2 rounded-full ${activity.color} text-center w-8 h-8 flex items-center justify-center`}>
                                    {activity.icon}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800 dark:text-gray-200">{activity.title}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* System metrics */}
                    <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">System Performance</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
                                <div className="text-xs text-gray-500 dark:text-gray-400">API Response Time</div>
                                <div className="text-lg font-semibold text-green-600 dark:text-green-400">85ms</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Uptime</div>
                                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">99.9%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 