'use client';

import { ReactNode } from 'react';

export interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: ReactNode | string;
        isPositive: boolean;
        text: string;
    };
    color?: 'blue' | 'green' | 'purple' | 'amber' | 'teal' | 'red';
}

export function StatCard({ title, value, icon, trend, color = 'blue' }: StatCardProps) {
    const colorClasses = {
        blue: {
            iconBg: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-blue-500 dark:text-blue-400',
            trendPositive: 'text-green-500',
            trendNegative: 'text-red-500',
            gradientFrom: 'from-blue-400',
            gradientTo: 'to-blue-500'
        },
        green: {
            iconBg: 'bg-green-50 dark:bg-green-900/20',
            iconColor: 'text-green-500 dark:text-green-400',
            trendPositive: 'text-green-500',
            trendNegative: 'text-red-500',
            gradientFrom: 'from-green-400',
            gradientTo: 'to-green-500'
        },
        purple: {
            iconBg: 'bg-purple-50 dark:bg-purple-900/20',
            iconColor: 'text-purple-500 dark:text-purple-400',
            trendPositive: 'text-green-500',
            trendNegative: 'text-red-500',
            gradientFrom: 'from-purple-400',
            gradientTo: 'to-purple-500'
        },
        amber: {
            iconBg: 'bg-amber-50 dark:bg-amber-900/20',
            iconColor: 'text-amber-500 dark:text-amber-400',
            trendPositive: 'text-green-500',
            trendNegative: 'text-red-500',
            gradientFrom: 'from-amber-400',
            gradientTo: 'to-amber-500'
        },
        teal: {
            iconBg: 'bg-teal-50 dark:bg-teal-900/20',
            iconColor: 'text-teal-500 dark:text-teal-400',
            trendPositive: 'text-green-500',
            trendNegative: 'text-red-500',
            gradientFrom: 'from-teal-400',
            gradientTo: 'to-teal-500'
        },
        red: {
            iconBg: 'bg-red-50 dark:bg-red-900/20',
            iconColor: 'text-red-500 dark:text-red-400',
            trendPositive: 'text-green-500',
            trendNegative: 'text-red-500',
            gradientFrom: 'from-red-400',
            gradientTo: 'to-red-500'
        },
    };

    const classes = colorClasses[color];

    return (
        <div className="overflow-hidden border-none shadow-md rounded-lg bg-white dark:bg-gray-800 relative">
            <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${classes.gradientFrom} ${classes.gradientTo} rounded-bl-full opacity-20`}></div>
            <div className="p-4">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                    {icon && (
                        <div className={`p-2 rounded-md ${classes.iconBg}`}>
                            <div className={`h-5 w-5 ${classes.iconColor}`}>{icon}</div>
                        </div>
                    )}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
                {trend && (
                    <div className={`flex items-center text-xs mt-1 ${trend.isPositive ? classes.trendPositive : classes.trendNegative}`}>
                        {trend.value}
                        <span>{trend.text}</span>
                    </div>
                )}
            </div>
        </div>
    );
} 