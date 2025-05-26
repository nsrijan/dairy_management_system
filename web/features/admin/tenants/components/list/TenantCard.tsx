'use client';

import React from 'react';
import Link from 'next/link';
import { TenantResponse } from '@/features/tenant/types';

interface TenantCardProps {
    tenant: TenantResponse;
}

const TenantCard = ({ tenant }: TenantCardProps) => {
    const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800'
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        <Link href={`/admin/tenants/${tenant.id}`} className="hover:text-blue-600">
                            {tenant.name}
                        </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{tenant.subdomain}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tenant.active ? statusColors.active : statusColors.inactive}`}>
                    {tenant.active ? 'Active' : 'Inactive'}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Module Type</p>
                    <p className="font-medium">{tenant.moduleType}</p>
                </div>
                <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium">{new Date(tenant.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
                <Link
                    href={`/admin/tenants/${tenant.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    View Details →
                </Link>
            </div>
        </div>
    );
};

export default TenantCard; 