'use client';

import { useAuth } from '@/app/providers';
import { AppLayout } from '@/components/layout/AppLayout';
import { MCBDashboardContent } from '@/features/milkCollectionBranch/components/MCBDashboardContent';
import { getTenantName } from '@/features/navigation/getNavItems';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MilkCollectionBranchPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [tenant, setTenant] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        // Check if user has permission to access MCB manager dashboard
        if (user?.role) {
            const primaryRole = user.role.replace('ROLE_', '');

            // Only MCB managers, company admins, and tenant admins can access this page
            const allowedRoles = ['MCB_MANAGER', 'COMPANY_ADMIN', 'TENANT_ADMIN', 'DAIRY_ADMIN'];
            if (!allowedRoles.includes(primaryRole)) {
                router.push('/unauthorized');
                return;
            }
        }

        // Get tenant information
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            const subdomain = hostname.split('.')[0];
            setTenant(subdomain);
        }
    }, [user, isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <AppLayout title="MCB Manager Dashboard">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            </AppLayout>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <AppLayout
            title="MCB Manager Dashboard"
            tenantName={getTenantName({ name: tenant }, tenant)}
        >
            <div className="p-6">
                <MCBDashboardContent />
            </div>
        </AppLayout>
    );
} 