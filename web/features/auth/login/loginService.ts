/**
 * Service for handling login-related API calls to the backend
 */

import { getCurrentSubdomain } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

/**
 * Response format from the Spring Boot backend
 */
interface BackendAuthResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        tokenType: string;
        expiresIn: number;
        userId: number;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        primaryTenantId: number;
        primaryTenantName: string;
        roles: string[];
        permissions: string[];
        companyIds: number[];
    };
    timestamp: string;
}

/**
 * Calls the backend API to authenticate a user
 * @param credentials User login credentials
 * @returns Promise containing login response with token and user info
 */
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Add tenant context for login if subdomain exists
    const subdomain = getCurrentSubdomain();
    if (subdomain) {
        (headers as Record<string, string>)['X-Tenant-Subdomain'] = subdomain;
        console.log(`[Auth] Login with tenant context: ${subdomain}`);
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();
    return result.data;
}

/**
 * Maps backend role format to frontend role format
 * @param backendRole The role from backend (e.g., ROLE_SYSTEM_ADMIN)
 * @returns Frontend role (e.g., SUPER_ADMIN)
 */
function mapRoleFromBackend(backendRole: string): string {
    // Remove 'ROLE_' prefix and return the rest
    return backendRole.replace('ROLE_', '') || 'USER';
}

/**
 * Mock function to determine tenant domain/module based on tenant name or role
 * In real implementation, this would come from backend or tenant configuration
 * @param tenantName The tenant name from backend
 * @param roles Array of user roles
 * @returns Domain identifier (e.g., 'dairy', 'bus', 'poultry')
 */
function determineTenantDomain(tenantName: string, roles: string[]): string {
    console.log(`[determineTenantDomain] Determining domain for tenant: ${tenantName}, roles: ${roles.join(', ')}`);

    // Mock logic - in real app this would be based on tenant configuration
    // For now, check if any role contains domain-specific prefixes
    const roleString = roles.join(' ').toLowerCase();

    if (roleString.includes('dairy') || tenantName.toLowerCase().includes('dairy')) {
        console.log('[determineTenantDomain] Determined domain: dairy');
        return 'dairy';
    }

    if (roleString.includes('bus') || tenantName.toLowerCase().includes('bus')) {
        console.log('[determineTenantDomain] Determined domain: bus');
        return 'bus';
    }

    if (roleString.includes('poultry') || tenantName.toLowerCase().includes('poultry')) {
        console.log('[determineTenantDomain] Determined domain: poultry');
        return 'poultry';
    }

    // Default to dairy for MVP (since we only have dairy implemented)
    console.log('[determineTenantDomain] No specific domain found, defaulting to dairy for MVP');
    return 'dairy';
}

/**
 * Calls the backend API to logout a user and invalidate their token
 * @param token The authentication token to invalidate
 * @returns Promise that resolves when logout is complete
 */
export async function logoutUser(token: string | null): Promise<void> {
    // If no token, nothing to invalidate on server
    if (!token) {
        console.log('No token provided for logout, skipping server call');
        return;
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const endpoint = `${apiUrl}/api/v1/auth/logout`;

        console.log('Calling logout API at:', endpoint);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.warn('Logout request failed:', response.status, response.statusText);
            // We don't throw here because we still want to clear local storage even if the server call fails
        } else {
            console.log('Logout successful on server');
        }
    } catch (error) {
        // Log the error but don't rethrow - we still want to clear local state
        console.error('Error during logout:', error);
    }
} 