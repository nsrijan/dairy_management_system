'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/app/providers';
import { getTenantNavItems } from '@/features/tenant';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            redirect('/login');
        }
    }, [isAuthenticated, isLoading]);

    // Check if user has tenant role
    useEffect(() => {
        if (!isLoading && isAuthenticated && user && !user.role.includes('TENANT_')) {
            redirect('/dashboard');
        }
    }, [isAuthenticated, isLoading, user]);

    // Get navigation items for tenant users
    const navItems = getTenantNavItems(user);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    const logo = (
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center font-bold">
                DM
            </div>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">DairyManager</span>
        </div>
    );

    return (
        <AppLayout sidebarItems={navItems} logo={logo}>
            {children}
        </AppLayout>
    );
} 