import { authenticatedFetch, handleApiResponse } from '@/lib/api';

export interface MilkCollectionBranch {
    id: string;
    name: string;
    location: string;
    phoneNumber?: string;
    isActive: boolean;
    companyId: string;
    companyName?: string;
    managerId?: string;
    managerName?: string;
    managerUsername?: string;
    totalCapacity?: number;
    chillVatCount?: number;
    chillVats?: ChillVat[];
    currentRates?: MilkRate[];
    createdAt: string;
    updatedAt: string;
}

export interface ChillVat {
    id: string;
    name: string;
    capacityInLiters: number;
    currentStockLiters: number;
    isOperational: boolean;
    milkCollectionBranchId: string;
    milkCollectionBranchName?: string;
    availableCapacity?: number;
    capacityUtilization?: number;
    createdAt: string;
    updatedAt: string;
}

export interface MilkRate {
    id: string;
    milkType: 'RAW' | 'WHOLE';
    rateType: 'BUY' | 'SELL';
    rate: number;
    effectiveFrom: string;
    effectiveTo?: string;
    isCurrentlyActive?: boolean;
    displayName?: string;
    milkCollectionBranchId: string;
    milkCollectionBranchName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMilkCollectionBranchRequest {
    branchName: string;
    location: string;
    phoneNumber?: string;
    isActive: boolean;
    managerName: string;
    managerUsername: string;
    managerPassword: string;
    chillVats: Array<{
        name: string;
        capacity: number;
    }>;
    rawMilkBuyRate: number;
    rawMilkSaleRate: number;
    wholeMilkBuyRate: number;
    wholeMilkSaleRate: number;
}

export interface UpdateMilkCollectionBranchRequest {
    branchName?: string;
    location?: string;
    phoneNumber?: string;
    isActive?: boolean;
}

export interface CreateChillVatRequest {
    name: string;
    capacityInLiters: number;
}

export interface UpdateChillVatRequest {
    name?: string;
    capacityInLiters?: number;
    currentStockLiters?: number;
    isOperational?: boolean;
}

export interface CreateMilkRateRequest {
    milkType: 'RAW' | 'WHOLE';
    rateType: 'BUY' | 'SELL';
    rate: number;
    effectiveFrom: string;
}

export interface MilkCollectionBranchStats {
    totalMilkCollectionBranches: number;
    activeMilkCollectionBranches: number;
    totalCapacity?: number;
    totalCurrentStock?: number;
}

/**
 * Milk Collection Branch service
 */
export const milkCollectionBranchService = {
    // ========== Milk Collection Branch CRUD Operations ==========

    async getMilkCollectionBranches(token: string, companyId: string): Promise<MilkCollectionBranch[]> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb`, token);
        return handleApiResponse<MilkCollectionBranch[]>(response);
    },

    async getMilkCollectionBranchById(token: string, companyId: string, id: string): Promise<MilkCollectionBranch> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/${id}`, token);
        return handleApiResponse<MilkCollectionBranch>(response);
    },

    async createMilkCollectionBranch(token: string, companyId: string, data: CreateMilkCollectionBranchRequest): Promise<MilkCollectionBranch> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb`, token, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleApiResponse<MilkCollectionBranch>(response);
    },

    async updateMilkCollectionBranch(token: string, companyId: string, id: string, data: UpdateMilkCollectionBranchRequest): Promise<MilkCollectionBranch> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleApiResponse<MilkCollectionBranch>(response);
    },

    async deleteMilkCollectionBranch(token: string, companyId: string, id: string): Promise<void> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/${id}`, token, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || `Failed to delete Milk Collection Branch`);
        }
    },

    async searchMilkCollectionBranches(token: string, companyId: string, searchTerm: string): Promise<MilkCollectionBranch[]> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/search?searchTerm=${encodeURIComponent(searchTerm)}`, token);
        return handleApiResponse<MilkCollectionBranch[]>(response);
    },

    async getActiveMilkCollectionBranches(token: string, companyId: string): Promise<MilkCollectionBranch[]> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/active`, token);
        return handleApiResponse<MilkCollectionBranch[]>(response);
    },

    // ========== Chill Vat Operations ==========

    async getChillVats(token: string, companyId: string, milkCollectionBranchId: string): Promise<ChillVat[]> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/${milkCollectionBranchId}/chill-vats`, token);
        return handleApiResponse<ChillVat[]>(response);
    },

    async createChillVat(token: string, companyId: string, milkCollectionBranchId: string, data: CreateChillVatRequest): Promise<ChillVat> {
        const response = await authenticatedFetch(
            `/api/v1/companies/${companyId}/mcb/${milkCollectionBranchId}/chill-vats?name=${encodeURIComponent(data.name)}&capacityInLiters=${data.capacityInLiters}`,
            token,
            {
                method: 'POST',
            }
        );
        return handleApiResponse<ChillVat>(response);
    },

    async updateChillVat(token: string, companyId: string, milkCollectionBranchId: string, chillVatId: string, data: UpdateChillVatRequest): Promise<ChillVat> {
        const params = new URLSearchParams();
        if (data.name !== undefined) params.append('name', data.name);
        if (data.capacityInLiters !== undefined) params.append('capacityInLiters', data.capacityInLiters.toString());

        const response = await authenticatedFetch(
            `/api/v1/companies/${companyId}/mcb/${milkCollectionBranchId}/chill-vats/${chillVatId}?${params.toString()}`,
            token,
            {
                method: 'PUT',
            }
        );
        return handleApiResponse<ChillVat>(response);
    },

    async deleteChillVat(token: string, companyId: string, milkCollectionBranchId: string, chillVatId: string): Promise<void> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/${milkCollectionBranchId}/chill-vats/${chillVatId}`, token, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || `Failed to delete chill vat`);
        }
    },

    // ========== Milk Rate Operations ==========

    async getCurrentRates(token: string, companyId: string, milkCollectionBranchId: string): Promise<MilkRate[]> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/${milkCollectionBranchId}/milk-rates/current`, token);
        return handleApiResponse<MilkRate[]>(response);
    },

    async getRateHistory(token: string, companyId: string, milkCollectionBranchId: string, milkType: string, rateType: string): Promise<MilkRate[]> {
        const response = await authenticatedFetch(
            `/api/v1/companies/${companyId}/mcb/${milkCollectionBranchId}/milk-rates/history?milkType=${milkType}&rateType=${rateType}`,
            token
        );
        return handleApiResponse<MilkRate[]>(response);
    },

    async createMilkRate(token: string, companyId: string, milkCollectionBranchId: string, data: CreateMilkRateRequest): Promise<MilkRate> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/${milkCollectionBranchId}/milk-rates`, token, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleApiResponse<MilkRate>(response);
    },

    async closeMilkRate(token: string, companyId: string, milkCollectionBranchId: string, milkType: string, rateType: string, endDate: string): Promise<void> {
        const response = await authenticatedFetch(
            `/api/v1/companies/${companyId}/mcb/${milkCollectionBranchId}/milk-rates/close?milkType=${milkType}&rateType=${rateType}&endDate=${endDate}`,
            token,
            {
                method: 'POST',
            }
        );

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || `Failed to close milk rate`);
        }
    },

    // ========== Statistics ==========

    async getCompanyStats(token: string, companyId: string): Promise<MilkCollectionBranchStats> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/stats/company`, token);
        return handleApiResponse<MilkCollectionBranchStats>(response);
    },

    async getMilkCollectionBranchStats(token: string, companyId: string, milkCollectionBranchId: string): Promise<any> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/${milkCollectionBranchId}/stats`, token);
        return handleApiResponse<any>(response);
    },

    async checkNameUnique(token: string, companyId: string, name: string): Promise<boolean> {
        const response = await authenticatedFetch(`/api/v1/companies/${companyId}/mcb/check-name-unique?name=${encodeURIComponent(name)}`, token);
        return handleApiResponse<boolean>(response);
    },
}; 