interface CreateCompanyRequest {
    name: string;
    description: string;
    isActive: boolean;
}

interface CompanyResponse {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Creates a new company for a tenant
 */
export async function createCompany(token: string, tenantId: string, data: CreateCompanyRequest): Promise<CompanyResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const endpoint = `${apiUrl}/api/v1/tenants/${tenantId}/companies`;

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
            throw new Error(errorData.message || 'Failed to create company');
        }

        const apiResponse = await response.json();
        return apiResponse.data;
    } catch (error: any) {
        console.error('Error creating company:', error);
        throw error;
    }
} 