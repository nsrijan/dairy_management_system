'use client';

import { ChartCard } from '../../../../../dashboard/widgets';
import { Badge } from '@/components/ui/badge';
import { FinancialSummary, Transaction } from '../../../types';
import { CreditCard, TrendingUp, ShoppingCart, Wallet } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface FinancialSummaryPanelProps {
    financialSummary: FinancialSummary;
    transactions: Transaction[];
}

export function FinancialSummaryPanel({ financialSummary, transactions }: FinancialSummaryPanelProps) {
    // Show only the last 5 transactions
    const recentTransactions = transactions.slice(0, 5);

    return (
        <ChartCard
            title="Financial Summary"
            subtitle="Account balance and recent transactions"
        >
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <div className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4 text-green-500" />
                        <div className="text-sm font-medium text-green-700 dark:text-green-300">Current Balance</div>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">₹{financialSummary.currentBalance}</div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Milk Sales</div>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">₹{financialSummary.totalMilkSales}</div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                    <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4 text-amber-500" />
                        <div className="text-sm font-medium text-amber-700 dark:text-amber-300">Total Purchases</div>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">₹{financialSummary.totalPurchases}</div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                    <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-purple-500" />
                        <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Pending Payments</div>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">₹{financialSummary.pendingPayments}</div>
                </div>
            </div>

            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Transactions</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentTransactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${transaction.type === 'MILK_PAYMENT'
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                : transaction.type === 'SUPPLY_PURCHASE'
                                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                {transaction.type === 'MILK_PAYMENT' ? '💰' : transaction.type === 'SUPPLY_PURCHASE' ? '🛒' : '💸'}
                            </div>
                            <div>
                                <div className="font-medium text-gray-800 dark:text-gray-200">{transaction.description}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{format(parseISO(transaction.date), 'MMM dd, yyyy')}</div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className={`font-medium ${transaction.amount > 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                            </div>
                            <Badge
                                className="ml-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-0"
                            >
                                {transaction.paymentMethod}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center">
                <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    View All Transactions
                </a>
            </div>
        </ChartCard>
    );
} 