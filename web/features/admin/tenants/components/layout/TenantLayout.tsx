'use client';

import React from 'react';
import Link from 'next/link';

interface LayoutProps {
    children: React.ReactNode;
}

const TenantLayout = ({ children }: LayoutProps) => {
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

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    );
};

export default TenantLayout; 