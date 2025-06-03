'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CompanyResponse } from '../../../types';
import { CompanyCard } from '../widgets/CompanyCard';
import { CompanySearch } from '../widgets/CompanySearch';
import { CompanyForm } from '../widgets/CompanyForm';

interface CompanyListPanelProps {
    companies: CompanyResponse[];
    onCreateCompany: (data: { name: string; description?: string; isActive: boolean }) => Promise<void>;
    onUpdateCompany: (id: string, data: { name: string; description?: string; isActive: boolean }) => Promise<void>;
    onDeleteCompany: (id: string) => Promise<void>;
}

export function CompanyListPanel({ companies, onCreateCompany, onUpdateCompany, onDeleteCompany }: CompanyListPanelProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingCompany, setEditingCompany] = useState<CompanyResponse | null>(null);

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex-1 max-w-sm">
                    <CompanySearch
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </div>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                </Button>
            </div>

            {/* Company Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map(company => (
                    <CompanyCard
                        key={company.id}
                        company={company}
                        onEdit={setEditingCompany}
                        onDelete={onDeleteCompany}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredCompanies.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? 'Try adjusting your search term.' : 'Get started by creating a new company.'}
                    </p>
                    {!searchTerm && (
                        <div className="mt-6">
                            <Button
                                onClick={() => setShowCreateDialog(true)}
                                className="bg-purple-500 hover:bg-purple-600 text-white"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Company
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog
                open={showCreateDialog || !!editingCompany}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowCreateDialog(false);
                        setEditingCompany(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <CompanyForm
                        company={editingCompany}
                        onSubmit={async (data) => {
                            if (editingCompany) {
                                await onUpdateCompany(editingCompany.id, data);
                            } else {
                                await onCreateCompany(data);
                            }
                            setShowCreateDialog(false);
                            setEditingCompany(null);
                        }}
                        onCancel={() => {
                            setShowCreateDialog(false);
                            setEditingCompany(null);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
} 