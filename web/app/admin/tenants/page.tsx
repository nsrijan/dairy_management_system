'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TenantsList from '@/features/tenant/components/TenantsList';

export default function TenantsPage() {
    const router = useRouter();

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">Manage all your tenant organizations from here.</p>
                <Button onClick={() => router.push('/admin/tenants/new')} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tenant
                </Button>
            </div>

            <TenantsList />
        </>
    );
} 