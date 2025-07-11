// Base types for Milk Collection Branch functionality
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

export interface Collection {
    id: string;
    time: string;
    farmer: string;
    quantity: number;
    quality: string;
    fat: number;
    snf: number;
}

export interface MilkCollectionBranchStats {
    todaysCollection: number;
    activeFarmers: number;
    avgFatContent: number;
    avgSnfContent: number;
    collectionTrend: 'up' | 'down';
    qualityGrade: 'A' | 'B' | 'C';
    weeklyAverage: number;
    monthlyTotal: number;
    lastCollectionTime: string;
}

export interface MilkCollectionBranchListItem {
    id: string;
    name: string;
    location: string;
    activeFarmers: number;
    todaysCollection: number;
    avgQuality: string;
    status: string;
    collectionTrend: string;
    lastUpdated: string;
    coordinates: string;
    manager: string;
    contact: string;
    establishment: string;
    stats?: {
        weeklyAvg: number;
        monthlyTotal: number;
        topSupplier: string;
        qualityDistribution: {
            A: number;
            B: number;
            C: number;
        };
        collectionByDay: Array<{ day: string; liters: number }>;
        recentCollections: Collection[];
    };
}

// Dashboard specific types
export interface DashboardStats {
    totalCollection: number;
    activeFarmers: number;
    avgQuality: 'A' | 'B' | 'C';
    collectionTrend: 'up' | 'down';
}

export interface DashboardChillVat {
    id: string;
    name: string;
    capacity: number;
    currentStock: number;
    utilizationPercentage: number;
    status: 'operational' | 'maintenance';
}

export interface DashboardCollection {
    id: string;
    time: string;
    farmer: string;
    quantity: number;
    quality: 'A' | 'B' | 'C';
    fat: number;
    snf: number;
}

// Request/Response types for API
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