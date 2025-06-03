'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTenantById } from '@/features/tenant/tenantService';
import { useAuth } from '@/app/providers';
import { TenantResponse } from '@/features/tenant/types';
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
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                                <Box className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active Modules</p>
                                <p className="text-2xl font-semibold">1</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center">
                                <Box className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Companies</p>
                                <p className="text-2xl font-semibold">2</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded bg-purple-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Users</p>
                                <p className="text-2xl font-semibold">12</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded bg-orange-100 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Days Active</p>
                                <p className="text-2xl font-semibold">0</p>
                            </div>
                        </div>
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
                <Card>
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

                <Card>
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