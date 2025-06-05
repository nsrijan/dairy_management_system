'use client';

import React from 'react';
import Link from 'next/link';
import { TenantResponse } from '@/features/tenant/types';

interface TenantCardProps {
    tenant: TenantResponse;
}

const TenantCard = ({ tenant }: TenantCardProps) => {
    const statusColors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400'
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        <Link href={`/admin/tenants/${tenant.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            {tenant.name}
                        </Link>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tenant.subdomain}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tenant.active ? statusColors.active : statusColors.inactive}`}>
                    {tenant.active ? 'Active' : 'Inactive'}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Module Type</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{tenant.moduleType}</p>
                </div>
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Created</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(tenant.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <Link
                    href={`/admin/tenants/${tenant.id}`}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
                >
                    View Details <span className="text-lg leading-none">→</span>
                </Link>
            </div>
        </div>
    );
};

export default TenantCard; 