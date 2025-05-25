'use client';

import { ChartCard } from '../../../../../dashboard/widgets';
import { Badge } from '@/components/ui/badge';
import { SupplyPurchase } from '../../../types';
import { format, parseISO } from 'date-fns';

interface SupplyPurchasesPanelProps {
    supplyPurchases: SupplyPurchase[];
}

export function SupplyPurchasesPanel({ supplyPurchases }: SupplyPurchasesPanelProps) {
    // Calculate totals by category
    const categoryTotals = supplyPurchases.reduce((acc, purchase) => {
        if (!acc[purchase.category]) {
            acc[purchase.category] = 0;
        }
        acc[purchase.category] += purchase.totalCost;
        return acc;
    }, {} as Record<string, number>);

    // Get category colors
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'FEED':
                return {
                    bg: 'bg-amber-100 dark:bg-amber-900/30',
                    text: 'text-amber-800 dark:text-amber-300',
                    icon: '🌾'
                };
            case 'MEDICINE':
                return {
                    bg: 'bg-red-100 dark:bg-red-900/30',
                    text: 'text-red-800 dark:text-red-300',
                    icon: '💊'
                };
            case 'EQUIPMENT':
                return {
                    bg: 'bg-blue-100 dark:bg-blue-900/30',
                    text: 'text-blue-800 dark:text-blue-300',
                    icon: '🔧'
                };
            default:
                return {
                    bg: 'bg-gray-100 dark:bg-gray-800',
                    text: 'text-gray-800 dark:text-gray-300',
                    icon: '📦'
                };
        }
    };

    return (
        <ChartCard
            title="Supply Purchases"
            subtitle="Items purchased from the dairy company"
        >
            {/* Category summary */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.entries(categoryTotals).map(([category, total]) => {
                    const { bg, text, icon } = getCategoryColor(category);
                    return (
                        <div key={category} className={`${bg} p-3 rounded-md`}>
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">{icon}</span>
                                <span className={`text-sm font-medium ${text}`}>
                                    {category.charAt(0) + category.slice(1).toLowerCase()}
                                </span>
                            </div>
                            <div className="mt-1 text-lg font-bold text-gray-800 dark:text-gray-200">₹{total}</div>
                        </div>
                    );
                })}
            </div>

            {/* Recent purchases */}
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Purchases</h3>
            <div className="space-y-3">
                {supplyPurchases.map(purchase => {
                    const { bg, text, icon } = getCategoryColor(purchase.category);
                    return (
                        <div
                            key={purchase.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md"
                        >
                            <div className="flex items-center">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${bg}`}>
                                    {icon}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800 dark:text-gray-200">{purchase.itemName}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {format(parseISO(purchase.date), 'MMM dd, yyyy')} • {purchase.quantity} units
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="text-right">
                                    <div className="font-medium text-gray-800 dark:text-gray-200">₹{purchase.totalCost}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">₹{purchase.unitPrice}/unit</div>
                                </div>
                                <Badge
                                    className={`${bg} ${text} border-0`}
                                >
                                    {purchase.isPaid ? 'Paid' : 'Unpaid'}
                                </Badge>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ChartCard>
    );
} 