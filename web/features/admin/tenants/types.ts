import { TenantResponse as BackendTenantResponse } from '@/features/tenant/types';

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
export function mapTenantResponse(response: BackendTenantResponse): Tenant {
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
    id: number;
    name: string;
    slug: string;
    active: boolean;
    moduleType: string;
    currency: string;
    timezone: string;
    email?: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    createdAt: string;
    updatedAt: string;
} 