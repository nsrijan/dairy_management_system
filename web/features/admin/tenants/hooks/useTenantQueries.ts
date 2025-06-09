import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTenantById, updateTenant, deleteTenant, setupTenant, updateTenantAdminStatus, createTenantAdmin, CreateTenantAdminRequest } from '../services/tenantService';
import { createCompany, updateCompany, Company } from '../services/companyService';
import { TenantResponse, ModuleType } from '../types';

export const useTenantDetails = (token: string, tenantId: string) => {
    return useQuery({
        queryKey: ['tenant', tenantId],
        queryFn: () => getTenantById(token, tenantId),
        enabled: !!token && !!tenantId,
    });
};

export const useUpdateTenant = (token: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { id: string; tenant: Partial<TenantResponse> }) =>
            updateTenant(token, data.id, data.tenant),
        onSuccess: (_, variables) => {
            // Invalidate tenant queries
            queryClient.invalidateQueries({ queryKey: ['tenant', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
        },
    });
};

export const useDeleteTenant = (token: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tenantId: string) => deleteTenant(token, tenantId),
        onSuccess: (_, tenantId) => {
            // Invalidate tenant queries
            queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
        },
    });
};

export interface OnboardingData {
    tenant: {
        name: string;
        slug: string;
        currency: string;
        timezone: string;
        moduleType: ModuleType;
        isActive: boolean;
    };
    company: {
        name: string;
        description?: string;
        isActive: boolean;
    };
    admin: {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        username: string;
    };
}

export const useCreateTenant = (token: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: OnboardingData) => setupTenant(token, data),
        onSuccess: () => {
            // Invalidate tenants list query
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
        },
    });
};

export const useUpdateCompany = (token: string, tenantId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { companyId: string; company: Partial<Company> }) =>
            updateCompany(token, tenantId, data.companyId, data.company),
        onSuccess: () => {
            // Invalidate company queries
            queryClient.invalidateQueries({ queryKey: ['companies', tenantId] });
        },
    });
};

export const useUpdateAdmin = (token: string, tenantId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { adminId: string; admin: { active: boolean } }) =>
            updateTenantAdminStatus(token, tenantId, data.adminId, data.admin.active),
        onSuccess: () => {
            // Invalidate admin queries
            queryClient.invalidateQueries({ queryKey: ['admins', tenantId] });
        },
    });
};

export const useCreateAdmin = (token: string, tenantId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTenantAdminRequest) =>
            createTenantAdmin(token, tenantId, data),
        onSuccess: () => {
            // Invalidate admin queries
            queryClient.invalidateQueries({ queryKey: ['admins', tenantId] });
        },
    });
}; 