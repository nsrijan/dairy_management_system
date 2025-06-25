import React from 'react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: string | React.ReactElement;
    trend?: {
        value: React.ReactElement;
        isPositive: boolean;
        text: string;
    };
    color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray';
}

export function StatCard({
    title,
    value,
    change,
    changeType = 'neutral',
    icon,
    trend,
    color = 'blue'
}: StatCardProps) {
    const getChangeColor = () => {
        switch (changeType) {
            case 'positive':
                return 'text-green-600';
            case 'negative':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getColorClasses = () => {
        const colorMap = {
            blue: 'text-blue-600 bg-blue-50 border-blue-100',
            green: 'text-green-600 bg-green-50 border-green-100',
            purple: 'text-purple-600 bg-purple-50 border-purple-100',
            yellow: 'text-yellow-600 bg-yellow-50 border-yellow-100',
            red: 'text-red-600 bg-red-50 border-red-100',
            gray: 'text-gray-600 bg-gray-50 border-gray-100',
        };
        return colorMap[color];
    };

    return (
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>

                    {/* Legacy change prop support */}
                    {change && (
                        <p className={`text-sm mt-1 ${getChangeColor()}`}>
                            {change} from last period
                        </p>
                    )}

                    {/* New trend prop support */}
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.value}
                            <span>{trend.text}</span>
                        </div>
                    )}
                </div>

                {icon && (
                    <div className={`p-3 rounded-lg ${getColorClasses()}`}>
                        {typeof icon === 'string' ? (
                            <div className="text-2xl">{icon}</div>
                        ) : (
                            <div className="text-2xl">{icon}</div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
} 