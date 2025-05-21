'use client';

import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TenantsList from '@/features/tenant/components/TenantsList';

export default function TenantsPage() {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();

    // Check if user is authenticated and has admin role
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        } else if (!isLoading && isAuthenticated && user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN') {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, router, user]);

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    if (!isAuthenticated || (user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN')) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Tenant Management</h1>
                <Button onClick={() => router.push('/admin/tenants/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tenant
                </Button>
            </div>

            <TenantsList />
        </div>
    );
} 