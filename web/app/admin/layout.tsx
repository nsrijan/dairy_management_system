'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/app/providers';
import { getNavItems } from '@/features/navigation/getNavItems';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Redirect if not authenticated or not admin
    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                redirect('/login');
            } else if (user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN') {
                redirect('/dashboard');
            }
        }
    }, [isAuthenticated, isLoading, user]);

    // Get navigation items based on user role
    const navItems = getNavItems(user);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated || (user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN')) {
        return null; // Will redirect in useEffect
    }

    return (
        <AppLayout sidebarItems={navItems}>
            {children}
        </AppLayout>
    );
} 