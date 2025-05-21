'use client';

import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

export default function AdminPage() {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();

    // Check if user is authenticated and has admin role
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        } else if (!isLoading && isAuthenticated && user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN') {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, router, user]);

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    if (!isAuthenticated || (user?.role !== 'TENANT_MANAGER' && user?.role !== 'SUPER_ADMIN')) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Tenant Management
                        </CardTitle>
                        <CardDescription>
                            Manage the system's tenant organizations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Create, edit, and manage tenant accounts in the system. Control tenant settings, status, and configuration.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => router.push('/admin/tenants')} className="w-full">
                            Manage Tenants
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
} 