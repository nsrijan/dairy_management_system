'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CompanyFormDialog } from './CompanyFormDialog';
import { CompanyList } from './CompanyList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Company, createCompany, getCompanies, getCompaniesWithAdminCount, updateCompanyStatus } from '../../services/companyService';
import { CompanyWithAdminCount } from '../../services/companyService';

interface CompanyContentProps {
    tenantId: string;
    token: string;
}

export function CompanyContent({ tenantId, token }: CompanyContentProps) {
    const [companies, setCompanies] = useState<CompanyWithAdminCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const loadCompanies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCompaniesWithAdminCount(token, tenantId);
            setCompanies(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load companies';
            setError(message);
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [tenantId, token, toast]);

    useEffect(() => {
        loadCompanies();
    }, [loadCompanies]);

    const handleCreateCompany = async (data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            setLoading(true);
            await createCompany(token, tenantId, data);
            toast({
                title: 'Success',
                description: 'Company created successfully',
            });
            await loadCompanies();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create company';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (companyId: string, active: boolean) => {
        try {
            await updateCompanyStatus(token, tenantId, companyId, active);
            toast({
                title: 'Success',
                description: 'Company status updated successfully',
            });
            await loadCompanies();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update company status';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold">Company Management</h2>
                <CompanyFormDialog
                    onSubmit={handleCreateCompany}
                    isLoading={loading}
                    error={error}
                />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <CompanyList
                companies={companies}
                onStatusChange={handleStatusChange}
                isLoading={loading}
            />
        </div>
    );
} 