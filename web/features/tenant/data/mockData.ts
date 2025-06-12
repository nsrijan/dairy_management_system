import { Company, Activity, DashboardStats } from '../types';

export const mockCompanies: Company[] = [
    {
        id: '1',
        name: 'ABC Dairy Ltd.',
        description: 'Leading dairy products manufacturer in the region',
        isActive: true,
        tenantId: '1',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
        createdBy: 'admin@example.com',
        updatedBy: 'admin@example.com'
    },
    {
        id: '2',
        name: 'Fresh Farms Co.',
        description: 'Organic dairy products and farm-fresh supplies',
        isActive: true,
        tenantId: '1',
        createdAt: '2024-02-01T10:30:00Z',
        updatedAt: '2024-02-01T10:30:00Z',
        createdBy: 'admin@example.com',
        updatedBy: 'admin@example.com'
    },
    {
        id: '3',
        name: 'Green Valley Dairy',
        description: 'Sustainable dairy farming and processing',
        isActive: true,
        tenantId: '1',
        createdAt: '2024-02-15T14:20:00Z',
        updatedAt: '2024-02-15T14:20:00Z',
        createdBy: 'admin@example.com',
        updatedBy: 'admin@example.com'
    },
    {
        id: '4',
        name: 'Mountain Milk Corp',
        description: 'Premium mountain dairy products',
        isActive: false,
        tenantId: '1',
        createdAt: '2024-01-30T09:15:00Z',
        updatedAt: '2024-03-01T11:45:00Z',
        createdBy: 'admin@example.com',
        updatedBy: 'admin@example.com'
    },
    {
        id: '5',
        name: 'Sunrise Dairy Inc.',
        description: 'Traditional dairy products with modern technology',
        isActive: true,
        tenantId: '1',
        createdAt: '2024-03-10T07:30:00Z',
        updatedAt: '2024-03-10T07:30:00Z',
        createdBy: 'admin@example.com',
        updatedBy: 'admin@example.com'
    }
];

export const mockActivities: Activity[] = [
    {
        id: 1,
        type: 'company',
        title: 'New company added',
        time: '2 hours ago',
        details: 'ABC Dairy Ltd.',
        user: 'John Smith',
        urgent: false
    },
    {
        id: 2,
        type: 'user',
        title: 'User registered',
        time: '4 hours ago',
        details: 'jane.doe@example.com',
        user: 'System',
        urgent: false
    },
    {
        id: 3,
        type: 'inventory',
        title: 'Low stock alert',
        time: '6 hours ago',
        details: 'Milk bottles - 15 units left',
        user: 'Inventory System',
        urgent: true
    },
    {
        id: 4,
        type: 'production',
        title: 'Production completed',
        time: '8 hours ago',
        details: 'Batch #2024-001 - 500L processed',
        user: 'Production Team',
        urgent: false
    },
    {
        id: 5,
        type: 'company',
        title: 'Company updated',
        time: '1 day ago',
        details: 'Fresh Farms Co. - Contact info updated',
        user: 'Admin User',
        urgent: false
    },
    {
        id: 6,
        type: 'user',
        title: 'User permissions changed',
        time: '1 day ago',
        details: 'Manager role assigned to Tom Wilson',
        user: 'System Admin',
        urgent: false
    }
];

export const mockDashboardStats: DashboardStats = {
    totalCompanies: 5,
    activeUsers: 156,
    monthlyRevenue: '$24,850',
    modulesActive: 3,
    inventoryValue: '$78,500',
    productsManaged: 42
};

export const mockSystemStatus = [
    { name: 'Inventory Module', status: 'Online', uptime: '99.9%', color: 'green' },
    { name: 'Production Module', status: 'Online', uptime: '99.7%', color: 'green' },
    { name: 'Sales Module', status: 'Online', uptime: '99.8%', color: 'green' },
    { name: 'User Management', status: 'Online', uptime: '99.6%', color: 'green' },
    { name: 'Reports Engine', status: 'Maintenance', uptime: '95.2%', color: 'yellow' },
    { name: 'Backup System', status: 'Online', uptime: '100%', color: 'green' }
];

// Utility functions for mock data
export const getActiveCompanies = () => mockCompanies.filter(company => company.isActive);
export const getInactiveCompanies = () => mockCompanies.filter(company => !company.isActive);
export const getUrgentActivities = () => mockActivities.filter(activity => activity.urgent);
export const getRecentActivities = (limit: number = 5) => mockActivities.slice(0, limit);

// Development mode flag
export const isDevelopment = process.env.NODE_ENV === 'development';

// Mock API responses
export const createMockApiResponse = <T>(data: T, success: boolean = true, message: string = 'Success') => ({
    success,
    message,
    data,
    timestamp: new Date().toISOString()
});

export const createMockError = (message: string = 'An error occurred') => ({
    success: false,
    message,
    data: null,
    timestamp: new Date().toISOString()
}); 