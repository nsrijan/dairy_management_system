package com.jaysambhu.dairymanagementsystem.modules.tenant.filter;

import com.jaysambhu.dairymanagementsystem.context.TenantContext;
import com.jaysambhu.dairymanagementsystem.modules.tenant.resolver.SubdomainTenantResolver;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Filter to resolve and set the tenant context for each request
 * Runs early in the filter chain to ensure tenant context is available for
 * subsequent filters
 */
@Component
@Order(1) // High priority to run early
@RequiredArgsConstructor
@Slf4j
public class TenantFilter implements Filter {

    private final SubdomainTenantResolver tenantResolver;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        try {
            // Resolve tenant from request
            Long tenantId = tenantResolver.resolveTenantFromRequest(httpRequest);

            // Set in context
            TenantContext.setCurrentTenant(tenantId);

            // Log for debugging
            log.debug("Set tenant context: {}", tenantId);

            // Continue with the request
            chain.doFilter(request, response);
        } finally {
            // Always clear the context to prevent memory leaks
            TenantContext.clear();
            log.debug("Cleared tenant context");
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {
        log.info("Initializing TenantFilter");
    }

    @Override
    public void destroy() {
        log.info("Destroying TenantFilter");
    }
}