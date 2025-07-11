'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Users, Droplet, Package, BarChart3 } from 'lucide-react';
import { McbOverview } from './McbOverview';

interface EntityTabsProps {
    companyId: string;
}

export function EntityTabs({ companyId }: EntityTabsProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('mcbs');

    const handleCreateMCB = () => {
        router.push(`/companies/${companyId}/milkCollectionBranch/new`);
    };

    const handleViewAllMCBs = () => {
        router.push(`/companies/${companyId}?tab=mcbs`);
    };

    return (
        <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="mcbs" className="flex items-center gap-2">
                        <Droplet className="h-4 w-4" />
                        MCBs
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="inventory" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Inventory
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Reports
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="mcbs" className="mt-6">
                    <McbOverview
                        companyId={companyId}
                        onCreateMCB={handleCreateMCB}
                        onViewAllMCBs={handleViewAllMCBs}
                        onEditMCB={(mcb) => {
                            console.log('Edit MCB:', mcb);
                            // Handle edit MCB
                        }}
                        onDeleteMCB={(mcb) => {
                            console.log('Delete MCB:', mcb);
                            // Handle delete MCB
                        }}
                    />
                </TabsContent>

                <TabsContent value="users" className="mt-6">
                    <div className="p-6 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
                        <p className="text-gray-500">Manage company users and their permissions.</p>
                    </div>
                </TabsContent>

                <TabsContent value="inventory" className="mt-6">
                    <div className="p-6 text-center">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Inventory Management</h3>
                        <p className="text-gray-500">Track and manage company inventory.</p>
                    </div>
                </TabsContent>

                <TabsContent value="reports" className="mt-6">
                    <div className="p-6 text-center">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
                        <p className="text-gray-500">View company performance reports and analytics.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 