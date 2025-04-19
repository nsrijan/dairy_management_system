import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
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
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
                <div className="h-4 w-4 text-teal-600 dark:text-teal-500">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                {trend && (
                    <div className={`flex items-center pt-1 text-xs ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {trend.value}
                        <span>{trend.text}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 