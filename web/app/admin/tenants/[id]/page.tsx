'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTenantById } from '@/features/tenant/tenantService';
import { useAuth } from '@/app/providers';
import { TenantResponse } from '@/features/tenant/types';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function TenantDetailsPage() {
    const params = useParams();
    const auth = useAuth();
    const [tenant, setTenant] = useState<TenantResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTenant = async () => {
            if (!auth.token) {
                setError('No authentication token available');
                setIsLoading(false);
                return;
            }

            try {
                const response = await getTenantById(auth.token, params.id as string);
                setTenant(response);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch tenant details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTenant();
    }, [auth.token, params.id]);

    if (isLoading) {
        return <div className="p-6">Loading tenant details...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    if (!tenant) {
        return <div className="p-6">Tenant not found</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{tenant.name}</h1>
                <p className="text-gray-500">{tenant.subdomain}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${tenant.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tenant.active ? 'Active' : 'Inactive'}
                </span>
            </div>

            <div className="flex space-x-4 mb-6">
                <Link
                    href={`/admin/tenants/${params.id}`}
                    className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                    General
                </Link>
                <Link
                    href={`/admin/tenants/${params.id}/companies`}
                    className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center"
                >
                    <Building2 className="h-4 w-4 mr-2" />
                    Companies
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Information */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">General Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-500">Module Type</label>
                            <p className="font-medium">{tenant.moduleType}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Timezone</label>
                            <p className="font-medium">{tenant.timezone}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Currency</label>
                            <p className="font-medium">{tenant.currency}</p>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Dates</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-500">Created At</label>
                            <p className="font-medium">{new Date(tenant.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Last Updated</label>
                            <p className="font-medium">{new Date(tenant.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 