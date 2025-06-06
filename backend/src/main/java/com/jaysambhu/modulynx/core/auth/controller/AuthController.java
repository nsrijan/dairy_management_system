package com.jaysambhu.modulynx.core.auth.controller;

import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.context.TenantContext;
import com.jaysambhu.modulynx.core.auth.service.AuthService;
import com.jaysambhu.modulynx.core.user.dto.AuthResponse;
import com.jaysambhu.modulynx.core.user.dto.LoginRequest;
import com.jaysambhu.modulynx.core.user.dto.RegistrationRequest;
import com.jaysambhu.modulynx.core.user.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication operations
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

        private final AuthService authService;

        /**
         * Login endpoint
         *
         * @param loginRequest The login request
         * @return Authentication response with token
         */
        @PostMapping("/login")
        public ResponseEntity<GlobalApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest,
                        HttpServletRequest request) {
                log.debug("Login request received for user: {} from host: {}",
                                loginRequest.getUsernameOrEmail(),
                                request.getServerName());

                // Debug tenant context
                log.info("Tenant context during login: tenantId={}, isSuperAdmin={}, host={}",
                                TenantContext.getCurrentTenant(),
                                TenantContext.isSuperAdmin(),
                                request.getServerName());

                AuthResponse authResponse = authService.login(loginRequest);

                return ResponseEntity.ok(
                                GlobalApiResponse.<AuthResponse>builder()
                                                .success(true)
                                                .message("Authentication successful")
                                                .data(authResponse)
                                                .build());
        }

        /**
         * Register a new user (only available to admin and tenant admin)
         *
         * @param registrationRequest The registration request
         * @return The created user
         */
        @PostMapping("/register")
        @PreAuthorize("hasAnyRole('ROLE_SYSTEM_ADMIN', 'ROLE_TENANT_ADMIN')")
        public ResponseEntity<GlobalApiResponse<UserDto>> register(
                        @Valid @RequestBody RegistrationRequest registrationRequest) {
                log.debug("Registration request received for user: {}", registrationRequest.getUsername());
                UserDto user = authService.register(registrationRequest);

                return ResponseEntity.status(HttpStatus.CREATED).body(
                                GlobalApiResponse.<UserDto>builder()
                                                .success(true)
                                                .message("User registered successfully")
                                                .data(user)
                                                .build());
        }

        /**
         * Logout endpoint
         *
         * @param request The logout request
         * @return Success response
         */
        @PostMapping("/logout")
        public ResponseEntity<GlobalApiResponse<Void>> logout(@RequestHeader("Authorization") String authHeader) {
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        authService.logout(token);
                }

                return ResponseEntity.ok(
                                GlobalApiResponse.<Void>builder()
                                                .success(true)
                                                .message("Logged out successfully")
                                                .build());
        }

        /**
         * Validate token endpoint
         *
         * @param token The token to validate
         * @return Validation result
         */
        @GetMapping("/validate")
        public ResponseEntity<GlobalApiResponse<Boolean>> validateToken(@RequestParam String token) {
                boolean isValid = authService.validateToken(token);

                return ResponseEntity.ok(
                                GlobalApiResponse.<Boolean>builder()
                                                .success(true)
                                                .message(isValid ? "Token is valid" : "Token is invalid")
                                                .data(isValid)
                                                .build());
        }
}