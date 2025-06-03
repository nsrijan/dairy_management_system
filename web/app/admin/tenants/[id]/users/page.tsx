'use client';

import { useAuth } from '@/app/providers';
import AdminManagement from '@/features/tenant/components/admin/AdminManagement';

export default function TenantAdminsPage({ params }: { params: { id: string } }) {
    const auth = useAuth();

    if (!auth.token) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                Authentication token not found
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* <div>
                <h2 className="text-2xl font-bold">Tenant Administrators</h2>
                <p className="text-gray-500">Manage administrators for this tenant</p>
            </div> */}

            <AdminManagement
                tenantId={params.id}
                token={auth.token}
            />
        </div>
    );
} 