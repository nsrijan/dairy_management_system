'use client';

/**
 * Tenant type definitions
 */

export enum ModuleType {
    DAIRY = 'DAIRY',
    POTTERY = 'POTTERY',
    GARMENTS = 'GARMENTS'
}

export interface TenantResponse {
    id: string;
    name: string;
    subdomain: string;
    active: boolean;
    moduleType: ModuleType;
    currency: string;
    timezone: string;
    createdAt: string;
    updatedAt: string;
}

export interface TenantsListResponse {
    tenants: TenantResponse[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface TenantCreateRequest {
    name: string;
    subdomain: string;
    moduleType: ModuleType;
    currency: string;
    timezone: string;
}

export interface TenantUpdateRequest {
    name?: string;
    subdomain?: string;
    active?: boolean;
    moduleType?: ModuleType;
    currency?: string;
    timezone?: string;
}

export interface CreateTenantAdminRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
}

export interface TenantAdminResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TenantUserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    active: boolean;
    moduleType: ModuleType;
    timezone: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
}

export interface CompanyResponse {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    tenantId: string;
    createdAt: string;
    createdBy?: string;
    updatedAt: string;
    updatedBy?: string;
} 