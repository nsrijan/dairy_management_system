'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CompanyResponse } from '../../types';
import { createCompany, getCompanies, updateCompany, deleteCompany } from '../../services/companyService';
import { CompanyStatsPanel } from './panels/CompanyStatsPanel';
import { CompanyListPanel } from './panels/CompanyListPanel';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface CompanyContentProps {
    tenantId: string;
    token: string;
}

export function CompanyContent({ tenantId, token }: CompanyContentProps) {
    const [companies, setCompanies] = useState<CompanyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchCompanies = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getCompanies(token, tenantId);
            setCompanies(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch companies');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch companies. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [tenantId, token]);

    const handleCreateCompany = async (data: { name: string; description?: string; isActive: boolean }) => {
        try {
            await createCompany(token, tenantId, data);
            toast({
                title: "Success",
                description: "Company created successfully.",
            });
            await fetchCompanies();
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create company. Please try again.",
            });
            throw err;
        }
    };

    const handleUpdateCompany = async (id: string, data: { name: string; description?: string; isActive: boolean }) => {
        try {
            await updateCompany(token, id, {
                ...data,
                tenantId
            });
            toast({
                title: "Success",
                description: "Company updated successfully.",
            });
            await fetchCompanies();
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update company. Please try again.",
            });
            throw err;
        }
    };

    const handleDeleteCompany = async (id: string) => {
        try {
            await deleteCompany(token, id);
            toast({
                title: "Success",
                description: "Company deleted successfully.",
            });
            await fetchCompanies();
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete company. Please try again.",
            });
            throw err;
        }
    };

    if (isLoading) {
        return <div className="p-6">Loading companies...</div>;
    }

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <CompanyStatsPanel companies={companies} />

            <CompanyListPanel
                companies={companies}
                onCreateCompany={handleCreateCompany}
                onUpdateCompany={handleUpdateCompany}
                onDeleteCompany={handleDeleteCompany}
            />
        </div>
    );
}
