'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Building2, Plus, Search } from 'lucide-react';
import CompanyFormDialog from './CompanyFormDialog';
import { CompanyResponse } from '../../types';
import { CompanyCreateUpdateRequest } from '../../services/companyService';
import { Skeleton } from '@/components/ui/skeleton';

interface CompanyListProps {
    companies: CompanyResponse[];
    isLoading: boolean;
    onCreateCompany: (data: Omit<CompanyCreateUpdateRequest, 'tenantId'>) => Promise<void>;
    onUpdateCompany: (id: string, data: Omit<CompanyCreateUpdateRequest, 'tenantId'>) => Promise<void>;
    onDeleteCompany: (id: string) => Promise<void>;
}

export default function CompanyList({ companies, isLoading, onCreateCompany, onUpdateCompany, onDeleteCompany }: CompanyListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                    />
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                </Button>
            </div>

            {filteredCompanies.length === 0 ? (
                <Card className="p-6 text-center text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-2" />
                    <p>No companies found</p>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredCompanies.map((company) => (
                        <Card key={company.id} className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold">{company.name}</h3>
                                    {company.description && (
                                        <p className="text-gray-500">{company.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => onDeleteCompany(company.id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            // Handle edit
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <CompanyFormDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={onCreateCompany}
            />
        </div>
    );
} 