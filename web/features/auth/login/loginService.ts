/**
 * Service for handling login-related API calls to the backend
 */

interface LoginRequest {
    usernameOrEmail: string;
    password: string;
    subdomain?: string; // Optional subdomain for tenant-specific login
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
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
    try {
        // Get API URL from environment or use default
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

        // Using the correct endpoint with the v1 version as specified in the Spring Boot config
        const endpoint = `${apiUrl}/api/v1/auth/login`;
        console.log('Calling API at:', endpoint);
        console.log('With payload:', JSON.stringify({
            usernameOrEmail: credentials.usernameOrEmail,
            password: credentials.password
        }));

        // Set headers for the request
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Add Host header for tenant-specific login when in development
        if (credentials.subdomain) {
            console.log(`Adding subdomain context: ${credentials.subdomain}`);
            // In production, this would be handled by the actual subdomain
            // For local development, we need to simulate it with a custom header
            headers['X-Tenant-Subdomain'] = credentials.subdomain;
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            // Use usernameOrEmail field name to match backend expectation
            body: JSON.stringify({
                usernameOrEmail: credentials.usernameOrEmail,
                password: credentials.password
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);

        // Log the full response for debugging
        const responseText = await response.text();
        console.log('Response body:', responseText);

        // If empty response or not JSON, handle accordingly
        if (!responseText) {
            throw new Error('The server returned an empty response');
        }

        let data: BackendAuthResponse;
        try {
            // Try to parse the response as JSON
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error('The server returned an invalid response format. Please contact support.');
        }

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Login failed');
        }

        // Map the backend response to our expected format
        const authResponse: LoginResponse = {
            token: data.data.accessToken,
            user: {
                id: data.data.userId.toString(),
                name: `${data.data.firstName} ${data.data.lastName}`.trim(),
                email: data.data.email,
                // Convert backend role format (ROLE_SYSTEM_ADMIN) to our format (SUPER_ADMIN)
                role: mapRoleFromBackend(data.data.roles[0])
            }
        };

        return authResponse;
    } catch (error: any) {
        console.error('Login error:', error);

        // Improve error message for common issues
        if (error.message.includes('fetch') || error.message.includes('network')) {
            throw new Error('Could not connect to the server. Please check your internet connection.');
        } else if (error instanceof SyntaxError) {
            throw new Error('The server returned an invalid response. Please contact support.');
        } else if (error.message.includes('403')) {
            throw new Error('Access denied. Please check your credentials or contact support.');
        }

        throw error;
    }
}

/**
 * Maps backend role format to frontend role format
 * @param backendRole The role from backend (e.g., ROLE_SYSTEM_ADMIN)
 * @returns Frontend role (e.g., SUPER_ADMIN)
 */
function mapRoleFromBackend(backendRole: string): string {
    const roleMap: Record<string, string> = {
        'ROLE_SYSTEM_ADMIN': 'SUPER_ADMIN',
        'ROLE_TENANT_ADMIN': 'TENANT_MANAGER',
        'ROLE_COMPANY_ADMIN': 'COMPANY_ADMIN',
        'ROLE_MANAGER': 'MANAGER',
        'ROLE_EMPLOYEE': 'EMPLOYEE',
        'ROLE_USER': 'USER'
    };

    return roleMap[backendRole] || 'USER';
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