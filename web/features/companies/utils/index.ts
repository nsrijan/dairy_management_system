import { Company, CompanyStats } from '../types';

/**
 * Format company status as a human-readable string
 */
export function formatCompanyStatus(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
}

/**
 * Get company status color for UI components
 */
export function getCompanyStatusColor(isActive: boolean): 'success' | 'secondary' {
    return isActive ? 'success' : 'secondary';
}

/**
 * Calculate days since company creation
 */
export function calculateDaysActive(createdAt: string): number {
    return Math.floor(
        (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
}

/**
 * Format company creation date for display
 */
export function formatCompanyDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Generate company initials for avatar
 */
export function getCompanyInitials(companyName: string): string {
    return companyName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

/**
 * Validate company name
 */
export function validateCompanyName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * Generate mock stats for company (until backend provides actual data)
 */
export function generateMockStats(company: Company): CompanyStats {
    // This is temporary - replace with actual API data when available
    const daysActive = calculateDaysActive(company.createdAt);

    return {
        totalUsers: Math.floor(Math.random() * 50) + 10,
        activeUsers: Math.floor(Math.random() * 40) + 5,
        totalDepartments: Math.floor(Math.random() * 10) + 3,
        activeDepartments: Math.floor(Math.random() * 8) + 2,
        daysActive
    };
} 