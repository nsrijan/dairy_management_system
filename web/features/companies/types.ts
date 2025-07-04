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

export interface CompanyStats {
    totalUsers: number;
    activeUsers: number;
    totalDepartments: number;
    activeDepartments: number;
    daysActive: number;
    // Dairy specific stats
    totalMCBs: number;
    totalChillVats: number;
    totalFactories: number;
    totalShops: number;
}

export interface CompanyDetails extends Company {
    stats?: CompanyStats;
    departments?: CompanyDepartment[];
    users?: CompanyUser[];
    mcbs?: MilkCollectionBranch[];
    factories?: Factory[];
    shops?: Shop[];
}

export interface CompanyDepartment {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    userCount: number;
    createdAt: string;
}

export interface CompanyUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    department?: string;
    assignedEntity?: string; // MCB, Factory, or Shop ID
    assignedEntityType?: 'MCB' | 'FACTORY' | 'SHOP';
    lastLoginAt?: string;
    createdAt: string;
}

// Dairy ERP Specific Entities

export interface MilkCollectionBranch {
    id: string;
    name: string;
    location: string;
    companyId: string;
    managerId?: string;
    manager?: CompanyUser;
    chillVatCount: number;
    chillVats?: ChillVat[];
    isActive: boolean;
    contactNumber?: string;
    address?: string;
    capacity?: number; // in liters
    currentStock?: number; // in liters
    createdAt: string;
    updatedAt: string;
}

export interface ChillVat {
    id: string;
    name: string;
    mcbId: string;
    mcb?: MilkCollectionBranch;
    capacity: number; // in liters
    currentStock: number; // in liters
    temperature?: number; // in celsius
    isOperational: boolean;
    lastCleanedAt?: string;
    installationDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Factory {
    id: string;
    name: string;
    location: string;
    companyId: string;
    managerId?: string;
    manager?: CompanyUser;
    productionCapacity: number; // in liters per day
    currentProduction?: number;
    isActive: boolean;
    factoryType?: 'PROCESSING' | 'PACKAGING' | 'STORAGE';
    contactNumber?: string;
    address?: string;
    certifications?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Shop {
    id: string;
    name: string;
    location: string;
    companyId: string;
    managerId?: string;
    manager?: CompanyUser;
    dailySales?: number; // in rupees
    monthlySales?: number;
    isActive: boolean;
    shopType?: 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR';
    contactNumber?: string;
    address?: string;
    openingHours?: string;
    createdAt: string;
    updatedAt: string;
}

// Dashboard specific types
export interface EntityListProps {
    companyId: string;
    type: 'MCB' | 'FACTORY' | 'SHOP' | 'USERS';
}

export interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'red';
    trend?: {
        value: number;
        isPositive: boolean;
    };
} 