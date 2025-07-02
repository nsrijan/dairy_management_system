import { authenticatedFetch, handleApiResponse } from '@/lib/api';

export interface MCB {
    id: string;
    name: string;
    code: string;
    address: string;
    managerName: string;
    managerPhone: string;
    isActive: boolean;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMCBRequest {
    name: string;
    code: string;
    address: string;
    managerName: string;
    managerPhone: string;
    isActive: boolean;
}

export interface UpdateMCBRequest {
    name?: string;
    code?: string;
    address?: string;
    managerName?: string;
    managerPhone?: string;
    isActive?: boolean;
}

/**
 * MCB (Milk Collection Branch) service
 */
export const mcbService = {
    async getMCBs(token: string): Promise<MCB[]> {
        const response = await authenticatedFetch('/api/v1/mcb', token);
        return handleApiResponse<MCB[]>(response);
    },

    async getMCBById(token: string, id: string): Promise<MCB> {
        const response = await authenticatedFetch(`/api/v1/mcb/${id}`, token);
        return handleApiResponse<MCB>(response);
    },

    async createMCB(token: string, data: CreateMCBRequest): Promise<MCB> {
        const response = await authenticatedFetch('/api/v1/mcb', token, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleApiResponse<MCB>(response);
    },

    async updateMCB(token: string, id: string, data: UpdateMCBRequest): Promise<MCB> {
        const response = await authenticatedFetch(`/api/v1/mcb/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleApiResponse<MCB>(response);
    },

    async deleteMCB(token: string, id: string): Promise<void> {
        const response = await authenticatedFetch(`/api/v1/mcb/${id}`, token, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || `Failed to delete MCB`);
        }
    }
}; 