import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/providers';
import { useToast } from '@/components/ui/use-toast';
import { companyService, adminCompanyService } from '@/lib/api';

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

// React Query Hooks with tenant context
export function useCompanies() {
    const { token } = useAuth();

    return useQuery({
        queryKey: ['companies'],
        queryFn: () => companyService.getAll(token!),
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useCreateCompany() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: CreateCompanyData) => adminCompanyService.create(data, token!),
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
        mutationFn: ({ id, data }: UpdateCompanyData) => adminCompanyService.update(id, data, token!),
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
        mutationFn: (id: string) => adminCompanyService.delete(id, token!),
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