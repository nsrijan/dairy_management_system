'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TenantsList from '@/features/tenant/components/TenantsList';

export default function TenantsPage() {
    const router = useRouter();

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tenant Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Create and manage tenants in the system.</p>
            </div>

            <TenantsList />

            <Button
                onClick={() => router.push('/admin/tenants/new')}
                className="fixed right-6 bottom-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-full h-12 w-12 flex items-center justify-center"
            >
                <Plus className="h-6 w-6" />
            </Button>
        </>
    );
} 