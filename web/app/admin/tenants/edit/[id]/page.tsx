'use client';

import { useRouter } from 'next/navigation';
import TenantForm from '@/features/tenant/components/TenantForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditTenantPageProps {
    params: {
        id: string;
    };
}

export default function EditTenantPage({ params }: EditTenantPageProps) {
    const router = useRouter();
    const { id } = params;

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