import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/providers';
import { useToast } from '@/components/ui/use-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Company {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface CreateCompanyData {
    name: string;
    description?: string;
    isActive: boolean;
}

export interface UpdateCompanyData {
    id: string;
    data: CreateCompanyData;
}

// API Functions
async function fetchCompanies(token: string): Promise<Company[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/companies`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch companies');
    }

    const result = await response.json();
    return result.data || [];
}

async function createCompany(token: string, data: CreateCompanyData): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/companies`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create company');
    }

    const result = await response.json();
    return result.data;
}

async function updateCompany(token: string, { id, data }: UpdateCompanyData): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/companies/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update company');
    }

    const result = await response.json();
    return result.data;
}

async function deleteCompany(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/companies/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete company');
    }
}

// React Query Hooks
export function useCompanies() {
    const { token } = useAuth();

    return useQuery({
        queryKey: ['companies'],
        queryFn: () => fetchCompanies(token!),
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useCreateCompany() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: CreateCompanyData) => createCompany(token!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            toast({
                title: 'Success',
                description: 'Company created successfully',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateCompany() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: UpdateCompanyData) => updateCompany(token!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            toast({
                title: 'Success',
                description: 'Company updated successfully',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
}

export function useDeleteCompany() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: string) => deleteCompany(token!, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            toast({
                title: 'Success',
                description: 'Company deleted successfully',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
} 