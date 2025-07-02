'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect the current subdomain
 * @returns Object containing subdomain information
 */
export function useSubdomain() {
    const [subdomain, setSubdomain] = useState<string | null>(null);
    const [isSubdomainLoaded, setIsSubdomainLoaded] = useState(false);

    useEffect(() => {
        // Only run in the browser
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;

            let detectedSubdomain: string | null = null;

            // Case 1: 'subdomain.localhost' (e.g., abc.localhost) - check this FIRST
            if (hostname.endsWith('.localhost')) {
                const firstPart = hostname.split('.')[0];
                // Ensure firstPart is not empty, not 'localhost' itself, and not 'www'
                if (firstPart && firstPart !== 'localhost' && firstPart.toLowerCase() !== 'www') {
                    detectedSubdomain = firstPart;
                } else {
                    detectedSubdomain = null; // Handles 'www.localhost', '.localhost', 'localhost.localhost'
                }
            }
            // Case 2: Exact 'localhost' or numeric IP -> no subdomain
            else if (hostname === 'localhost' || hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
                detectedSubdomain = null;
            }
            // Case 3: Standard subdomains (e.g., abc.modulynx.com)
            else {
                const parts = hostname.split('.');
                // Expect at least 3 parts for a subdomain (sub.domain.tld)
                if (parts.length >= 3) {
                    const potentialSubdomain = parts[0];
                    // Don't treat 'www' as a tenant subdomain
                    if (potentialSubdomain && potentialSubdomain.toLowerCase() !== 'www') {
                        detectedSubdomain = potentialSubdomain;
                    } else {
                        detectedSubdomain = null; // Handles 'www.domain.com'
                    }
                } else {
                    // No subdomain for hostnames like 'modulynx.com' (2 parts) or 'com' (1 part)
                    detectedSubdomain = null;
                }
            }

            setSubdomain(detectedSubdomain);
            setIsSubdomainLoaded(true);
        }
    }, []);

    return { subdomain, isSubdomainLoaded };
}

/**
 * Component to display the current tenant information based on subdomain
 */
export function CurrentTenantInfo() {
    const { subdomain, isSubdomainLoaded } = useSubdomain();

    if (!isSubdomainLoaded) {
        return null;
    }

    if (!subdomain) {
        return null;
    }

    return (
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-md mb-4 text-sm">
            <p className="font-medium">Logging in to tenant: <span className="font-bold">{subdomain}</span></p>
        </div>
    );
} 