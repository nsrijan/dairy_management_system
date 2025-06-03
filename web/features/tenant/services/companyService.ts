'use client';

import { CompanyResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface GlobalApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export interface CompanyCreateUpdateRequest {
    name: string;
    description?: string;
    isActive: boolean;
    tenantId: string;
}

/**
 * Get all companies for a tenant
 */
export async function getCompanies(token: string, tenantId: string): Promise<CompanyResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/companies?tenantId=${tenantId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch companies');
    }

    const result: GlobalApiResponse<CompanyResponse[]> = await response.json();
    return result.data;
}

/**
 * Get a company by ID
 */
export async function getCompanyById(token: string, id: string): Promise<CompanyResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/companies/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch company');
    }

    const result: GlobalApiResponse<CompanyResponse> = await response.json();
    return result.data;
}

/**
 * Create a new company
 */
export async function createCompany(token: string, tenantId: string, data: Omit<CompanyCreateUpdateRequest, 'tenantId'>): Promise<CompanyResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/companies`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...data,
            tenantId
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create company');
    }

    const result: GlobalApiResponse<CompanyResponse> = await response.json();
    return result.data;
}

/**
 * Update an existing company
 */
export async function updateCompany(token: string, id: string, data: CompanyCreateUpdateRequest): Promise<CompanyResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/companies/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update company');
    }

    const result: GlobalApiResponse<CompanyResponse> = await response.json();
    return result.data;
}

/**
 * Delete a company
 */
export async function deleteCompany(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/companies/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete company');
    }
}

/**
 * Search companies by name
 */
export async function searchCompaniesByName(token: string, tenantId: string, name: string): Promise<CompanyResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/companies/search?tenantId=${tenantId}&name=${encodeURIComponent(name)}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to search companies');
    }

    const result: GlobalApiResponse<CompanyResponse[]> = await response.json();
    return result.data;
} 