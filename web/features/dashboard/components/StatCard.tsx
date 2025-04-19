import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

export interface StatCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    trend?: {
        value: ReactNode;
        isPositive: boolean;
        text: string;
    };
    color?: 'blue' | 'green' | 'purple' | 'amber' | 'teal';
}

export function StatCard({ title, value, icon, trend, color = 'teal' }: StatCardProps) {
    const colorStyles = {
        blue: {
            iconClass: "text-blue-600 dark:text-blue-400",
            bgClass: "bg-blue-50 dark:bg-blue-900/20",
            positiveClass: "text-blue-600 dark:text-blue-400",
            negativeClass: "text-red-600 dark:text-red-400"
        },
        green: {
            iconClass: "text-green-600 dark:text-green-400",
            bgClass: "bg-green-50 dark:bg-green-900/20",
            positiveClass: "text-green-600 dark:text-green-400",
            negativeClass: "text-red-600 dark:text-red-400"
        },
        purple: {
            iconClass: "text-purple-600 dark:text-purple-400",
            bgClass: "bg-purple-50 dark:bg-purple-900/20",
            positiveClass: "text-purple-600 dark:text-purple-400",
            negativeClass: "text-red-600 dark:text-red-400"
        },
        amber: {
            iconClass: "text-amber-600 dark:text-amber-400",
            bgClass: "bg-amber-50 dark:bg-amber-900/20",
            positiveClass: "text-amber-600 dark:text-amber-400",
            negativeClass: "text-red-600 dark:text-red-400"
        },
        teal: {
            iconClass: "text-teal-600 dark:text-teal-400",
            bgClass: "bg-teal-50 dark:bg-teal-900/20",
            positiveClass: "text-teal-600 dark:text-teal-400",
            negativeClass: "text-red-600 dark:text-red-400"
        }
    };

    const styles = colorStyles[color];

    return (
        <Card className="shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
                <div className={`h-8 w-8 rounded-full ${styles.bgClass} flex items-center justify-center ${styles.iconClass}`}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                {trend && (
                    <div className={`flex items-center pt-1 text-xs ${trend.isPositive ? styles.positiveClass : styles.negativeClass}`}>
                        {trend.value}
                        <span>{trend.text}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 