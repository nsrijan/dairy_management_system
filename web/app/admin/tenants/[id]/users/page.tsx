'use client';

import { useAuth } from '@/app/providers';
import AdminManagement from '@/features/admin/tenants/components/admin/AdminManagement';

interface UsersPageProps {
    params: {
        id: string;
    };
}

export default function UsersPage({ params }: UsersPageProps) {
    const { token } = useAuth();
    const { id } = params;

    if (!token) {
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

            <AdminManagement tenantId={id} token={token} />
        </div>
    );
} 