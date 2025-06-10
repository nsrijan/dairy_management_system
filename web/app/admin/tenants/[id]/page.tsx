'use client';

import * as React from 'react';
import { TenantDetails } from '@/features/admin/tenants/components/details/TenantDetails';

interface TenantDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function TenantDetailsPage({ params }: TenantDetailsPageProps) {
    const resolvedParams = React.use(params);
    return <TenantDetails tenantId={resolvedParams.id} />;
} 