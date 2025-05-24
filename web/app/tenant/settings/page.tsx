'use client';

import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TenantSettingsDashboard from '@/features/tenant/components/settings/TenantSettingsDashboard';

export default function TenantSettingsPage() {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();

    // Check if user is authenticated and has tenant admin role
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        } else if (!isLoading && isAuthenticated && user?.role !== 'TENANT_ADMIN') {
            router.push('/tenant/dashboard');
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

    if (!isAuthenticated || user?.role !== 'TENANT_ADMIN') {
        return null; // Will redirect in useEffect
    }

    return <TenantSettingsDashboard />;
} 