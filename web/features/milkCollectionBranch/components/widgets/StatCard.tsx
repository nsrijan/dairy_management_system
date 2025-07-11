import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'indigo' | 'orange' | 'red';
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

export function StatCard({
    title,
    value,
    subtitle,
    icon,
    color,
    trend
}: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                        {subtitle && (
                            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                        )}
                        {trend && (
                            <div className={cn(
                                "text-xs mt-2 flex items-center gap-1",
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            )}>
                                <span>{trend.isPositive ? '↗' : '↘'}</span>
                                <span>{trend.value}</span>
                            </div>
                        )}
                    </div>
                    <div className={cn(
                        "h-12 w-12 rounded-lg flex items-center justify-center",
                        colorClasses[color]
                    )}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 