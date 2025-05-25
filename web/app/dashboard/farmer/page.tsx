'use client';

import { useAuth } from '@/app/providers';
import { DairyFarmerDashboard } from '@/features/domains/dairy/components/dashboard/DairyFarmerDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FarmerDashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Check if user is authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return (
        // This would normally check for the right domain and role
        // For now we're just showing the dairy farmer dashboard
        <DairyFarmerDashboard user={user} />
    );
} 