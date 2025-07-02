import { authenticatedFetch, handleApiResponse } from '@/lib/api';

export interface Farmer {
    id: string;
    farmerCode: string;
    name: string;
    phone: string;
    address: string;
    mcbId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFarmerRequest {
    farmerCode: string;
    name: string;
    phone: string;
    address: string;
    mcbId: string;
    isActive: boolean;
}

export interface UpdateFarmerRequest {
    name?: string;
    phone?: string;
    address?: string;
    mcbId?: string;
    isActive?: boolean;
}

/**
 * Farmer service for farmer management
 */
export const farmerService = {
    async getFarmers(token: string): Promise<Farmer[]> {
        const response = await authenticatedFetch('/api/v1/farmers', token);
        return handleApiResponse<Farmer[]>(response);
    },

    async getFarmerById(token: string, id: string): Promise<Farmer> {
        const response = await authenticatedFetch(`/api/v1/farmers/${id}`, token);
        return handleApiResponse<Farmer>(response);
    },

    async getFarmersByMCB(token: string, mcbId: string): Promise<Farmer[]> {
        const response = await authenticatedFetch(`/api/v1/farmers/mcb/${mcbId}`, token);
        return handleApiResponse<Farmer[]>(response);
    },

    async createFarmer(token: string, data: CreateFarmerRequest): Promise<Farmer> {
        const response = await authenticatedFetch('/api/v1/farmers', token, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleApiResponse<Farmer>(response);
    },

    async updateFarmer(token: string, id: string, data: UpdateFarmerRequest): Promise<Farmer> {
        const response = await authenticatedFetch(`/api/v1/farmers/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleApiResponse<Farmer>(response);
    },

    async deleteFarmer(token: string, id: string): Promise<void> {
        const response = await authenticatedFetch(`/api/v1/farmers/${id}`, token, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || `Failed to delete farmer`);
        }
    }
}; 