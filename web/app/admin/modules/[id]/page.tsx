'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { ModuleDetails } from '@/features/admin/modules/components/details/ModuleDetails';
import { moduleService } from '@/features/admin/modules/services/moduleService';
import { Module } from '@/features/admin/modules/types';

export default function ModuleDetailsPage() {
    const params = useParams();
    const auth = useAuth();
    const [module, setModule] = useState<Module | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModule = async () => {
            if (!auth.token) {
                setError('No authentication token available');
                setIsLoading(false);
                return;
            }

            try {
                const response = await moduleService.getModuleById(auth.token, params.id as string);
                setModule(response);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch module details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchModule();
    }, [auth.token, params.id]);

    if (isLoading) {
        return <div className="p-6">Loading module details...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    if (!module) {
        return <div className="p-6">Module not found</div>;
    }

    return <ModuleDetails module={module} />;
} 