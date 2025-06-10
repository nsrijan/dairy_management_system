import * as React from 'react';
import { ModuleCard } from '@/features/admin/modules/components/list/ModuleCard';
import { useQuery } from '@tanstack/react-query';
import { moduleApi } from '@/features/admin/modules/api/moduleApi';
import { useAuth } from '@/app/providers';
import { Module } from '@/features/admin/modules/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TenantModuleListProps {
    tenantId: string;
}

export function TenantModuleList({ tenantId }: TenantModuleListProps) {
    const { token } = useAuth();

    const { data: modulesResponse, isLoading } = useQuery({
        queryKey: ['tenant-modules', tenantId],
        queryFn: () => token ? moduleApi.getModules(token) : null,
        enabled: !!token,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-start space-x-4">
                                    <Skeleton className="h-6 w-6" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-6 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    const modules = modulesResponse?.data || [];
    const activeModules = modules.filter(module => module.active);

    if (activeModules.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Active Modules</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        This tenant has no active modules. Contact your system administrator to enable modules.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {activeModules.map((module: Module) => (
                <ModuleCard
                    key={module.id}
                    module={module}
                    showActions={false}
                />
            ))}
        </div>
    );
} 