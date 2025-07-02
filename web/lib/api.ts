const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

/**
 * Determines the API base URL based on the current window's hostname.
 * This ensures that API requests are sent to the correct tenant subdomain.
 *
 * @returns {string} The constructed API base URL.
 */
export function getApiBaseUrl(): string {
    if (typeof window === 'undefined') {
        // For server-side rendering or environments without a window object,
        // fall back to the environment variable. This is crucial for build processes.
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    }

    const hostname = window.location.hostname; // e.g., "test.localhost" or "localhost"
    const protocol = window.location.protocol; // "http:" or "https:"

    // In development, the backend runs on port 8080.
    // This logic correctly constructs the URL for both super-admin (localhost)
    // and tenant (subdomain.localhost) access.
    const port = ':8080';

    // The backend's SubdomainTenantResolver will correctly interpret `localhost:8080`
    // as super-admin and `subdomain.localhost:8080` as a tenant request.
    return `${protocol}//${hostname}${port}`;
}

/**
 * Detects the current subdomain from the window location
 * Works for both development (abc.localhost) and production (abc.domain.com)
 */
export function getCurrentSubdomain(): string | null {
    if (typeof window === 'undefined') return null;

    const hostname = window.location.hostname;

    // For development: abc.localhost
    if (hostname.endsWith('.localhost')) {
        const subdomain = hostname.split('.')[0];
        return subdomain && subdomain !== 'localhost' && subdomain.toLowerCase() !== 'www'
            ? subdomain
            : null;
    }

    // For production: abc.domain.com
    const parts = hostname.split('.');
    if (parts.length > 2) {
        const subdomain = parts[0];
        return subdomain && subdomain.toLowerCase() !== 'www'
            ? subdomain
            : null;
    }

    return null;
}

/**
 * Enhanced authenticated fetch with automatic tenant context
 * Core utility for all API calls
 */
export async function authenticatedFetch(
    endpoint: string,
    token: string,
    options: RequestInit = {}
): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Add tenant context based on subdomain
    const subdomain = getCurrentSubdomain();
    if (subdomain) {
        (headers as Record<string, string>)['X-Tenant-Subdomain'] = subdomain;
        console.log(`[API] Adding tenant context: ${subdomain} for ${endpoint}`);
    }

    try {
        const response = await fetch(url, { ...options, headers });

        // Log API calls for debugging
        if (!response.ok) {
            console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, response.status, response.statusText);
        } else {
            console.log(`[API Success] ${options.method || 'GET'} ${endpoint}:`, response.status);
        }

        return response;
    } catch (error) {
        console.error(`[API Network Error] ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Helper function to handle API response parsing
 * Standardizes response handling across all services
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
}