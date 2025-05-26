import React from 'react';
import { Tenant } from '../../types';

interface TenantInfoProps {
    tenant: Tenant;
    onStatusChange?: (status: Tenant['status']) => void;
}

const TenantInfo = ({ tenant, onStatusChange }: TenantInfoProps) => {
    const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        suspended: 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white shadow rounded-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{tenant.name}</h2>
                        <p className="text-sm text-gray-500">{tenant.slug}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[tenant.status]}`}>
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                        </span>
                        <select
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                            value={tenant.status}
                            onChange={(e) => onStatusChange?.(e.target.value as Tenant['status'])}
                        >
                            <option value="active">Set Active</option>
                            <option value="inactive">Set Inactive</option>
                            <option value="suspended">Set Suspended</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-500">Email</label>
                                <p className="text-gray-900">{tenant.settings.contactInfo.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Phone</label>
                                <p className="text-gray-900">{tenant.settings.contactInfo.phone}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Address</label>
                                <p className="text-gray-900">{tenant.settings.contactInfo.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Settings */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Business Settings</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-500">Business Hours</label>
                                <p className="text-gray-900">{tenant.settings.businessSettings.businessHours}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Fiscal Year</label>
                                <p className="text-gray-900">{tenant.settings.businessSettings.fiscalYear}</p>
                            </div>
                        </div>
                    </div>

                    {/* System Settings */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-500">Timezone</label>
                                <p className="text-gray-900">{tenant.settings.generalSettings.timezone}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Date Format</label>
                                <p className="text-gray-900">{tenant.settings.generalSettings.dateFormat}</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-500">Created At</label>
                                <p className="text-gray-900">{new Date(tenant.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Theme</label>
                                <p className="text-gray-900">{tenant.settings.customization.theme}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Delete Tenant
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                        Edit Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TenantInfo; 