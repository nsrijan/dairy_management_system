'use client';

import { ChartCard } from '../../../../../dashboard/widgets';
import { Button } from '@/components/ui/button';
import { MilkRecord } from '../../../types';
import { format, parseISO } from 'date-fns';

interface MilkProductionPanelProps {
    milkRecords: MilkRecord[];
}

export function MilkProductionPanel({ milkRecords }: MilkProductionPanelProps) {
    return (
        <ChartCard
            title="Recent Milk Production"
            subtitle="Daily collection records"
            action={<Button variant="outline" size="sm" className="text-xs">View All</Button>}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                            <th className="text-left whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Date</th>
                            <th className="text-right whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Quantity (L)</th>
                            <th className="text-right whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Fat %</th>
                            <th className="text-right whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">SNF %</th>
                            <th className="text-right whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Rate</th>
                            <th className="text-right whitespace-nowrap px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {milkRecords.map(record => (
                            <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/80">
                                <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                                    {format(parseISO(record.date), 'MMM dd, yyyy')}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">
                                    {record.quantity}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">
                                    {record.fatPercentage.toFixed(1)}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">
                                    {record.snfPercentage.toFixed(1)}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">
                                    ₹{record.rate}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-right font-medium text-gray-700 dark:text-gray-300">
                                    ₹{record.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
                <div className="font-medium text-blue-700 dark:text-blue-300">Production Summary</div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Quantity</div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                            {milkRecords.reduce((sum, record) => sum + record.quantity, 0)} L
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Average Fat %</div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                            {(milkRecords.reduce((sum, record) => sum + record.fatPercentage, 0) / milkRecords.length).toFixed(1)}%
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Amount</div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                            ₹{milkRecords.reduce((sum, record) => sum + record.amount, 0)}
                        </div>
                    </div>
                </div>
            </div>
        </ChartCard>
    );
} 