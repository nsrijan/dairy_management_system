package com.jaysambhu.modulynx.core.company.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.context.CompanyContext;
import com.jaysambhu.modulynx.core.auth.service.JwtService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Filter to validate company access and set company context for
 * company-specific endpoints.
 * Runs on all /api/v1/companies/{companyId}/... endpoints
 */
@Component
@Order(3) // Run after TenantFilter (1) and JwtAuthenticationFilter (2)
@RequiredArgsConstructor
@Slf4j
public class CompanyContextFilter implements Filter {

    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    // Pattern to match /api/v1/companies/{companyId}/...
    private static final Pattern COMPANY_PATH_PATTERN = Pattern.compile("/api/v1/companies/(\\d+)(/.*)?");
    private static final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestPath = httpRequest.getServletPath();
        log.debug("Processing company context filter for path: {}", requestPath);

        // Check if this is a company-specific endpoint
        Matcher matcher = COMPANY_PATH_PATTERN.matcher(requestPath);

        if (!matcher.matches()) {
            // Not a company-specific endpoint, continue without setting company context
            log.debug("Path {} does not match company pattern, skipping company context", requestPath);
            chain.doFilter(request, response);
            return;
        }

        try {
            // Extract company ID from path
            Long requestedCompanyId = Long.valueOf(matcher.group(1));
            log.debug("Extracted company ID from path: {}", requestedCompanyId);

            // Get JWT token from Authorization header
            String authHeader = httpRequest.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("No valid Authorization header found for company-specific endpoint");
                sendForbiddenResponse(httpResponse, "Authorization required for company access");
                return;
            }

            String jwt = authHeader.substring(7);

            try {
                // Extract accessible company IDs from JWT
                List<Long> accessibleCompanyIds = jwtService.extractAccessibleCompanyIds(jwt);
                log.debug("User has access to companies: {}", accessibleCompanyIds);

                // Validate company access
                if (!accessibleCompanyIds.contains(requestedCompanyId)) {
                    log.warn("User attempted to access company {} but only has access to: {}",
                            requestedCompanyId, accessibleCompanyIds);
                    sendForbiddenResponse(httpResponse,
                            String.format("Access denied to company %d", requestedCompanyId));
                    return;
                }

                // Set company context
                CompanyContext.set(requestedCompanyId);
                log.debug("Set company context to: {}", requestedCompanyId);

                // Continue with the request
                chain.doFilter(request, response);

            } catch (Exception e) {
                log.error("Error processing JWT for company access validation", e);
                sendForbiddenResponse(httpResponse, "Invalid token for company access");
                return;
            }

        } catch (NumberFormatException e) {
            log.error("Invalid company ID in path: {}", requestPath, e);
            sendBadRequestResponse(httpResponse, "Invalid company ID format");
            return;
        } finally {
            // Always clear company context to prevent memory leaks
            CompanyContext.clear();
            log.debug("Cleared company context");
        }
    }

    /**
     * Send a 403 Forbidden response
     */
    private void sendForbiddenResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        GlobalApiResponse<Object> apiResponse = GlobalApiResponse.builder()
                .success(false)
                .message(message)
                .data(null)
                .build();

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }

    /**
     * Send a 400 Bad Request response
     */
    private void sendBadRequestResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        GlobalApiResponse<Object> apiResponse = GlobalApiResponse.builder()
                .success(false)
                .message(message)
                .data(null)
                .build();

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }

    @Override
    public void init(FilterConfig filterConfig) {
        log.info("Initializing CompanyContextFilter");
    }

    @Override
    public void destroy() {
        log.info("Destroying CompanyContextFilter");
    }
}