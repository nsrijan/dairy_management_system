package com.jaysambhu.dairymanagementsystem.modules.tenant.controller;

import com.jaysambhu.dairymanagementsystem.common.response.GlobalApiResponse;
import com.jaysambhu.dairymanagementsystem.context.TenantContext;
import com.jaysambhu.dairymanagementsystem.modules.user.model.User;
import com.jaysambhu.dairymanagementsystem.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controller for testing tenant context resolution.
 * This is a utility controller for development/testing only.
 */
@RestController
@RequestMapping("/api/v1/tenant-test")
@RequiredArgsConstructor
@Slf4j
public class TenantContextTestController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get the current tenant context information
     * 
     * @return Map with tenant context info
     */
    @GetMapping("/context")
    public ResponseEntity<GlobalApiResponse<Map<String, Object>>> getCurrentTenantContext()
            throws UnknownHostException {
        Map<String, Object> contextInfo = new HashMap<>();

        Long currentTenantId = TenantContext.getCurrentTenant();
        boolean isSuperAdmin = TenantContext.isSuperAdmin();

        contextInfo.put("currentTenantId", currentTenantId);
        contextInfo.put("isSuperAdmin", isSuperAdmin);

        try {
            contextInfo.put("hostName", InetAddress.getLocalHost().getHostName());
        } catch (UnknownHostException e) {
            contextInfo.put("hostName", "unknown");
            log.warn("Failed to get hostname", e);
        }

        log.info("Tenant context test: tenantId={}, isSuperAdmin={}", currentTenantId, isSuperAdmin);

        return ResponseEntity.ok(
                GlobalApiResponse.<Map<String, Object>>builder()
                        .success(true)
                        .message("Current tenant context information")
                        .data(contextInfo)
                        .build());
    }

    /**
     * Debug endpoint that doesn't require authentication, to check how tenant
     * resolution is working
     */
    @GetMapping("/debug")
    public ResponseEntity<GlobalApiResponse<Map<String, Object>>> debugTenantResolution(
            jakarta.servlet.http.HttpServletRequest request) {
        Map<String, Object> debugInfo = new HashMap<>();

        debugInfo.put("requestHost", request.getServerName());
        debugInfo.put("requestPort", request.getServerPort());
        debugInfo.put("requestUri", request.getRequestURI());
        debugInfo.put("currentTenantId", TenantContext.getCurrentTenant());
        debugInfo.put("isSuperAdmin", TenantContext.isSuperAdmin());

        log.info("Tenant debug info: {}", debugInfo);

        return ResponseEntity.ok(
                GlobalApiResponse.<Map<String, Object>>builder()
                        .success(true)
                        .message("Tenant resolution debug information")
                        .data(debugInfo)
                        .build());
    }

    /**
     * Debug endpoint to check if a user exists and its tenant
     */
    @GetMapping("/user-debug/{username}")
    public ResponseEntity<GlobalApiResponse<Map<String, Object>>> userDebug(@PathVariable String username) {
        Map<String, Object> userInfo = new HashMap<>();

        userInfo.put("searchUsername", username);
        userInfo.put("currentTenantId", TenantContext.getCurrentTenant());
        userInfo.put("isSuperAdmin", TenantContext.isSuperAdmin());

        // Look up the user
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            userInfo.put("userFound", true);
            userInfo.put("userId", user.getId());
            userInfo.put("userEmail", user.getEmail());
            userInfo.put("userActive", user.isActive());
            userInfo.put("primaryTenantId", user.getPrimaryTenant().getId());
            userInfo.put("primaryTenantName", user.getPrimaryTenant().getName());

            // Don't expose the actual password hash
            userInfo.put("hasPassword", user.getPassword() != null && !user.getPassword().isEmpty());
        } else {
            userInfo.put("userFound", false);
        }

        log.info("User debug info for '{}': {}", username, userInfo);

        return ResponseEntity.ok(
                GlobalApiResponse.<Map<String, Object>>builder()
                        .success(true)
                        .message("User debug information")
                        .data(userInfo)
                        .build());
    }

    /**
     * Debug endpoint to check password encoding
     */
    @GetMapping("/password-debug/{username}/{password}")
    public ResponseEntity<GlobalApiResponse<Map<String, Object>>> passwordDebug(
            @PathVariable String username, @PathVariable String password) {
        Map<String, Object> debugInfo = new HashMap<>();

        debugInfo.put("username", username);
        debugInfo.put("providedPassword", password);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String storedHash = user.getPassword();

            debugInfo.put("userFound", true);
            debugInfo.put("userId", user.getId());
            debugInfo.put("storedPasswordHash", storedHash);
            debugInfo.put("passwordMatches", passwordEncoder.matches(password, storedHash));

            // Generate a new hash for the given password for comparison
            String newHash = passwordEncoder.encode(password);
            debugInfo.put("newPasswordHash", newHash);
            debugInfo.put("newHashMatches", passwordEncoder.matches(password, newHash));
        } else {
            debugInfo.put("userFound", false);
        }

        log.info("Password debug for user '{}': {}", username, debugInfo);

        return ResponseEntity.ok(
                GlobalApiResponse.<Map<String, Object>>builder()
                        .success(true)
                        .message("Password verification debug information")
                        .data(debugInfo)
                        .build());
    }
}