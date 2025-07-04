'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { CompanyOverview } from '@/features/companies/components/details/CompanyOverview';
import { CompanyStatsCards } from '@/features/companies/components/details/CompanyStatsCards';
import { EntityTabs } from '@/features/companies/components/details/EntityTabs';
import { useCompanyDetails } from '@/features/companies/hooks/useCompanies';

export default function CompanyDetailsPage() {
    const params = useParams();
    const companyId = params.id as string;
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    const { data: company, isLoading: companyLoading, error } = useCompanyDetails(companyId);

    if (!companyId) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-xl font-semibold text-red-600">Invalid Company ID</h1>
                <p className="text-gray-600 mt-2">Please provide a valid company ID.</p>
            </div>
        );
    }

    if (isLoading || companyLoading) {
        return (
            <AppLayout title="Company Details">
                <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading company details...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error || !company) {
        return (
            <AppLayout title="Company Details">
                <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-red-600">Error Loading Company</h1>
                        <p className="text-gray-600 mt-2">
                            {error instanceof Error ? error.message : 'Failed to load company details'}
                        </p>
                        <Button onClick={() => router.back()} className="mt-4">
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title={`${company.name} - Details`}>
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
                                <BreadcrumbPage>{company.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Page Content */}
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Company Overview */}
                    <CompanyOverview company={company} />

                    {/* Company Statistics */}
                    <CompanyStatsCards companyId={companyId} />

                    {/* Entity Lists */}
                    <EntityTabs companyId={companyId} />
                </div>
            </div>
        </AppLayout>
    );
} 