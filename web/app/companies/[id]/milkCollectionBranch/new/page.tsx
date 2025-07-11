'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { AppLayout } from '@/components/layout/AppLayout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getTenantName } from '@/features/navigation/getNavItems';
import { AddMilkCollectionBranchForm } from '@/features/milkCollectionBranch/add/AddMilkCollectionBranchForm';
import { Home } from 'lucide-react';

export default function AddMCBPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isLoading, isAuthenticated, tenant } = useAuth();
    const companyId = params.id as string;

    // Get subdomain for tenant context
    const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '';

    if (isLoading) {
        return (
            <AppLayout title="Add MCB">
                <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!isAuthenticated) {
        router.push('/login');
        return null;
    }

    return (
        <AppLayout
            title="Add Milk Collection Branch"
            tenantName={getTenantName(tenant, subdomain)}
        >
            <div className="p-6">
                {/* Breadcrumb Navigation */}
                <div className="mb-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">
                                    <Home className="h-4 w-4" />
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/companies">Companies</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/companies/${companyId}`}>
                                    Company Details
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Add MCB</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Form Content */}
                <div className="max-w-4xl mx-auto">
                    <AddMilkCollectionBranchForm companyId={companyId} />
                </div>
            </div>
        </AppLayout>
    );
} 