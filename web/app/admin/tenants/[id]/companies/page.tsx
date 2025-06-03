'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { CompanyContent } from '@/features/tenant/components/company';

export default function CompaniesPage() {
    const params = useParams();
    const auth = useAuth();

    if (!auth.token) {
        return <div className="p-6 text-red-600">Error: Authentication required</div>;
    }

    return (
        <div className="p-6">
            <CompanyContent
                tenantId={params.id as string}
                token={auth.token}
            />
        </div>
    );
} 