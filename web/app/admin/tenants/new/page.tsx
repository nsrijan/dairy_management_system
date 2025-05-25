'use client';

import { useRouter } from 'next/navigation';
import TenantForm from '@/features/tenant/components/TenantForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewTenantPage() {
    const router = useRouter();

    return (
        <div>
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/admin/tenants')}
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Tenants
                </Button>
            </div>

            <div className="max-w-3xl mx-auto">
                <TenantForm onSuccess={() => router.push('/admin/tenants')} />
            </div>
        </div>
    );
} 