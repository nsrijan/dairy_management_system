/**
 * Service for managing tenant-related API calls
 */

import { Tenant, TenantCreateRequest, TenantUpdateRequest, TenantsListResponse, ModuleType } from './types';

// Mock data for development
const MOCK_TENANTS = [
    {
        id: "t1",
        name: "Green Valley Dairy",
        subdomain: "greenvalley",
        active: true,
        moduleType: ModuleType.DAIRY,
        createdAt: "2023-03-15T10:30:00Z",
        updatedAt: "2023-05-20T14:20:00Z"
    },
    {
        id: "t2",
        name: "Artisan Pottery Co",
        subdomain: "artisanpottery",
        active: true,
        moduleType: ModuleType.POTTERY,
        createdAt: "2023-04-10T09:15:00Z",
        updatedAt: "2023-05-18T11:45:00Z"
    },
    {
        id: "t3",
        name: "Highland Garments",
        subdomain: "highland",
        active: true,
        moduleType: ModuleType.GARMENTS,
        createdAt: "2023-02-20T08:00:00Z",
        updatedAt: "2023-05-15T16:30:00Z"
    },
    {
        id: "t4",
        name: "Organic Dairy Farm",
        subdomain: "organic",
        active: false,
        moduleType: ModuleType.DAIRY,
        createdAt: "2023-01-05T11:20:00Z",
        updatedAt: "2023-05-01T10:10:00Z"
    },
    {
        id: "t5",
        name: "Traditional Pottery",
        subdomain: "traditional",
        active: true,
        moduleType: ModuleType.POTTERY,
        createdAt: "2023-03-25T13:40:00Z",
        updatedAt: "2023-05-12T09:25:00Z"
    },
    {
        id: "t6",
        name: "Premium Garments",
        subdomain: "premium",
        active: true,
        moduleType: ModuleType.GARMENTS,
        createdAt: "2023-04-01T15:10:00Z",
        updatedAt: "2023-05-10T14:15:00Z"
    },
    {
        id: "t7",
        name: "Local Dairy Co-op",
        subdomain: "localcoop",
        active: true,
        moduleType: ModuleType.DAIRY,
        createdAt: "2023-02-10T09:50:00Z",
        updatedAt: "2023-05-05T11:30:00Z"
    },
    {
        id: "t8",
        name: "Clay Crafts",
        subdomain: "claycrafts",
        active: false,
        moduleType: ModuleType.POTTERY,
        createdAt: "2023-03-05T10:20:00Z",
        updatedAt: "2023-04-28T15:45:00Z"
    },
    {
        id: "t9",
        name: "Fashion Forward",
        subdomain: "fashionforward",
        active: true,
        moduleType: ModuleType.GARMENTS,
        createdAt: "2023-01-15T14:30:00Z",
        updatedAt: "2023-04-25T09:10:00Z"
    },
    {
        id: "t10",
        name: "Mountain View Dairy",
        subdomain: "mountainview",
        active: true,
        moduleType: ModuleType.DAIRY,
        createdAt: "2023-04-20T08:45:00Z",
        updatedAt: "2023-05-22T10:50:00Z"
    },
    {
        id: "t11",
        name: "Ceramic Designs",
        subdomain: "ceramic",
        active: true,
        moduleType: ModuleType.POTTERY,
        createdAt: "2023-02-25T11:15:00Z",
        updatedAt: "2023-04-15T13:20:00Z"
    },
    {
        id: "t12",
        name: "Elite Clothing",
        subdomain: "elite",
        active: true,
        moduleType: ModuleType.GARMENTS,
        createdAt: "2023-03-10T09:00:00Z",
        updatedAt: "2023-05-08T16:15:00Z"
    }
];

/**
 * Fetches all tenants
 */
export async function getAllTenants(token: string, page = 0, size = 10): Promise<TenantsListResponse> {
    // Use development flag to determine if we should use mock data
    const useMockData = true; // For now, always use mock data

    if (useMockData) {
        // Calculate pagination
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedTenants = MOCK_TENANTS.slice(startIndex, endIndex);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            tenants: paginatedTenants,
            totalItems: MOCK_TENANTS.length,
            totalPages: Math.ceil(MOCK_TENANTS.length / size),
            currentPage: page
        };
    }

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
export async function createTenant(token: string, tenant: TenantCreateRequest): Promise<Tenant> {
    // Use development flag to determine if we should use mock data
    const useMockData = true; // For now, always use mock data

    if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create mock tenant with generated ID
        const newTenant = {
            id: `t${MOCK_TENANTS.length + 1}`,
            name: tenant.name,
            subdomain: tenant.subdomain,
            moduleType: tenant.moduleType,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Return mock response
        return newTenant;
    }

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
            body: JSON.stringify(tenant)
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
    // Use development flag to determine if we should use mock data
    const useMockData = true; // For now, always use mock data

    if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/admin/tenants/${tenantId}`;

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
export async function changeTenantStatus(token: string, tenantId: string, active: boolean): Promise<void> {
    // Use development flag to determine if we should use mock data
    const useMockData = true; // For now, always use mock data

    if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return;
    }

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
            throw new Error(errorData.message || 'Failed to update tenant status');
        }
    } catch (error: any) {
        console.error('Error updating tenant status:', error);
        throw error;
    }
} 