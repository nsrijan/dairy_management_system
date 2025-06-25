'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { CompanyManagement } from '@/features/companies/components/CompanyManagement';

export default function CompaniesPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [currentRole, setCurrentRole] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user?.role) {
            // Remove ROLE_ prefix if it exists
            const primaryRole = user.role.replace('ROLE_', '');
            setCurrentRole(primaryRole);

            // Check if user has access to companies page
            const allowedRoles = ['TENANT_ADMIN', 'DAIRY_ADMIN', 'DAIRY_TENANT_ADMIN', 'COMPANY_ADMIN'];
            if (!allowedRoles.includes(primaryRole)) {
                router.push('/unauthorized');
                return;
            }
        }
    }, [user, isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user || !currentRole) {
        return null; // Router push will handle redirect
    }

    return <CompanyManagement />;
} 