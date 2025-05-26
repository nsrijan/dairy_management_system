import React from 'react';
import { TenantSettings } from '../../types';

interface GeneralSettingsProps {
    settings?: Partial<TenantSettings>;
    onUpdate?: (settings: Partial<TenantSettings>) => void;
}

const GeneralSettings = ({ settings, onUpdate }: GeneralSettingsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Settings Section */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Timezone</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={settings?.generalSettings?.timezone}
                            onChange={(e) => onUpdate?.({
                                generalSettings: {
                                    ...settings?.generalSettings,
                                    timezone: e.target.value
                                }
                            })}
                        >
                            <option>UTC</option>
                            <option>America/New_York</option>
                            <option>Europe/London</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date Format</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={settings?.generalSettings?.dateFormat}
                            onChange={(e) => onUpdate?.({
                                generalSettings: {
                                    ...settings?.generalSettings,
                                    dateFormat: e.target.value
                                }
                            })}
                        >
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={settings?.contactInfo?.email}
                            onChange={(e) => onUpdate?.({
                                contactInfo: {
                                    ...settings?.contactInfo,
                                    email: e.target.value
                                }
                            })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={settings?.contactInfo?.phone}
                            onChange={(e) => onUpdate?.({
                                contactInfo: {
                                    ...settings?.contactInfo,
                                    phone: e.target.value
                                }
                            })}
                        />
                    </div>
                </div>
            </section>

            {/* Business Settings */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Business Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Business Hours</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={settings?.businessSettings?.businessHours}
                            onChange={(e) => onUpdate?.({
                                businessSettings: {
                                    ...settings?.businessSettings,
                                    businessHours: e.target.value
                                }
                            })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fiscal Year</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={settings?.businessSettings?.fiscalYear}
                            onChange={(e) => onUpdate?.({
                                businessSettings: {
                                    ...settings?.businessSettings,
                                    fiscalYear: e.target.value
                                }
                            })}
                        />
                    </div>
                </div>
            </section>

            {/* Customization */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Customization</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Theme</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={settings?.customization?.theme}
                            onChange={(e) => onUpdate?.({
                                customization: {
                                    ...settings?.customization,
                                    theme: e.target.value
                                }
                            })}
                        >
                            <option>Light</option>
                            <option>Dark</option>
                            <option>Custom</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                        <input
                            type="url"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            value={settings?.customization?.logoUrl}
                            onChange={(e) => onUpdate?.({
                                customization: {
                                    ...settings?.customization,
                                    logoUrl: e.target.value
                                }
                            })}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GeneralSettings; 