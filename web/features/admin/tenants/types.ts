export interface TenantSettings {
    generalSettings: {
        timezone: string;
        dateFormat: string;
        currency: string;
    };
    contactInfo: {
        email: string;
        phone: string;
        address: string;
    };
    businessSettings: {
        businessHours: string;
        fiscalYear: string;
    };
    customization: {
        theme: string;
        logoUrl: string;
    };
}

export interface Tenant {
    id: string;
    name: string;
    slug: string;
    status: 'active' | 'inactive' | 'suspended';
    createdAt: string;
    settings: TenantSettings;
}

// Map backend response to our frontend model
export function mapTenantResponse(response: TenantResponse): Tenant {
    return {
        id: response.id,
        name: response.name,
        slug: response.subdomain,
        status: response.active ? 'active' : 'inactive',
        createdAt: response.createdAt,
        settings: {
            generalSettings: {
                timezone: response.timezone || 'UTC',
                dateFormat: 'MM/DD/YYYY', // Default format
                currency: response.currency || 'USD'
            },
            contactInfo: {
                email: '', // These fields are not in the backend response yet
                phone: '',
                address: ''
            },
            businessSettings: {
                businessHours: '9:00 AM - 5:00 PM', // Default hours
                fiscalYear: 'Jan - Dec' // Default fiscal year
            },
            customization: {
                theme: 'Light', // Default theme
                logoUrl: ''
            }
        }
    };
}

// Backend response type
export interface TenantResponse {
    id: string;
    name: string;
    subdomain: string;
    active: boolean;
    moduleType: ModuleType;
    currency: string;
    timezone: string;
    createdAt: string;
    updatedAt: string;
}

export enum ModuleType {
    DAIRY = 'DAIRY',
    POTTERY = 'POTTERY',
    GARMENTS = 'GARMENTS'
}

export interface TenantsListResponse {
    tenants: TenantResponse[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface TenantUserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TenantCreateRequest {
    name: string;
    subdomain: string;
    moduleType: ModuleType;
    currency: string;
    timezone: string;
}

export interface TenantUpdateRequest {
    name?: string;
    subdomain?: string;
    moduleType?: ModuleType;
    currency?: string;
    timezone?: string;
    active?: boolean;
} 