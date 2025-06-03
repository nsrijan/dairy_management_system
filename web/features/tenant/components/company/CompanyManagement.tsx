'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CompanyResponse } from '../../types';
import { CompanyCreateUpdateRequest, createCompany, getCompanies, updateCompany, deleteCompany } from '../../services/companyService';
import CompanyList from './CompanyList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface CompanyManagementProps {
    token: string;
    tenantId: string;
}

export default function CompanyManagement({ token, tenantId }: CompanyManagementProps) {
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
    }, [token, tenantId]);

    const handleCreateCompany = async (data: Omit<CompanyCreateUpdateRequest, 'tenantId'>) => {
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

    const handleUpdateCompany = async (id: string, data: Omit<CompanyCreateUpdateRequest, 'tenantId'>) => {
        try {
            await updateCompany(token, tenantId, id, data);
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
            await deleteCompany(token, tenantId, id);
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

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <CompanyList
            companies={companies}
            isLoading={isLoading}
            onCreateCompany={handleCreateCompany}
            onUpdateCompany={handleUpdateCompany}
            onDeleteCompany={handleDeleteCompany}
        />
    );
} 