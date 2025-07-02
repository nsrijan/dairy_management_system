'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
        <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <div className="flex items-center text-xs text-gray-400">
                    <span className="text-xs font-medium">₹{financialSummary.currentBalance}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{financialSummary.currentBalance}</div>
                <p className="text-xs text-gray-500">+20 from last month</p>
            </CardContent>
        </Card>
    );
} 