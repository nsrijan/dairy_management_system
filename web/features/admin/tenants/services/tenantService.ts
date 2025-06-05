import { TenantResponse, TenantsListResponse } from '../types';

export interface CreateTenantRequest {
    name: string;
    slug: string;
    currency: string;
    timezone: string;
    moduleType: string;
    isActive: boolean;
}

interface CreateTenantAdminRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

interface TenantAdminResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Fetches all tenants with pagination
 */
export async function getAllTenants(token: string, page = 0, size = 10): Promise<TenantsListResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants?page=${page}&size=${size}`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch tenants');
        }

        const apiResponse = await response.json();
        return {
            tenants: apiResponse.data || [],
            totalItems: apiResponse.totalItems || apiResponse.data?.length || 0,
            totalPages: apiResponse.totalPages || 1,
            currentPage: apiResponse.currentPage || page
        };
    } catch (error: any) {
        console.error('Error fetching tenants:', error);
        throw error;
    }
}

/**
 * Fetches a tenant by ID
 */
export async function getTenantById(token: string, tenantId: string): Promise<TenantResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants/${tenantId}`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch tenant');
        }

        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error: any) {
        console.error('Error fetching tenant:', error);
        throw error;
    }
}

/**
 * Creates a new tenant
 */
export async function createTenant(token: string, data: CreateTenantRequest): Promise<TenantResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create tenant');
        }

        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error: any) {
        console.error('Error creating tenant:', error);
        throw error;
    }
}

/**
 * Creates a new tenant admin
 */
export async function createTenantAdmin(token: string, tenantId: string, data: CreateTenantAdminRequest): Promise<TenantAdminResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants/${tenantId}/admins`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create tenant admin');
        }

        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error: any) {
        console.error('Error creating tenant admin:', error);
        throw error;
    }
} 