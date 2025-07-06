'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getTenantName } from '@/features/navigation/getNavItems';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

// Mock companies data - replace with actual API call
const mockCompanies = [
    { id: 'comp-1', name: 'Himalayan Dairy Co.', location: 'Kathmandu' },
    { id: 'comp-2', name: 'Everest Milk Products', location: 'Pokhara' },
    { id: 'comp-3', name: 'Nepal Fresh Dairy', location: 'Chitwan' },
];

export default function AddMCBSelectorPage() {
    const router = useRouter();
    const { tenant } = useAuth();
    const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '';
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

    const handleContinue = () => {
        if (selectedCompanyId) {
            router.push(`/companies/${selectedCompanyId}/mcb/new`);
        }
    };

    return (
        <AppLayout
            title="Add MCB"
            tenantName={getTenantName(tenant || undefined, subdomain)}
            showSearch={false}
        >
            <div className="max-w-2xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/features/mcb/list">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Add New Milk Collection Branch
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Select a company to add a new MCB to
                        </p>
                    </div>
                </div>

                {/* Company Selector Card */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            Select Company
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Choose a company to add the MCB to *
                            </label>
                            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a company..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockCompanies.map((company) => (
                                        <SelectItem key={company.id} value={company.id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{company.name}</span>
                                                <span className="text-sm text-gray-500">{company.location}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/features/mcb/list')}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleContinue}
                                disabled={!selectedCompanyId}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Continue to Add MCB
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 