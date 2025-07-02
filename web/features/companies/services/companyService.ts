import { authenticatedFetch, handleApiResponse } from '@/lib/api';

export interface Company {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface CreateCompanyRequest {
    name: string;
    description?: string;
    isActive: boolean;
}

export interface UpdateCompanyRequest {
    name?: string;
    description?: string;
    isActive?: boolean;
}

/**
 * Company service for tenant-specific operations
 */
export const companyService = {
    async getCompanies(token: string): Promise<Company[]> {
        const response = await authenticatedFetch('/api/v1/companies', token);
        return handleApiResponse<Company[]>(response);
    },

    async getCompanyById(token: string, id: string): Promise<Company> {
        const response = await authenticatedFetch(`/api/v1/companies/${id}`, token);
        return handleApiResponse<Company>(response);
    },

    async createCompany(token: string, data: CreateCompanyRequest): Promise<Company> {
        const response = await authenticatedFetch('/api/v1/companies', token, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleApiResponse<Company>(response);
    },

    async updateCompany(token: string, id: string, data: UpdateCompanyRequest): Promise<Company> {
        const response = await authenticatedFetch(`/api/v1/companies/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleApiResponse<Company>(response);
    },

    async deleteCompany(token: string, id: string): Promise<void> {
        const response = await authenticatedFetch(`/api/v1/companies/${id}`, token, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || `Failed to delete company`);
        }
    }
};

/**
 * Admin company service for system admin operations
 */
export const adminCompanyService = {
    async getAllCompanies(token: string): Promise<Company[]> {
        const response = await authenticatedFetch('/api/v1/admin/companies', token);
        return handleApiResponse<Company[]>(response);
    },

    async getCompanyById(token: string, id: string): Promise<Company> {
        const response = await authenticatedFetch(`/api/v1/admin/companies/${id}`, token);
        return handleApiResponse<Company>(response);
    },

    async createCompany(token: string, data: CreateCompanyRequest): Promise<Company> {
        const response = await authenticatedFetch('/api/v1/admin/companies', token, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleApiResponse<Company>(response);
    },

    async updateCompany(token: string, id: string, data: UpdateCompanyRequest): Promise<Company> {
        const response = await authenticatedFetch(`/api/v1/admin/companies/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleApiResponse<Company>(response);
    },

    async deleteCompany(token: string, id: string): Promise<void> {
        const response = await authenticatedFetch(`/api/v1/admin/companies/${id}`, token, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || `Failed to delete company`);
        }
    }
}; 