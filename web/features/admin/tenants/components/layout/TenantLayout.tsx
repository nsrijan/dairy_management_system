'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

interface LayoutProps {
    children: React.ReactNode;
}

const TenantLayout = ({ children }: LayoutProps) => {
    const params = useParams();
    const pathname = usePathname();
    const tenantId = params.id;

    const navigation = [
        {
            name: 'Details',
            href: `/admin/tenants/${tenantId}`,
            current: pathname === `/admin/tenants/${tenantId}`,
        },
        {
            name: 'Settings',
            href: `/admin/tenants/${tenantId}/settings`,
            current: pathname.endsWith('/settings'),
        },
        {
            name: 'Branding',
            href: `/admin/tenants/${tenantId}/branding`,
            current: pathname.endsWith('/branding'),
        },
        {
            name: 'Companies',
            href: `/admin/tenants/${tenantId}/companies`,
            current: pathname.endsWith('/companies'),
        },
        {
            name: 'Users',
            href: `/admin/tenants/${tenantId}/users`,
            current: pathname.endsWith('/users'),
        },
        {
            name: 'Audit Logs',
            href: `/admin/tenants/${tenantId}/audit-logs`,
            current: pathname.endsWith('/audit-logs'),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <Link href="/admin/tenants" className="text-gray-500 hover:text-gray-700">
                                    ← Back to Tenants
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub Navigation */}
            <div className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium
                                    ${item.current
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }
                                `}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    );
};

export default TenantLayout; 