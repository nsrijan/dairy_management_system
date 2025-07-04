'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { useCompanyDetails, useDeleteCompany } from '../../hooks/useCompanies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building2, Users, Calendar, Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
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
import { formatDistanceToNow } from 'date-fns';

interface CompanyDetailsProps {
    companyId: string;
}

export function CompanyDetails({ companyId }: CompanyDetailsProps) {
    const router = useRouter();
    const { token } = useAuth();
    const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const { data: company, isLoading, error } = useCompanyDetails(companyId);
    const deleteMutation = useDeleteCompany();

    const handleEdit = () => {
        // Navigate to edit page or open edit dialog
        console.log('Edit company:', companyId);
    };

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(companyId);
            setDeleteDialogOpen(false);
            router.back(); // Go back to companies list
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    if (isLoading) {
        return <CompanyDetailsSkeleton />;
    }

    if (error || !company) {
        return (
            <div className="p-6 text-red-600">
                Error: {error instanceof Error ? error.message : 'Failed to load company'}
            </div>
        );
    }

    // Calculate days active
    const daysActive = Math.floor(
        (new Date().getTime() - new Date(company.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

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

            {/* Company Info */}
            <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {company.name}
                        </h1>
                        <div className="flex items-center gap-2">
                            {company.isActive ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Inactive
                                </Badge>
                            )}
                        </div>
                    </div>
                    {company.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {company.description}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Created {formatDistanceToNow(new Date(company.createdAt), { addSuffix: true })}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Users"
                    value="24"
                    icon={<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                    color="blue"
                />
                <StatCard
                    title="Active Users"
                    value="18"
                    icon={<CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                    color="green"
                />
                <StatCard
                    title="Departments"
                    value="5"
                    icon={<Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                    color="purple"
                />
                <StatCard
                    title="Days Active"
                    value={daysActive.toString()}
                    icon={<Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
                    color="orange"
                />
            </div>

            {/* Navigation */}
            <Tabs defaultValue="overview" className="mb-8">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="departments">Departments</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-2 gap-6">
                        <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-900/50 border-gray-200/50 dark:border-gray-700/50">
                            <CardHeader>
                                <CardTitle>Company Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{company.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge
                                        className={company.isActive
                                            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                            : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                        }
                                    >
                                        {company.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                {company.description && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Description</p>
                                        <p className="font-medium">{company.description}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-muted-foreground">Tenant ID</p>
                                    <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                        {company.tenantId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="font-medium">
                                        {new Date(company.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p className="font-medium">
                                        {new Date(company.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-900/50 border-gray-200/50 dark:border-gray-700/50">
                            <CardHeader>
                                <CardTitle>Activity Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Created By</p>
                                    <p className="font-medium">{company.createdBy || 'System'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Modified By</p>
                                    <p className="font-medium">{company.updatedBy || 'System'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Days Since Creation</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <p className="font-medium">{daysActive} days</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Company ID</p>
                                    <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                        {company.id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">User management features will be added here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="departments" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Departments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Department management features will be added here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Company settings will be available here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Company</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{company.name}"? This action cannot be undone.
                            All data associated with this company will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    const colorClasses = {
        blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
        green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
        purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
        orange: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20',
    };

    return (
        <Card className={`${colorClasses[color as keyof typeof colorClasses]} border transition-all duration-200 hover:shadow-md`}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground font-medium">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function CompanyDetailsSkeleton() {
    return (
        <div className="p-6 max-w-[1200px] mx-auto">
            {/* Header Skeleton */}
            <div className="flex items-center justify-end mb-8">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-16" />
                    <Skeleton className="h-9 w-20" />
                </div>
            </div>

            {/* Company Info Skeleton */}
            <div className="flex items-start gap-4 mb-8">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1">
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-5 h-5" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-16 mb-1" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-24 mb-1" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-24 mb-1" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 