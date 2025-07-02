// Re-export types from service for convenience
export type {
    Farmer,
    CreateFarmerRequest,
    UpdateFarmerRequest
} from './services/farmerService';

import type { Farmer } from './services/farmerService';

// Additional types specific to farmer features can go here
export interface FarmerStats {
    totalFarmers: number;
    activeFarmers: number;
    inactiveFarmers: number;
}

export interface FarmerListResponse {
    farmers: Farmer[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
} 