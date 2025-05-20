package com.jaysambhu.dairymanagementsystem.modules.user.controller;

import com.jaysambhu.dairymanagementsystem.common.response.GlobalApiResponse;
import com.jaysambhu.dairymanagementsystem.context.TenantContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Test controller for verifying authentication and authorization.
 * This controller provides endpoints to test different security scenarios.
 */
@RestController
@RequestMapping("/api/v1/test")
public class UserTestController {

    /**
     * Public endpoint that doesn't require authentication
     */
    @GetMapping("/public")
    public ResponseEntity<GlobalApiResponse<String>> publicEndpoint() {
        return ResponseEntity.ok(
                GlobalApiResponse.<String>builder()
                        .success(true)
                        .message("Public endpoint accessible without authentication")
                        .data("This is a public endpoint")
                        .build());
    }

    /**
     * Private endpoint that requires authentication but no specific role
     */
    @GetMapping("/authenticated")
    public ResponseEntity<GlobalApiResponse<String>> authenticatedEndpoint() {
        return ResponseEntity.ok(
                GlobalApiResponse.<String>builder()
                        .success(true)
                        .message("Protected endpoint accessible with authentication")
                        .data("This is a protected endpoint requiring authentication")
                        .build());
    }

    /**
     * Admin-only endpoint that requires SYSTEM_ADMIN role
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ROLE_SYSTEM_ADMIN')")
    public ResponseEntity<GlobalApiResponse<String>> adminEndpoint() {
        return ResponseEntity.ok(
                GlobalApiResponse.<String>builder()
                        .success(true)
                        .message("Admin endpoint accessible to system administrators only")
                        .data("This is an admin-protected endpoint")
                        .build());
    }

    /**
     * Endpoint that requires USER_READ permission
     */
    @GetMapping("/users/read")
    @PreAuthorize("hasAuthority('PERMISSION_USER_READ')")
    public ResponseEntity<GlobalApiResponse<String>> userReadEndpoint() {
        return ResponseEntity.ok(
                GlobalApiResponse.<String>builder()
                        .success(true)
                        .message("User read endpoint accessible with USER_READ permission")
                        .data("This endpoint requires USER_READ permission")
                        .build());
    }

    /**
     * Endpoint that returns the current authentication details
     */
    @GetMapping("/me")
    public ResponseEntity<GlobalApiResponse<Map<String, Object>>> currentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> details = new HashMap<>();
        details.put("username", authentication.getName());
        details.put("tenant", TenantContext.getCurrentTenant());

        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        details.put("authorities", authorities);
        details.put("authenticated", authentication.isAuthenticated());

        return ResponseEntity.ok(
                GlobalApiResponse.<Map<String, Object>>builder()
                        .success(true)
                        .message("Current user details")
                        .data(details)
                        .build());
    }
}