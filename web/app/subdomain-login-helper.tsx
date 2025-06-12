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

            // here i need to check if the subdomain is a valid tenant subdomain even in the localhost
            // if it is, then set the subdomain to the subdomain
            // if it is not, then set the subdomain to null
            // if the subdomain is not a valid tenant subdomain, then set the subdomain to null
            // if the subdomain is a valid tenant subdomain, then set the subdomain to the subdomain

            // so change the below code so that it valid for both abc.localhost and 
            // also in real time say abc.modulynx.com

            let detectedSubdomain: string | null = null;

            // Case 1: Exact 'localhost' or numeric IP -> no subdomain
            if (hostname.includes('localhost')) {
                detectedSubdomain = null;
            }
            // Case 2: 'subdomain.localhost' (e.g., abc.localhost)
            else if (hostname.endsWith('.localhost')) {
                const firstPart = hostname.split('.')[0];
                // Ensure firstPart is not empty, not 'localhost' itself, and not 'www'
                if (firstPart && firstPart !== 'localhost' && firstPart.toLowerCase() !== 'www') {
                    detectedSubdomain = firstPart;
                } else {
                    detectedSubdomain = null; // Handles 'www.localhost', '.localhost', 'localhost.localhost'
                }
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