/**
 * Tenant type definitions
 */

export enum ModuleType {
    DAIRY = 'DAIRY',
    POTTERY = 'POTTERY',
    GARMENTS = 'GARMENTS'
}

export interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    active: boolean;
    moduleType: ModuleType;
    currency?: string;
    timezone?: string;
    createdAt?: string;
    updatedAt?: string;
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

export interface TenantResponse {
    id: string;
    name: string;
    subdomain: string;
    active: boolean;
    moduleType: ModuleType;
    currency?: string;
    timezone?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TenantsListResponse {
    tenants: TenantResponse[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
} 