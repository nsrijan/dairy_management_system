'use client';

import { Card } from '@/components/ui/card';
import { Building2, CheckCircle2, XCircle } from 'lucide-react';
import { CompanyResponse } from '../../../types';

interface CompanyStatsPanelProps {
    companies: CompanyResponse[];
}

export function CompanyStatsPanel({ companies }: CompanyStatsPanelProps) {
    const totalCompanies = companies.length;
    const activeCompanies = companies.filter(c => c.isActive).length;
    const inactiveCompanies = companies.filter(c => !c.isActive).length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4">
                <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    <div>
                        <p className="text-sm text-gray-500">Total Companies</p>
                        <p className="text-2xl font-semibold">{totalCompanies}</p>
                    </div>
                </div>
            </Card>
            <Card className="p-4">
                <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                        <p className="text-sm text-gray-500">Active</p>
                        <p className="text-2xl font-semibold text-green-600">{activeCompanies}</p>
                    </div>
                </div>
            </Card>
            <Card className="p-4">
                <div className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-gray-500" />
                    <div>
                        <p className="text-sm text-gray-500">Inactive</p>
                        <p className="text-2xl font-semibold text-gray-600">{inactiveCompanies}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
} 