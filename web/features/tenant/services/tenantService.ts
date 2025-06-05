import { TenantResponse } from '../types';

export interface CreateTenantRequest {
    name: string;
    slug: string;
    currency: string;
    timezone: string;
    moduleType: string;
    isActive: boolean;
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