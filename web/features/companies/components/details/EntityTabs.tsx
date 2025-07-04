'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    MapPin,
    Building2,
    Store,
    Users,
    Phone,
    Calendar,
    Droplets,
    ExternalLink,
    User,
    Mail,
    Clock,
    Plus
} from 'lucide-react';
import Link from 'next/link';
import { MilkCollectionBranch, Factory, Shop, CompanyUser } from '../../types';
import { AddMCBModal } from './AddMCBModal';

interface EntityTabsProps {
    companyId: string;
}

// Mock data - replace with actual API calls
const mockMCBs: MilkCollectionBranch[] = [
    {
        id: 'mcb-1',
        name: 'Central Collection Hub',
        location: 'Mumbai, Maharashtra',
        companyId: 'comp-1',
        managerId: 'user-1',
        chillVatCount: 4,
        isActive: true,
        contactNumber: '+91-9876543210',
        capacity: 5000,
        currentStock: 3200,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    }
];

const mockFactories: Factory[] = [
    {
        id: 'factory-1',
        name: 'Primary Processing Plant',
        location: 'Pune, Maharashtra',
        companyId: 'comp-1',
        managerId: 'user-2',
        productionCapacity: 10000,
        currentProduction: 7500,
        isActive: true,
        factoryType: 'PROCESSING',
        contactNumber: '+91-9876543211',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z'
    }
];

const mockShops: Shop[] = [
    {
        id: 'shop-1',
        name: 'Fresh Dairy Store - Bandra',
        location: 'Bandra, Mumbai',
        companyId: 'comp-1',
        managerId: 'user-3',
        dailySales: 25000,
        isActive: true,
        shopType: 'RETAIL',
        contactNumber: '+91-9876543212',
        openingHours: '6:00 AM - 10:00 PM',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
    }
];

const mockUsers: CompanyUser[] = [
    {
        id: 'user-1',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@company.com',
        role: 'MCB_MANAGER',
        isActive: true,
        assignedEntity: 'mcb-1',
        assignedEntityType: 'MCB',
        lastLoginAt: '2024-01-25T08:30:00Z',
        createdAt: '2024-01-15T10:00:00Z'
    }
];

export function EntityTabs({ companyId }: EntityTabsProps) {
    const [mcbList, setMcbList] = useState<MilkCollectionBranch[]>(mockMCBs);

    const handleMCBAdded = (newMCB: MilkCollectionBranch) => {
        setMcbList(prev => [...prev, newMCB]);
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="mcbs" className="w-full">
                {/* Enhanced Tab List */}
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="grid w-auto grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        <TabsTrigger
                            value="mcbs"
                            className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                        >
                            <MapPin className="h-4 w-4" />
                            <span className="hidden sm:inline">MCBs</span>
                            <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {mcbList.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger
                            value="factories"
                            className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                        >
                            <Building2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Factories</span>
                            <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {mockFactories.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger
                            value="shops"
                            className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                        >
                            <Store className="h-4 w-4" />
                            <span className="hidden sm:inline">Shops</span>
                            <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {mockShops.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                        >
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">Users</span>
                            <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {mockUsers.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* MCBs Tab */}
                <TabsContent value="mcbs" className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                        Milk Collection Branches
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Manage your milk collection centers and chill vats
                                    </p>
                                </div>
                                <AddMCBModal companyId={companyId} onSuccess={handleMCBAdded} />
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {mcbList.map((mcb) => (
                                    <div key={mcb.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {mcb.name}
                                                    </h4>
                                                    <Badge variant={mcb.isActive ? "default" : "secondary"} className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                                        {mcb.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <MapPin className="h-4 w-4 text-gray-500" />
                                                        <span>{mcb.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Droplets className="h-4 w-4 text-blue-500" />
                                                        <span>{mcb.chillVatCount} Chill Vats</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Phone className="h-4 w-4 text-gray-500" />
                                                        <span>{mcb.contactNumber}</span>
                                                    </div>
                                                    <div className="text-gray-600 dark:text-gray-400">
                                                        <span className="text-gray-500">Stock:</span>
                                                        <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                                            {mcb.currentStock?.toLocaleString()}L / {mcb.capacity?.toLocaleString()}L
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button asChild variant="outline" size="sm" className="ml-4 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300">
                                                <Link href={`/mcb/${mcb.id}`}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {mcbList.length === 0 && (
                                    <div className="text-center py-12">
                                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No MCBs found</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by adding your first milk collection branch.</p>
                                        <AddMCBModal companyId={companyId} onSuccess={handleMCBAdded} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Factories Tab */}
                <TabsContent value="factories" className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-blue-600" />
                                        Factories
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Processing and manufacturing facilities
                                    </p>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Factory
                                </Button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {mockFactories.map((factory) => (
                                    <div key={factory.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {factory.name}
                                                    </h4>
                                                    <Badge variant={factory.isActive ? "default" : "secondary"} className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                                        {factory.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                        {factory.factoryType}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <MapPin className="h-4 w-4 text-gray-500" />
                                                        <span>{factory.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Building2 className="h-4 w-4 text-blue-500" />
                                                        <span>Capacity: {factory.productionCapacity.toLocaleString()}L/day</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Phone className="h-4 w-4 text-gray-500" />
                                                        <span>{factory.contactNumber}</span>
                                                    </div>
                                                    <div className="text-gray-600 dark:text-gray-400">
                                                        <span className="text-gray-500">Production:</span>
                                                        <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                                            {factory.currentProduction?.toLocaleString()}L/day
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button asChild variant="outline" size="sm" className="ml-4 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300">
                                                <Link href={`/factory/${factory.id}`}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Shops Tab */}
                <TabsContent value="shops" className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Store className="h-5 w-5 text-blue-600" />
                                        Shops & Outlets
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Retail stores and distribution points
                                    </p>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Shop
                                </Button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {mockShops.map((shop) => (
                                    <div key={shop.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {shop.name}
                                                    </h4>
                                                    <Badge variant={shop.isActive ? "default" : "secondary"} className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                                        {shop.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                        {shop.shopType}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <MapPin className="h-4 w-4 text-gray-500" />
                                                        <span>{shop.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Phone className="h-4 w-4 text-gray-500" />
                                                        <span>{shop.contactNumber}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Clock className="h-4 w-4 text-gray-500" />
                                                        <span>{shop.openingHours}</span>
                                                    </div>
                                                    <div className="text-gray-600 dark:text-gray-400">
                                                        <span className="text-gray-500">Daily Sales:</span>
                                                        <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                                            ₹{shop.dailySales?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button asChild variant="outline" size="sm" className="ml-4 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300">
                                                <Link href={`/shop/${shop.id}`}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-600" />
                                        Company Users
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Manage staff and their assignments
                                    </p>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add User
                                </Button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {mockUsers.map((user) => (
                                    <div key={user.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-700">
                                                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-sm font-semibold">
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                            {user.firstName} {user.lastName}
                                                        </h4>
                                                        <Badge variant={user.isActive ? "default" : "secondary"} className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                                            {user.isActive ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                            {user.role.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <Mail className="h-4 w-4 text-gray-500" />
                                                            <span>{user.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <User className="h-4 w-4 text-gray-500" />
                                                            <span>Assigned to: {user.assignedEntityType || 'None'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <Clock className="h-4 w-4 text-gray-500" />
                                                            <span>
                                                                Last login: {user.lastLoginAt ?
                                                                    new Date(user.lastLoginAt).toLocaleDateString() :
                                                                    'Never'
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="ml-4 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300">
                                                <User className="h-4 w-4 mr-2" />
                                                View Profile
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 