'use client';

import { GeneralSettings } from '@/features/admin/tenants/components';

export default function TenantSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Tenant Settings</h1>
            <GeneralSettings />
            <div className="flex justify-end">
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
} 