'use client';

import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { AddMCBForm } from '@/features/mcb/components/AddMCBForm';
import { getTenantName } from '@/features/navigation/getNavItems';
import { useAuth } from '@/app/providers';

export default function NewMCBPage() {
    const params = useParams();
    const companyId = params.id as string;
    const { tenant } = useAuth();
    const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '';

    return (
        <AppLayout
            title="Add MCB"
            tenantName={getTenantName(tenant || undefined, subdomain)}
            showSearch={false}
        >
            <AddMCBForm companyId={companyId} />
        </AppLayout>
    );
} 