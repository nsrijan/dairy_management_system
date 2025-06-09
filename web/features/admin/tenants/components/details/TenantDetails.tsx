import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { useTenantDetails, useDeleteTenant } from '../../hooks/useTenantQueries';
import { useTenantStore } from '../../store/tenantStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Box, Users, Calendar, Edit, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { CompanyList } from '../company/CompanyList';
import { TenantModuleList } from '../modules/TenantModuleList';

interface TenantDetailsProps {
    tenantId: string;
}

export function TenantDetails({ tenantId }: TenantDetailsProps) {
    const router = useRouter();
    const { token } = useAuth();
    const { isDeleteDialogOpen, setDeleteDialogOpen } = useTenantStore();
    const { data: tenant, isLoading, error } = useTenantDetails(token!, tenantId);
    const deleteMutation = useDeleteTenant(token!);

    const handleEdit = () => {
        router.push(`/admin/tenants/edit/${tenantId}`);
    };

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(tenantId);
            router.push('/admin/tenants');
        } catch (error) {
            console.error('Error deleting tenant:', error);
        }
    };

    if (isLoading) {
        return <TenantDetailsSkeleton />;
    }

    if (error || !tenant) {
        return (
            <div className="p-6 text-red-600">
                Error: {error instanceof Error ? error.message : 'Failed to load tenant'}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-end mb-8">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Tenant Info */}
            <div className="flex items-start gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-brand-primary flex items-center justify-center text-white">
                    {tenant?.name?.charAt(0)?.toUpperCase() ?? 'T'}
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{tenant.name}</h1>
                    <p className="text-muted-foreground">@{tenant.subdomain}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Active Modules"
                    value="1"
                    icon={<Box className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                    color="blue"
                />
                <StatCard
                    title="Companies"
                    value="2"
                    icon={<Box className="h-5 w-5 text-green-600 dark:text-green-400" />}
                    color="green"
                />
                <StatCard
                    title="Users"
                    value="12"
                    icon={<Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                    color="purple"
                />
                <StatCard
                    title="Days Active"
                    value="0"
                    icon={<Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
                    color="orange"
                />
            </div>

            {/* Navigation */}
            <Tabs defaultValue="overview" className="mb-8">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="modules">Modules</TabsTrigger>
                    <TabsTrigger value="companies">Companies</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
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
                                    <p className="font-medium">{tenant.currency}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Timezone</p>
                                    <p className="font-medium">{tenant.timezone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="font-medium">
                                        {new Date(tenant.createdAt).toLocaleDateString()}
                                    </p>
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
                </TabsContent>

                <TabsContent value="modules" className="mt-6">
                    <TenantModuleList tenantId={tenantId} />
                </TabsContent>

                <TabsContent value="companies" className="mt-6">
                    <CompanyList tenantId={tenantId} />
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Settings content coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tenant
                            and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
                        {icon}
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function TenantDetailsSkeleton() {
    return (
        <div className="p-6">
            <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                <div className="space-y-4">
                    <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
            </div>
        </div>
    );
} 