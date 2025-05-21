'use client';

import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TenantForm from '@/features/tenant/components/TenantForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditTenantPageProps {
    params: {
        id: string;
    };
}

export default function EditTenantPage({ params }: EditTenantPageProps) {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();
    const { id } = params;

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
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tenants
                </Button>
            </div>

            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Tenant</h1>
                <TenantForm
                    tenantId={id}
                    onSuccess={() => router.push('/admin/tenants')}
                />
            </div>
        </div>
    );
} 