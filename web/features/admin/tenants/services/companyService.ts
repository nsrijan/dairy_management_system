import { authenticatedFetch, adminCompanyService } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_PATH = '/api/v1/companies';

export interface CompanyDto {
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

export interface CompanyWithAdminCountDto {
    companyId: string;
    companyName: string;
    createdAt: string;
    updatedAt: string;
    adminCount: number;
    userCount: number;
    isActive: boolean;
}

export interface CompanyCreateRequest {
    name: string;
    description?: string;
    isActive: boolean;
}

class CompanyApiService {
    async getCompaniesByTenantId(tenantId: string, token: string): Promise<CompanyWithAdminCountDto[]> {
        const response = await authenticatedFetch(`/api/v1/admin/tenants/${tenantId}/companies-with-stats`, token);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch companies for tenant');
        }

        const result = await response.json();
        return result.data || [];
    }

    async createCompanyForTenant(tenantId: string, data: CompanyCreateRequest, token: string): Promise<CompanyDto> {
        const response = await authenticatedFetch(`/api/v1/admin/tenants/${tenantId}/companies`, token, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create company for tenant');
        }

        const result = await response.json();
        return result.data;
    }

    async updateCompany(id: string, data: CompanyCreateRequest, token: string): Promise<CompanyDto> {
        return adminCompanyService.update(id, data, token) as Promise<CompanyDto>;
    }

    async deleteCompany(id: string, token: string): Promise<void> {
        return adminCompanyService.delete(id, token);
    }

    async getUsersByCompanyId(companyId: string, token: string): Promise<any[]> {
        const response = await authenticatedFetch(`/api/v1/admin/companies/${companyId}/users`, token);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch users for company');
        }

        const result = await response.json();
        return result.data || [];
    }
}

export const companyApiService = new CompanyApiService();

export interface Company {
    id: string;
    name: string;
    registrationNumber: string;
    address: string;
    description?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCompanyRequest {
    name: string;
    description?: string;
    isActive: boolean;
}

export interface CompanyWithAdminCount {
    companyId: string;
    companyName: string;
    createdAt: string;
    updatedAt: string;
    adminCount: number;
    userCount: number;
    isActive: boolean;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> { }

export async function getCompanies(token: string, tenantId: string): Promise<Company[]> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}/tenant/${tenantId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch companies');
    }

    return response.json();
}

//getcompanies with admin count
export async function getCompaniesWithAdminCount(token: string, tenantId: string): Promise<CompanyWithAdminCount[]> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}/tenant/${tenantId}/with-admin-count`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch companies with admin count');
    }

    return response.json();
}

export async function createCompany(
    token: string,
    tenantId: string,
    data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}/${tenantId}/companies`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create company');
    }

    return response.json();
}

export async function updateCompany(
    token: string,
    tenantId: string,
    companyId: string,
    data: UpdateCompanyRequest
): Promise<Company> {
    const response = await fetch(
        `${API_BASE_URL}${API_PATH}/${tenantId}/companies/${companyId}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update company');
    }

    return response.json();
}

export async function updateCompanyStatus(
    token: string,
    tenantId: string,
    companyId: string,
    active: boolean
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}${API_PATH}/${tenantId}/companies/${companyId}/status`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ active }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update company status');
    }
}

export async function deleteCompany(token: string, tenantId: string, companyId: string): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}${API_PATH}/${tenantId}/companies/${companyId}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete company');
    }
} 