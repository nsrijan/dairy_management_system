'use client';

/**
 * Service for managing tenant-related API calls
 */

import { Tenant, TenantCreateRequest, TenantUpdateRequest, TenantsListResponse, ModuleType, TenantResponse, TenantUserResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Mock data for development
const MOCK_TENANTS = [
    {
        id: "t1",
        name: "Green Valley Dairy",
        subdomain: "greenvalley",
        active: true,
        moduleType: ModuleType.DAIRY,
        currency: "INR",
        timezone: "Asia/Kolkata",
        createdAt: "2023-03-15T10:30:00Z",
        updatedAt: "2023-05-20T14:20:00Z"
    },
    {
        id: "t2",
        name: "Artisan Pottery Co",
        subdomain: "artisanpottery",
        active: true,
        moduleType: ModuleType.POTTERY,
        currency: "USD",
        timezone: "America/New_York",
        createdAt: "2023-04-10T09:15:00Z",
        updatedAt: "2023-05-18T11:45:00Z"
    },
    {
        id: "t3",
        name: "Highland Garments",
        subdomain: "highland",
        active: true,
        moduleType: ModuleType.GARMENTS,
        currency: "NPR",
        timezone: "Asia/Kathmandu",
        createdAt: "2023-02-20T08:00:00Z",
        updatedAt: "2023-05-15T16:30:00Z"
    },
    {
        id: "t4",
        name: "Organic Dairy Farm",
        subdomain: "organic",
        active: false,
        moduleType: ModuleType.DAIRY,
        currency: "INR",
        timezone: "Asia/Kolkata",
        createdAt: "2023-01-05T11:20:00Z",
        updatedAt: "2023-05-01T10:10:00Z"
    },
    {
        id: "t5",
        name: "Traditional Pottery",
        subdomain: "traditional",
        active: true,
        moduleType: ModuleType.POTTERY,
        currency: "USD",
        timezone: "America/New_York",
        createdAt: "2023-03-25T13:40:00Z",
        updatedAt: "2023-05-12T09:25:00Z"
    },
    {
        id: "t6",
        name: "Premium Garments",
        subdomain: "premium",
        active: true,
        moduleType: ModuleType.GARMENTS,
        currency: "NPR",
        timezone: "Asia/Kathmandu",
        createdAt: "2023-04-01T15:10:00Z",
        updatedAt: "2023-05-10T14:15:00Z"
    },
    {
        id: "t7",
        name: "Local Dairy Co-op",
        subdomain: "localcoop",
        active: true,
        moduleType: ModuleType.DAIRY,
        currency: "INR",
        timezone: "Asia/Kolkata",
        createdAt: "2023-02-10T09:50:00Z",
        updatedAt: "2023-05-05T11:30:00Z"
    },
    {
        id: "t8",
        name: "Clay Crafts",
        subdomain: "claycrafts",
        active: false,
        moduleType: ModuleType.POTTERY,
        currency: "USD",
        timezone: "America/New_York",
        createdAt: "2023-03-05T10:20:00Z",
        updatedAt: "2023-04-28T15:45:00Z"
    },
    {
        id: "t9",
        name: "Fashion Forward",
        subdomain: "fashionforward",
        active: true,
        moduleType: ModuleType.GARMENTS,
        currency: "NPR",
        timezone: "Asia/Kathmandu",
        createdAt: "2023-01-15T14:30:00Z",
        updatedAt: "2023-04-25T09:10:00Z"
    },
    {
        id: "t10",
        name: "Mountain View Dairy",
        subdomain: "mountainview",
        active: true,
        moduleType: ModuleType.DAIRY,
        currency: "INR",
        timezone: "Asia/Kolkata",
        createdAt: "2023-04-20T08:45:00Z",
        updatedAt: "2023-05-22T10:50:00Z"
    },
    {
        id: "t11",
        name: "Ceramic Designs",
        subdomain: "ceramic",
        active: true,
        moduleType: ModuleType.POTTERY,
        currency: "USD",
        timezone: "America/New_York",
        createdAt: "2023-02-25T11:15:00Z",
        updatedAt: "2023-04-15T13:20:00Z"
    },
    {
        id: "t12",
        name: "Elite Clothing",
        subdomain: "elite",
        active: true,
        moduleType: ModuleType.GARMENTS,
        currency: "NPR",
        timezone: "Asia/Kathmandu",
        createdAt: "2023-03-10T09:00:00Z",
        updatedAt: "2023-05-08T16:15:00Z"
    }
];

// Mock data for tenant users
const MOCK_TENANT_USERS = [
    {
        id: "u1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        username: "johndoe",
        active: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
    },
    {
        id: "u2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        username: "janesmith",
        active: true,
        createdAt: "2024-01-16T11:20:00Z",
        updatedAt: "2024-01-16T11:20:00Z"
    },
    {
        id: "u3",
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.johnson@example.com",
        username: "mikej",
        active: false,
        createdAt: "2024-01-17T09:15:00Z",
        updatedAt: "2024-01-17T09:15:00Z"
    },
    {
        id: "u4",
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.w@example.com",
        username: "sarahw",
        active: true,
        createdAt: "2024-01-18T14:45:00Z",
        updatedAt: "2024-01-18T14:45:00Z"
    }
];

interface CreateTenantAdminRequest {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

interface TenantAdminResponse {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
}

interface TenantUserAggregationResponse {
    admins: TenantAdminResponse[];
    users: TenantUserResponse[];
    totalCount: number;
    adminCount: number;
    userCount: number;
}

/**
 * Fetches all tenants
 */
export async function getAllTenants(token: string, page = 0, size = 10): Promise<TenantsListResponse> {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (useMockData) {
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedTenants = MOCK_TENANTS.slice(startIndex, endIndex);

        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            tenants: paginatedTenants,
            totalItems: MOCK_TENANTS.length,
            totalPages: Math.ceil(MOCK_TENANTS.length / size),
            currentPage: page
        };
    }

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
export async function getTenantById(token: string, tenantId: string): Promise<Tenant> {
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
        console.error(`Error fetching tenant ${tenantId}:`, error);
        throw error;
    }
}

/**
 * Creates a new tenant
 */
export async function createTenant(token: string, tenant: TenantCreateRequest): Promise<Tenant> {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newTenant = {
            id: `t${MOCK_TENANTS.length + 1}`,
            name: tenant.name,
            subdomain: tenant.subdomain,
            moduleType: tenant.moduleType,
            active: true,
            currency: tenant.currency,
            timezone: tenant.timezone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return newTenant;
    }

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
            body: JSON.stringify(tenant)
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
 * Updates an existing tenant
 */
export async function updateTenant(token: string, tenantId: string, tenantData: TenantUpdateRequest): Promise<Tenant> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants/${tenantId}`;

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

        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error: any) {
        console.error(`Error updating tenant ${tenantId}:`, error);
        throw error;
    }
}

/**
 * Deletes a tenant
 */
export async function deleteTenant(token: string, tenantId: string): Promise<void> {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants/${tenantId}`;

    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete tenant');
        }
    } catch (error: any) {
        console.error('Error deleting tenant:', error);
        throw error;
    }
}

/**
 * Activates or deactivates a tenant
 */
export async function changeTenantStatus(token: string, tenantId: string, active: boolean): Promise<Tenant> {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 600));

        const mockTenant = MOCK_TENANTS.find(t => t.id === tenantId);
        if (mockTenant) {
            return { ...mockTenant, active };
        }
        throw new Error('Tenant not found');
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants/${tenantId}/status`;

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
            throw new Error(errorData.message || 'Failed to update tenant status');
        }

        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error: any) {
        console.error('Error updating tenant status:', error);
        throw error;
    }
}

/**
 * Creates a new tenant admin
 */
export async function createTenantAdmin(token: string, tenantId: string, adminData: CreateTenantAdminRequest): Promise<TenantAdminResponse> {
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
            body: JSON.stringify(adminData)
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

/**
 * Gets all admins for a tenant
 */
export async function getTenantAdmins(token: string, tenantId: string): Promise<TenantAdminResponse[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants/${tenantId}/admins`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `Failed to fetch tenant admins. Status: ${response.status}`);
        }

        return responseData.data || [];
    } catch (error: any) {
        console.error('Error fetching tenant admins:', {
            error,
            message: error.message,
            tenantId,
            endpoint
        });
        throw error;
    }
}

/**
 * Updates a tenant admin's status
 */
export async function updateTenantAdminStatus(token: string, tenantId: string, adminId: string, isActive: boolean): Promise<TenantAdminResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants/${tenantId}/admins/${adminId}/status`;

    try {
        const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ isActive })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update tenant admin status');
        }

        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error: any) {
        console.error('Error updating tenant admin status:', error);
        throw error;
    }
}

/**
 * Gets all users for a tenant
 */
export async function getTenantUsers(token: string, tenantId: string): Promise<TenantUserResponse[]> {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_TENANT_USERS;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/tenants/${tenantId}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tenant users');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching tenant users:', error);
        throw error;
    }
}

/**
 * Gets all users (both admins and regular users) for a tenant
 */
export async function getTenantAggregatedUsers(token: string, tenantId: string): Promise<TenantUserAggregationResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants/${tenantId}/aggregated-users`;

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
            throw new Error(errorData.message || 'Failed to fetch tenant users');
        }

        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error) {
        console.error('Error fetching tenant users:', error);
        throw error;
    }
}