'use client';

import { ModuleManagement } from '@/features/admin/modules/components';
import { useAuth } from '@/app/providers';
import { redirect } from 'next/navigation';

export default function ModulesPage() {
    const { token, isAuthenticated, isLoading } = useAuth();

    if (!isLoading && !isAuthenticated) {
        redirect('/login');
    }

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    if (!token) {
        return null;
    }

    return <ModuleManagement token={token} />;
} 