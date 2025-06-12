'use client';

import { useState } from 'react';
import { Building2, Plus, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCompanies } from '../../hooks/useCompanies';
import { CompanyFormDialog } from './CompanyFormDialog';
import { DeleteCompanyDialog } from './DeleteCompanyDialog';
import { useTenantCompanyStore } from '../../store/tenantCompanyStore';

export function CompanyManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const { companies, isLoading, error } = useCompanies();
    const {
        isCreateDialogOpen,
        setCreateDialogOpen,
        isEditDialogOpen,
        setEditDialogOpen,
        isDeleteDialogOpen,
        setDeleteDialogOpen,
        selectedCompany,
        setSelectedCompany
    } = useTenantCompanyStore();

    // Filter companies based on search term
    const filteredCompanies = companies?.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleEditCompany = (company: any) => {
        setSelectedCompany(company);
        setEditDialogOpen(true);
    };

    const handleDeleteCompany = (company: any) => {
        setSelectedCompany(company);
        setDeleteDialogOpen(true);
    };

    if (error) {
        return (
            <div className="p-6">
                <Card className="p-6 text-center">
                    <p className="text-red-600 dark:text-red-400">Error loading companies: {error.message}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        Company Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage companies within your organization
                    </p>
                </div>

                <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Company
                </Button>
            </div>

            {/* Search and Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </Card>

            {/* Companies Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        </Card>
                    ))}
                </div>
            ) : filteredCompanies.length === 0 ? (
                <Card className="p-12 text-center">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {searchTerm ? 'No companies found' : 'No companies yet'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Get started by creating your first company'
                        }
                    </p>
                    {!searchTerm && (
                        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Company
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => (
                        <Card key={company.id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {company.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                        {company.description || 'No description provided'}
                                    </p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDeleteCompany(company)}
                                            className="text-red-600 dark:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-between">
                                <Badge
                                    variant={company.isActive ? "default" : "secondary"}
                                    className={company.isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                                >
                                    {company.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <span className="text-xs text-gray-400">
                                    Created {new Date(company.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <CompanyFormDialog
                open={isCreateDialogOpen}
                onOpenChange={setCreateDialogOpen}
                mode="create"
            />

            <CompanyFormDialog
                open={isEditDialogOpen}
                onOpenChange={setEditDialogOpen}
                mode="edit"
                company={selectedCompany}
            />

            <DeleteCompanyDialog
                open={isDeleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                company={selectedCompany}
            />
        </div>
    );
} 