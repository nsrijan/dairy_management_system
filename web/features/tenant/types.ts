/**
 * Tenant type definitions
 */

export interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface TenantCreateRequest {
    name: string;
    subdomain: string;
}

export interface TenantUpdateRequest {
    name?: string;
    subdomain?: string;
    active?: boolean;
}

export interface TenantResponse {
    id: string;
    name: string;
    subdomain: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TenantsListResponse {
    tenants: TenantResponse[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
} 