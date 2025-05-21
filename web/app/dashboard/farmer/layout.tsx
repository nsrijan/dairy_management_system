'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/app/providers';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import {
    LayoutDashboard,
    Droplet,
    CircleDollarSign,
    ShoppingCart,
    FileText,
    BellRing,
    Settings
} from 'lucide-react';

export default function FarmerDashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            redirect('/login');
        }
    }, [isAuthenticated, isLoading]);

    // Farmer-specific navigation items
    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard/farmer' },
        { icon: <Droplet size={20} />, label: 'Milk Records', href: '/dashboard/farmer/milk-records' },
        { icon: <CircleDollarSign size={20} />, label: 'Payments', href: '/dashboard/farmer/payments' },
        { icon: <ShoppingCart size={20} />, label: 'Purchases', href: '/dashboard/farmer/purchases' },
        { icon: <FileText size={20} />, label: 'Reports', href: '/dashboard/farmer/reports' },
        { icon: <BellRing size={20} />, label: 'Notifications', href: '/dashboard/farmer/notifications' },
        { icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/farmer/settings' },
    ];

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