'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CompanyList } from './CompanyList';
import { CompanyFormDialog } from './CompanyFormDialog';
import { DeleteCompanyDialog } from './DeleteCompanyDialog';
import { useCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany } from '../hooks/useCompanies';
import { Company } from '../types';

export function CompanyManagement() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);

    const { data: companies, isLoading } = useCompanies();
    const createCompanyMutation = useCreateCompany();
    const updateCompanyMutation = useUpdateCompany();
    const deleteCompanyMutation = useDeleteCompany();

    const handleCreate = async (data: { name: string; description?: string; isActive: boolean }) => {
        await createCompanyMutation.mutateAsync(data);
        setIsCreateDialogOpen(false);
    };

    const handleUpdate = async (id: string, data: { name: string; description?: string; isActive: boolean }) => {
        await updateCompanyMutation.mutateAsync({ id, data });
        setEditingCompany(null);
    };

    const handleDelete = async (id: string) => {
        await deleteCompanyMutation.mutateAsync(id);
        setDeletingCompany(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Company Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your organization's companies and their settings.
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                </Button>
            </div>

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Companies ({companies?.length || 0})
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            View and manage all companies in your tenant.
                        </p>
                    </div>

                    <CompanyList
                        companies={companies || []}
                        onEdit={setEditingCompany}
                        onDelete={setDeletingCompany}
                    />
                </Card>
            </div>

            {/* Create Dialog */}
            <CompanyFormDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreate}
                isLoading={createCompanyMutation.isPending}
                title="Create New Company"
                description="Add a new company to your organization."
            />

            {/* Edit Dialog */}
            {editingCompany && (
                <CompanyFormDialog
                    open={true}
                    onOpenChange={(open) => !open && setEditingCompany(null)}
                    onSubmit={(data) => handleUpdate(editingCompany.id, data)}
                    isLoading={updateCompanyMutation.isPending}
                    title="Edit Company"
                    description="Update company information."
                    initialData={{
                        name: editingCompany.name,
                        description: editingCompany.description || '',
                        isActive: editingCompany.isActive,
                    }}
                />
            )}

            {/* Delete Dialog */}
            {deletingCompany && (
                <DeleteCompanyDialog
                    open={true}
                    onOpenChange={(open) => !open && setDeletingCompany(null)}
                    onConfirm={() => handleDelete(deletingCompany.id)}
                    isLoading={deleteCompanyMutation.isPending}
                    companyName={deletingCompany.name}
                />
            )}
        </div>
    );
} 