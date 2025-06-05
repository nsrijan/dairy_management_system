'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TenantList } from '@/features/admin/tenants/components';
import { useEffect, useState } from 'react';
import { getAllTenants } from '@/features/admin/tenants/services/tenantService';
import { TenantResponse } from '@/features/admin/tenants/types';
import { useAuth } from '@/app/providers';
import { TenantOnboardingDialog } from '@/features/admin/tenants/components/onboarding';

export default function TenantsPage() {
    const router = useRouter();
    const auth = useAuth();
    const [tenants, setTenants] = useState<TenantResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchTenants = async () => {
            if (!auth.token) {
                setError('No authentication token available');
                setIsLoading(false);
                return;
            }

            try {
                const response = await getAllTenants(auth.token, 0, 10);
                setTenants(response.tenants);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch tenants');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTenants();
    }, [auth.token]);

    if (isLoading) {
        return <div className="p-6">Loading tenants...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <TenantList tenants={tenants} />

            <Button
                onClick={() => setIsDialogOpen(true)}
                className="fixed right-6 bottom-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-full h-12 w-12 flex items-center justify-center"
            >
                <Plus className="h-6 w-6" />
            </Button>

            <TenantOnboardingDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </div>
    );
} 