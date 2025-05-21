'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/app/providers';
import { getNavItems } from '@/features/navigation/getNavItems';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            redirect('/login');
        }
    }, [isAuthenticated, isLoading]);

    // Get navigation items based on user role
    const navItems = getNavItems(user);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return (
        <AppLayout sidebarItems={navItems}>
            {children}
        </AppLayout>
    );
} 