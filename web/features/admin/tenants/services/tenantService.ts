import { TenantResponse, TenantsListResponse, ModuleType } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_PATH = '/api/v1/tenants';

export interface TenantFormData {
    name: string;
    subdomain: string;
    moduleType: ModuleType;
    active: boolean;
    currency: string;
    timezone: string;
}

export interface CreateTenantRequest {
    name: string;
    slug: string;
    currency: string;
    timezone: string;
    moduleType: string;
    isActive: boolean;
}

export interface TenantAdminResponse {
    id: string;
    email: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTenantAdminRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    username: string;
}

export interface TenantOnboardingRequest {
    tenant: {
        name: string;
        slug: string;
        currency: string;
        timezone: string;
        moduleType: string;
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

/**
 * Fetches all tenants with pagination
 */
export async function getAllTenants(token: string, page = 0, size = 10): Promise<TenantsListResponse> {
    const endpoint = `${API_BASE_URL}${API_PATH}?page=${page}&size=${size}`;

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
            data: apiResponse.data || [],
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
export async function getTenantById(token: string, id: string): Promise<TenantResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch tenant');
    }

    const apiResponse = await response.json();
    return apiResponse.data;
}

/**
 * Creates a new tenant
 */
export async function createTenant(token: string, data: TenantFormData): Promise<TenantResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create tenant');
    }

    return response.json();
}

/**
 * Fetches tenant admins
 */
export async function getTenantAdmins(token: string, tenantId: string): Promise<TenantAdminResponse[]> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}/${tenantId}/admins`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch tenant admins');
    }

    return response.json();
}

/**
 * Creates a new tenant admin
 */
export async function createTenantAdmin(token: string, tenantId: string, data: CreateTenantAdminRequest): Promise<TenantAdminResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}/${tenantId}/admins`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create tenant admin');
    }

    return response.json();
}

/**
 * Updates an existing tenant
 */
export async function updateTenant(token: string, id: string, data: Partial<TenantFormData>): Promise<TenantResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update tenant');
    }

    return response.json();
}

/**
 * Updates tenant admin status
 */
export async function updateTenantAdminStatus(token: string, tenantId: string, adminId: string, active: boolean): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}/${tenantId}/admins/${adminId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update tenant admin status');
    }
}

/**
 * Deletes a tenant
 */
export async function deleteTenant(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete tenant');
    }
}

/**
 * Sets up a new tenant with company and admin
 */
export async function setupTenant(token: string, data: TenantOnboardingRequest): Promise<TenantAdminResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}/setup`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to setup tenant');
    }

    return response.json();
} 