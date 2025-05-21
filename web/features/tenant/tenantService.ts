/**
 * Service for managing tenant-related API calls
 */

import { Tenant, TenantCreateRequest, TenantUpdateRequest, TenantsListResponse } from './types';

/**
 * Fetches all tenants
 */
export async function getAllTenants(token: string, page = 0, size = 10): Promise<TenantsListResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/admin/tenants?page=${page}&size=${size}`;

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

        return await response.json();
    } catch (error: any) {
        console.error('Error fetching tenants:', error);
        throw error;
    }
}

/**
 * Fetches a tenant by ID
 */
export async function getTenantById(token: string, tenantId: string): Promise<Tenant> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/admin/tenants/${tenantId}`;

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

        return await response.json();
    } catch (error: any) {
        console.error(`Error fetching tenant ${tenantId}:`, error);
        throw error;
    }
}

/**
 * Creates a new tenant
 */
export async function createTenant(token: string, tenantData: TenantCreateRequest): Promise<Tenant> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/admin/tenants`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(tenantData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create tenant');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error creating tenant:', error);
        throw error;
    }
}

/**
 * Updates an existing tenant
 */
export async function updateTenant(token: string, tenantId: string, tenantData: TenantUpdateRequest): Promise<Tenant> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/admin/tenants/${tenantId}`;

    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(tenantData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update tenant');
        }

        return await response.json();
    } catch (error: any) {
        console.error(`Error updating tenant ${tenantId}:`, error);
        throw error;
    }
}

/**
 * Deletes a tenant
 */
export async function deleteTenant(token: string, tenantId: string): Promise<void> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/admin/tenants/${tenantId}`;

    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete tenant');
        }
    } catch (error: any) {
        console.error(`Error deleting tenant ${tenantId}:`, error);
        throw error;
    }
}

/**
 * Activates or deactivates a tenant
 */
export async function changeTenantStatus(token: string, tenantId: string, active: boolean): Promise<Tenant> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/admin/tenants/${tenantId}/status`;

    try {
        const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ active })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to change tenant status');
        }

        return await response.json();
    } catch (error: any) {
        console.error(`Error changing tenant ${tenantId} status:`, error);
        throw error;
    }
} 