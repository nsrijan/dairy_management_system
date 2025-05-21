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

            // Don't detect subdomains on localhost numeric IP
            if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
                setSubdomain(null);
                setIsSubdomainLoaded(true);
                return;
            }

            // Handle standard subdomains (like test.domain.com)
            const parts = hostname.split('.');

            // If we have at least 3 parts (subdomain.domain.tld), consider it a subdomain
            if (parts.length >= 3) {
                const sub = parts[0];
                // Don't treat 'www' as a subdomain
                setSubdomain(sub === 'www' ? null : sub);
            } else {
                setSubdomain(null);
            }

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