import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/providers';
import { useToast } from '@/components/ui/use-toast';
import {
    companyService,
    adminCompanyService,
    Company,
    CreateCompanyRequest,
    UpdateCompanyRequest
} from '../services/companyService';

export interface UpdateCompanyData {
    id: string;
    data: UpdateCompanyRequest;
}

// React Query Hooks
export function useCompanies() {
    const { token } = useAuth();

    return useQuery({
        queryKey: ['companies'],
        queryFn: () => companyService.getCompanies(token!),
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useCreateCompany() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: CreateCompanyRequest) => adminCompanyService.createCompany(token!, data),
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
        mutationFn: ({ id, data }: UpdateCompanyData) => adminCompanyService.updateCompany(token!, id, data),
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
        mutationFn: (id: string) => adminCompanyService.deleteCompany(token!, id),
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