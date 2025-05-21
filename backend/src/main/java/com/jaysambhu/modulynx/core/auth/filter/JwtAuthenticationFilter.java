package com.jaysambhu.modulynx.core.auth.filter;

import com.jaysambhu.modulynx.context.TenantContext;
import com.jaysambhu.modulynx.core.auth.service.JwtService;
import com.jaysambhu.modulynx.core.auth.service.TokenBlacklistService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to extract and validate JWT tokens from requests
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        // If no JWT token is found, continue to next filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        final String jwt = authHeader.substring(7);

        // Check if the token is blacklisted
        if (tokenBlacklistService.isBlacklisted(jwt)) {
            log.debug("Token is blacklisted. URI: {}", request.getRequestURI());
            // Even if blacklisted, continue the chain for Spring Security to decide.
            // SecurityContextHolder.clearContext(); // Optional: clear context if a
            // blacklisted token was found
            filterChain.doFilter(request, response);
            return;
        }

        boolean tenantContextSetByThisFilter = false;
        try {
            // Attempt to authenticate only if no authentication is already present in the
            // context
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                final String username = jwtService.extractUsername(jwt); // Can throw JwtException

                if (username != null) { // Username extracted successfully
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(username); // Can throw
                                                                                                    // UsernameNotFoundException

                    if (jwtService.isTokenValid(jwt, userDetails)) {
                        Long tenantId = jwtService.extractTenantId(jwt); // Can throw JwtException if claim is malformed
                        TenantContext.setCurrentTenant(tenantId); // Set tenant context
                        tenantContextSetByThisFilter = true; // Mark that this filter set the tenant

                        log.debug("Authenticated user '{}' with tenant ID: {}. URI: {}", username, tenantId,
                                request.getRequestURI());

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    } else {
                        log.debug("Invalid JWT token for user '{}' (validation failed). URI: {}", username,
                                request.getRequestURI());
                        // SecurityContextHolder.clearContext(); // Not strictly necessary if not set by
                        // this block
                    }
                }
            }
        } catch (ExpiredJwtException e) {
            log.warn("JWT token is expired: {}. URI: {}", e.getMessage(), request.getRequestURI());
            SecurityContextHolder.clearContext(); // Ensure context is clear on auth failure
        } catch (UnsupportedJwtException e) {
            log.warn("JWT token is unsupported: {}. URI: {}", e.getMessage(), request.getRequestURI());
            SecurityContextHolder.clearContext();
        } catch (MalformedJwtException e) {
            log.warn("Invalid JWT token (malformed): {}. URI: {}", e.getMessage(), request.getRequestURI());
            SecurityContextHolder.clearContext();
        } catch (SignatureException e) {
            log.warn("Invalid JWT signature: {}. URI: {}", e.getMessage(), request.getRequestURI());
            SecurityContextHolder.clearContext();
        } catch (IllegalArgumentException e) { // e.g., token string is null/empty or NumberFormatException from claim
                                               // parsing
            log.warn("JWT claims string is empty or token is invalid (e.g. bad format for numeric claim): {}. URI: {}",
                    e.getMessage(), request.getRequestURI());
            SecurityContextHolder.clearContext();
        } catch (UsernameNotFoundException e) {
            log.warn("User not found for token: {}. URI: {}", e.getMessage(), request.getRequestURI());
            SecurityContextHolder.clearContext();
        } catch (JwtException e) { // Catch-all for other JWT related errors from jwtService
            log.error("General JWT processing error: {}. URI: {}", e.getMessage(), request.getRequestURI());
            SecurityContextHolder.clearContext();
        }
        // Avoid catching generic Exception here unless absolutely necessary,
        // as it can hide other types of issues.
        // The goal is to handle authentication-specific issues and then let the chain
        // proceed.

        try {
            filterChain.doFilter(request, response); // ALWAYS continue the filter chain
        } finally {
            if (tenantContextSetByThisFilter) {
                TenantContext.clear(); // Clear tenant context only if this filter instance set it
            }
        }
    }
}