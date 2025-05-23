'use client';

import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TenantForm from '@/features/tenant/components/TenantForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewTenantPage() {
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
        return (
            <div className="flex justify-center items-center p-8 h-64">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-3"></div>
                    <div className="text-gray-500 dark:text-gray-400">Loading...</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || (user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN')) {
        return null; // Will redirect in useEffect
    }

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