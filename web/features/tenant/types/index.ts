// Company related types
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

export interface CreateCompanyData {
    name: string;
    description?: string;
    isActive: boolean;
}

export interface UpdateCompanyData {
    id: string;
    data: CreateCompanyData;
}

// Dashboard related types
export interface DashboardStats {
    totalCompanies: number;
    activeUsers: number;
    monthlyRevenue: string;
    modulesActive: number;
    inventoryValue: string;
    productsManaged: number;
}

export interface Activity {
    id: number;
    type: 'company' | 'user' | 'inventory' | 'production';
    title: string;
    time: string;
    details: string;
    user: string;
    urgent?: boolean;
}

export interface QuickAction {
    label: string;
    href: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}

// Navigation related types
export interface TenantNavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

// Store related types
export interface TenantCompanyStore {
    isCreateDialogOpen: boolean;
    setCreateDialogOpen: (isOpen: boolean) => void;
    isEditDialogOpen: boolean;
    setEditDialogOpen: (isOpen: boolean) => void;
    isDeleteDialogOpen: boolean;
    setDeleteDialogOpen: (isOpen: boolean) => void;
    selectedCompany: Company | null;
    setSelectedCompany: (company: Company | null) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    reset: () => void;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
} 