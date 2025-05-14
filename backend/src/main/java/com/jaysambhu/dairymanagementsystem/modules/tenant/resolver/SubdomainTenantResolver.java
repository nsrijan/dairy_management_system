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
     * @return The resolved tenant ID
     */
    public Long resolveTenantFromRequest(HttpServletRequest request) {
        String host = request.getServerName();
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
     * Extract the subdomain from a hostname.
     * 
     * @param host The hostname (e.g., "test.example.com")
     * @return The subdomain (e.g., "test")
     */
    private String extractSubdomain(String host) {
        // For localhost with port, handle separately
        if (host.startsWith("localhost")) {
            return "";
        }

        // Remove any port information
        if (host.contains(":")) {
            host = host.split(":")[0];
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