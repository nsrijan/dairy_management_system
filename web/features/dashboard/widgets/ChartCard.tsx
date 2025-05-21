'use client';

import { ReactNode } from 'react';

export interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    action?: ReactNode;
    className?: string;
}

export function ChartCard({ title, subtitle, children, action, className = '' }: ChartCardProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
} 