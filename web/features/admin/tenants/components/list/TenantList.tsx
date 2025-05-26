'use client';

import React, { useState } from 'react';
import { TenantResponse } from '@/features/tenant/types';
import TenantCard from './TenantCard';

interface TenantListProps {
    tenants: TenantResponse[];
}

const TenantList = ({ tenants }: TenantListProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const filteredTenants = tenants.filter(tenant => {
        const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && tenant.active) ||
            (statusFilter === 'inactive' && !tenant.active);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search tenants..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="sm:w-48">
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Total Tenants</p>
                    <p className="text-2xl font-semibold">{tenants.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-semibold text-green-600">
                        {tenants.filter(t => t.active).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Inactive</p>
                    <p className="text-2xl font-semibold text-gray-600">
                        {tenants.filter(t => !t.active).length}
                    </p>
                </div>
            </div>

            {/* Tenant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTenants.map(tenant => (
                    <TenantCard key={tenant.id} tenant={tenant} />
                ))}
            </div>

            {/* Empty State */}
            {filteredTenants.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No tenants found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default TenantList; 