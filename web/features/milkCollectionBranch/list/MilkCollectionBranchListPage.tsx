'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Map,
    Search,
    Plus,
    Filter,
    ArrowUpRight,
    ArrowUp,
    ArrowDown,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { milkCollectionBranchData } from '../data'; // Import data from shared location

export default function MilkCollectionBranchListPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter Milk Collection Branches based on search query and status filter
    const filteredMilkCollectionBranches = milkCollectionBranchData.filter(mcb => {
        const matchesSearch = mcb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mcb.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || mcb.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const navigateToMilkCollectionBranch = (id: string) => {
        router.push(`/features/milkCollectionBranch/details/${id}`);
    };

    return (
        <div className="p-6 space-y-6 bg-[#f8fafc] dark:bg-gray-900">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Milk Collection Branches</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor all your milk collection branches</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        asChild
                        className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
                    >
                        <Link href="/companies">
                            <Plus className="mr-2 h-4 w-4" /> Add New Branch
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search branches by name or location..."
                        className="w-full pl-9 bg-white dark:bg-gray-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="min-w-[120px]">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                            All Branches
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                            Active Only
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('maintenance')}>
                            Under Maintenance
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Milk Collection Branch Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMilkCollectionBranches.map((mcb) => (
                    <Card
                        key={mcb.id}
                        className="overflow-hidden border-none shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                        onClick={() => navigateToMilkCollectionBranch(mcb.id)}
                    >
                        <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">{mcb.name}</CardTitle>
                                        <Badge
                                            className={
                                                mcb.status === 'active'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400'
                                            }
                                        >
                                            {mcb.status === 'active' ? 'Active' : 'Maintenance'}
                                        </Badge>
                                    </div>
                                    <CardDescription className="mt-1">
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <Map className="h-3.5 w-3.5 mr-1" /> {mcb.location}
                                        </div>
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/features/milkCollectionBranch/settings/${mcb.id}`);
                                        }}>
                                            Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle deactivate action
                                        }}>
                                            {mcb.status === 'active' ? 'Set to Maintenance' : 'Set to Active'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 bg-white dark:bg-gray-800">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Today's Collection</p>
                                    <div className="flex items-center mt-1">
                                        <p className="text-lg font-bold text-gray-800 dark:text-white">{mcb.todaysCollection} L</p>
                                        <div className={`flex items-center ml-2 text-xs ${mcb.collectionTrend === 'up'
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {mcb.collectionTrend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Active Farmers</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">{mcb.activeFarmers}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Avg. Quality</p>
                                    <div className="flex items-center mt-1">
                                        <Badge className={`
                      ${mcb.avgQuality === 'A'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400'
                                            }
                    `}>
                                            Grade {mcb.avgQuality}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{mcb.lastUpdated}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-0">
                            <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/40 flex justify-center hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors">
                                <span className="text-sm font-medium text-teal-600 dark:text-teal-400 flex items-center">
                                    View Dashboard <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                                </span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredMilkCollectionBranches.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                    <Map className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No branches found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchQuery
                            ? `No branches matching "${searchQuery}" were found.`
                            : "There are no milk collection branches that match your filters."}
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
} 