'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Settings, Palette, Globe, Bell } from 'lucide-react';
import GeneralSettingsForm from './GeneralSettingsForm';
import BrandingSettingsForm from './BrandingSettingsForm';
import LocalizationSettingsForm from './LocalizationSettingsForm';
import NotificationSettingsForm from './NotificationSettingsForm';

export default function TenantSettingsDashboard() {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tenant Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your tenant's settings and preferences.</p>
            </div>

            <Card className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-0 h-auto">
                        <TabsTrigger
                            value="general"
                            className="flex items-center px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 dark:data-[state=active]:border-indigo-400 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            General
                        </TabsTrigger>
                        <TabsTrigger
                            value="branding"
                            className="flex items-center px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 dark:data-[state=active]:border-indigo-400 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                        >
                            <Palette className="h-4 w-4 mr-2" />
                            Branding
                        </TabsTrigger>
                        <TabsTrigger
                            value="localization"
                            className="flex items-center px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 dark:data-[state=active]:border-indigo-400 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                        >
                            <Globe className="h-4 w-4 mr-2" />
                            Localization
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="flex items-center px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 dark:data-[state=active]:border-indigo-400 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                        >
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications
                        </TabsTrigger>
                    </TabsList>

                    <div className="p-6">
                        <TabsContent value="general" className="mt-0">
                            <GeneralSettingsForm />
                        </TabsContent>
                        <TabsContent value="branding" className="mt-0">
                            <BrandingSettingsForm />
                        </TabsContent>
                        <TabsContent value="localization" className="mt-0">
                            <LocalizationSettingsForm />
                        </TabsContent>
                        <TabsContent value="notifications" className="mt-0">
                            <NotificationSettingsForm />
                        </TabsContent>
                    </div>
                </Tabs>
            </Card>
        </div>
    );
} 