'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTenantById } from '@/features/admin/tenants/services/tenantService';
import { useAuth } from '@/app/providers';
import { TenantResponse } from '@/features/admin/tenants/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Box, Users, Calendar, Edit, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TenantDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const auth = useAuth();
    const [tenant, setTenant] = useState<TenantResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTenant = async () => {
            if (!auth.token) {
                setError('No authentication token available');
                setIsLoading(false);
                return;
            }

            try {
                const response = await getTenantById(auth.token, params.id as string);
                setTenant(response);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch tenant details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTenant();
    }, [auth.token, params.id]);

    if (isLoading) {
        return <div className="p-6">Loading tenant details...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    if (!tenant) {
        return <div className="p-6">Tenant not found</div>;
    }

    return (
        <div className="p-6 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/admin/tenants')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tenants
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Tenant Info */}
            <div className="flex items-start gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-brand-primary flex items-center justify-center text-white">
                    {tenant.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{tenant.name}</h1>
                    <p className="text-muted-foreground">@{tenant.subdomain}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900/50 border-blue-100/50 dark:border-blue-900/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Box className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-600/80 dark:text-blue-400/80 font-medium">Active Modules</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">1</p>
                            </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-blue-500/5" />
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-900/50 border-green-100/50 dark:border-green-900/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Box className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-green-600/80 dark:text-green-400/80 font-medium">Companies</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">2</p>
                            </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-green-500/5" />
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900/50 border-purple-100/50 dark:border-purple-900/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-purple-600/80 dark:text-purple-400/80 font-medium">Users</p>
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">12</p>
                            </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-purple-500/5" />
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-900/50 border-orange-100/50 dark:border-orange-900/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-orange-600/80 dark:text-orange-400/80 font-medium">Days Active</p>
                                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">0</p>
                            </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-orange-500/5" />
                    </CardContent>
                </Card>
            </div>

            {/* Navigation */}
            <Tabs defaultValue="overview" className="mb-8">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="modules">Modules</TabsTrigger>
                    <TabsTrigger value="companies">Companies</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Content */}
            <div className="grid grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-900/50 border-gray-200/50 dark:border-gray-700/50">
                    <CardHeader>
                        <CardTitle>Tenant Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{tenant.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Slug</p>
                            <Badge variant="secondary">{tenant.subdomain}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Currency</p>
                            <p className="font-medium">NPR</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Timezone</p>
                            <p className="font-medium">Asia/Kathmandu</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="font-medium">6/3/2025</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-900/50 border-gray-200/50 dark:border-gray-700/50">
                    <CardHeader>
                        <CardTitle>Theme Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Primary Color</p>
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-[#90B87F5]"></div>
                                <p className="font-medium">#90B87F5</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Secondary Color</p>
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-[#7E69AB]"></div>
                                <p className="font-medium">#7E69AB</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 