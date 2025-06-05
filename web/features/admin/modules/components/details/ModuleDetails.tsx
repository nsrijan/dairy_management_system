import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ModuleHeader } from './ModuleHeader';
import { ModuleStats } from './ModuleStats';
import { ModuleInfo } from './ModuleInfo';
import { ModuleRoles } from './ModuleRoles';
import { Module } from '../../types';

interface ModuleDetailsProps {
    module: Module;
}

export function ModuleDetails({ module }: ModuleDetailsProps) {
    return (
        <div className="p-6 max-w-[1200px] mx-auto">
            <ModuleHeader module={module} />
            <ModuleStats module={module} />

            <Tabs defaultValue="overview" className="mb-8">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                    <TabsTrigger value="tenants">Tenants</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="overview">
                        <ModuleInfo module={module} />
                    </TabsContent>
                    <TabsContent value="roles">
                        <ModuleRoles />
                    </TabsContent>
                    <TabsContent value="features">
                        <div className="text-sm text-gray-500">Features content coming soon...</div>
                    </TabsContent>
                    <TabsContent value="tenants">
                        <div className="text-sm text-gray-500">Tenants content coming soon...</div>
                    </TabsContent>
                    <TabsContent value="settings">
                        <div className="text-sm text-gray-500">Settings content coming soon...</div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
} 