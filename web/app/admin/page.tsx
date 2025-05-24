'use client';

import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminDashboard } from '@/features/domains/admin/components';

export default function AdminPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Check if user is authenticated and has admin role
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
            // } else if (!isLoading && user?.role !== 'SYSTEM_ADMIN') {
            //     router.push('/dashboard');
        } else if (!isLoading && isAuthenticated && user?.role == 'SYSTEM_ADMIN') {
            router.push('/admin');
        }
    }, [isAuthenticated, isLoading, router, user]);

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    if (!isAuthenticated || (user?.role !== 'TENANT_MANAGER' && user?.role !== 'SYSTEM_ADMIN')) {
        return null; // Will redirect in useEffect
    }

    return <AdminDashboard user={user} />;
} 