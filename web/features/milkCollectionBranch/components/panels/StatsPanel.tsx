import { StatCard } from '../widgets/StatCard';
import { MCBData } from '../../types';
import { Droplets, TrendingUp, Users, Truck } from 'lucide-react';

interface StatsPanelProps {
    data: MCBData;
}

export function StatsPanel({ data }: StatsPanelProps) {
    const stats = [
        {
            title: "Today's Collection",
            value: `${data.todaysStats.totalCollection}L`,
            subtitle: `${data.todaysStats.farmersCount} farmers`,
            icon: <Droplets className="h-6 w-6" />,
            color: 'blue' as const,
            trend: {
                value: "+5.2% from yesterday",
                isPositive: true
            }
        },
        {
            title: "Average Quality",
            value: `Grade ${data.todaysStats.avgQuality}`,
            subtitle: `Fat: ${data.todaysStats.fatPercentage}% | SNF: ${data.todaysStats.snfPercentage}%`,
            icon: <TrendingUp className="h-6 w-6" />,
            color: 'green' as const,
            trend: {
                value: "+0.2% from last week",
                isPositive: true
            }
        },
        {
            title: "Active Farmers",
            value: data.todaysStats.farmersCount,
            subtitle: "Last collection: 8:30 AM",
            icon: <Users className="h-6 w-6" />,
            color: 'purple' as const
        },
        {
            title: "Chill Vats",
            value: data.chillVats.length,
            subtitle: `${data.chillVats.filter(v => v.isOperational).length} operational`,
            icon: <Truck className="h-6 w-6" />,
            color: 'indigo' as const
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    subtitle={stat.subtitle}
                    icon={stat.icon}
                    color={stat.color}
                    trend={stat.trend}
                />
            ))}
        </div>
    );
} 