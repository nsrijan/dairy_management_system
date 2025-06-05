import { Building, Users, Box, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Module } from '../../types';

interface ModuleStatsProps {
    module: Module;
}

export function ModuleStats({ module }: ModuleStatsProps) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-8">
            <StatCard
                icon={<Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                title="Active Tenants"
                value="12"
                color="blue"
            />
            <StatCard
                icon={<Users className="h-6 w-6 text-green-600 dark:text-green-400" />}
                title="Total Users"
                value="48"
                color="green"
            />
            <StatCard
                icon={<Box className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
                title="Features"
                value={module.features?.length.toString() || "0"}
                color="purple"
            />
            <StatCard
                icon={<Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
                title="Last Updated"
                value="2d"
                color="orange"
            />
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ icon, title, value, color }: StatCardProps) {
    const colorClasses = {
        blue: 'from-blue-50 to-white dark:from-blue-950/20 border-blue-100/50 dark:border-blue-900/50',
        green: 'from-green-50 to-white dark:from-green-950/20 border-green-100/50 dark:border-green-900/50',
        purple: 'from-purple-50 to-white dark:from-purple-950/20 border-purple-100/50 dark:border-purple-900/50',
        orange: 'from-orange-50 to-white dark:from-orange-950/20 border-orange-100/50 dark:border-orange-900/50'
    };

    const iconBgClasses = {
        blue: 'bg-blue-500/10',
        green: 'bg-green-500/10',
        purple: 'bg-purple-500/10',
        orange: 'bg-orange-500/10'
    };

    const textClasses = {
        blue: 'text-blue-600/80 dark:text-blue-400/80',
        green: 'text-green-600/80 dark:text-green-400/80',
        purple: 'text-purple-600/80 dark:text-purple-400/80',
        orange: 'text-orange-600/80 dark:text-orange-400/80'
    };

    const valueClasses = {
        blue: 'text-blue-700 dark:text-blue-300',
        green: 'text-green-700 dark:text-green-300',
        purple: 'text-purple-700 dark:text-purple-300',
        orange: 'text-orange-700 dark:text-orange-300'
    };

    return (
        <Card className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]}`}>
            <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg ${iconBgClasses[color]} flex items-center justify-center`}>
                        {icon}
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${textClasses[color]}`}>{title}</p>
                        <p className={`text-2xl font-bold ${valueClasses[color]}`}>{value}</p>
                    </div>
                </div>
                <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-${color}-500/5`} />
            </CardContent>
        </Card>
    );
} 