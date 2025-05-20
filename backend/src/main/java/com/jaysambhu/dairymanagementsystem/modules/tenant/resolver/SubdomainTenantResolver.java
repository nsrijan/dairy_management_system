package com.jaysambhu.dairymanagementsystem.modules.tenant.resolver;

import com.jaysambhu.dairymanagementsystem.common.exception.InvalidTenantException;
import com.jaysambhu.dairymanagementsystem.context.TenantContext;
import com.jaysambhu.dairymanagementsystem.modules.tenant.model.Tenant;
import com.jaysambhu.dairymanagementsystem.modules.tenant.service.TenantService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SubdomainTenantResolver {

    private final TenantService tenantService;

    @Value("${app.domain:localhost}")
    private String domain;

    @Value("${app.tenant.default:master}")
    private String defaultTenantSlug;

    @Value("${app.tenant.reserved:www,api,admin,app}")
    private List<String> reservedSubdomains;

    /**
     * Resolves the tenant from the HTTP request's host header.
     * 
     * @param request The HTTP request
     * @return The resolved tenant ID or SUPER_ADMIN_CONTEXT for main domain
     */
    public Long resolveTenantFromRequest(HttpServletRequest request) {
        String host = request.getServerName();

        // Check if this is the main domain (no subdomain)
        if (isMainDomain(host)) {
            log.debug("Request to main domain: {}, setting super admin context", host);
            return TenantContext.SUPER_ADMIN_CONTEXT; // Skip tenant resolution for main domain
        }

        String subdomain = extractSubdomain(host);

        if (!StringUtils.hasText(subdomain) || reservedSubdomains.contains(subdomain)) {
            // Use default tenant for reserved or empty subdomains
            log.debug("Using default tenant for reserved or empty subdomain: {}", subdomain);
            Tenant defaultTenant = tenantService.findBySlug(defaultTenantSlug);
            return defaultTenant.getId();
        }

        try {
            Tenant tenant = tenantService.findActiveBySlug(subdomain);
            return tenant.getId();
        } catch (Exception e) {
            log.error("Failed to resolve tenant from subdomain: {}", subdomain, e);
            // Default to master tenant if there's an error
            Tenant defaultTenant = tenantService.findBySlug(defaultTenantSlug);
            return defaultTenant.getId();
        }
    }

    /**
     * Check if the host is the main domain with no subdomain
     * 
     * @param host The hostname
     * @return true if this is the main domain, false otherwise
     */
    private boolean isMainDomain(String host) {
        // Remove any port information first
        if (host.contains(":")) {
            host = host.split(":")[0];
        }

        // For development and testing, treat only exact "localhost" as main domain
        // But not subdomains like "test.localhost"
        if (host.equals("localhost")) {
            log.debug("Treating localhost as main domain for super admin context");
            return true;
        }

        return host.equals(domain);
    }

    /**
     * Extract the subdomain from a hostname.
     * 
     * @param host The hostname (e.g., "test.example.com")
     * @return The subdomain (e.g., "test")
     */
    private String extractSubdomain(String host) {
        // Remove any port information
        if (host.contains(":")) {
            host = host.split(":")[0];
        }

        // Handle localhost subdomains (e.g., "test.localhost")
        if (host.endsWith(".localhost")) {
            String[] parts = host.split("\\.");
            if (parts.length > 1) {
                log.debug("Extracted subdomain from localhost: {}", parts[0]);
                return parts[0];
            }
        }

        // Remove the domain part
        if (host.endsWith("." + domain)) {
            String[] parts = host.split("\\.");
            if (parts.length > domain.split("\\.").length) {
                // Return the first part as the subdomain
                return parts[0];
            }
        }

        // If no subdomain is found or we're using an IP address
        return "";
    }
}