import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TenantResponse } from '../types';
import {
    getAllTenants,
    getTenantById,
    createTenant,
    updateTenant,
    deleteTenant,
    CreateTenantData,
    UpdateTenantData
} from '../services/tenantService';

const QUERY_KEYS = {
    tenants: ['tenants'] as const,
    tenant: (id: string) => ['tenant', id] as const,
};

export function useTenants(token: string) {
    return useQuery({
        queryKey: QUERY_KEYS.tenants,
        queryFn: () => getAllTenants(token),
        enabled: !!token,
    });
}

export function useTenant(token: string, id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.tenant(id),
        queryFn: () => getTenantById(token, id),
        enabled: !!token && !!id,
    });
}

export function useCreateTenant(token: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTenantData) => createTenant(token, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tenants });
            console.log('Tenant created successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to create tenant:', error.message);
        },
    });
}

export function useUpdateTenant(token: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTenantData }) =>
            updateTenant(token, id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tenants });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tenant(id) });
            console.log('Tenant updated successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to update tenant:', error.message);
        },
    });
}

export function useDeleteTenant(token: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTenant(token, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tenants });
            console.log('Tenant deleted successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to delete tenant:', error.message);
        },
    });
} 