package com.jaysambhu.modulynx.core.tenant.controller;

import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.core.tenant.dto.CreateTenantAdminRequest;
import com.jaysambhu.modulynx.core.tenant.dto.TenantAdminResponse;
import com.jaysambhu.modulynx.core.tenant.service.TenantAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing tenant administrators
 */
@RestController
@RequestMapping("/api/v1/tenants/{tenantId}/admins")
@RequiredArgsConstructor
@Slf4j
public class TenantAdminController {

    private final TenantAdminService tenantAdminService;

    /**
     * Create a new tenant admin
     *
     * @param tenantId The ID of the tenant
     * @param request  The admin creation request
     * @return The created admin
     */
    @PostMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or (hasRole('TENANT_ADMIN') and @tenantSecurityService.hasTenantAccess(#tenantId))")
    public ResponseEntity<GlobalApiResponse<TenantAdminResponse>> createAdmin(
            @PathVariable Long tenantId,
            @Valid @RequestBody CreateTenantAdminRequest request) {
        log.info("Creating new admin for tenant {}", tenantId);
        TenantAdminResponse admin = tenantAdminService.createAdmin(tenantId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GlobalApiResponse.<TenantAdminResponse>builder()
                        .success(true)
                        .message("Tenant admin created successfully")
                        .data(admin)
                        .build());
    }

    /**
     * Get all admins for a tenant
     *
     * @param tenantId The ID of the tenant
     * @return List of tenant admins
     */
    @GetMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or (hasRole('TENANT_ADMIN') and @tenantSecurityService.hasTenantAccess(#tenantId))")
    public ResponseEntity<GlobalApiResponse<List<TenantAdminResponse>>> getAdmins(@PathVariable Long tenantId) {
        log.info("Fetching admins for tenant {}", tenantId);
        List<TenantAdminResponse> admins = tenantAdminService.getAdmins(tenantId);

        return ResponseEntity.ok(GlobalApiResponse.<List<TenantAdminResponse>>builder()
                .success(true)
                .message("Tenant admins retrieved successfully")
                .data(admins)
                .build());
    }

    /**
     * Update a tenant admin's status
     *
     * @param tenantId The ID of the tenant
     * @param adminId  The ID of the admin
     * @param request  The status update request
     * @return The updated admin
     */
    @PatchMapping("/{adminId}/status")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or (hasRole('TENANT_ADMIN') and @tenantSecurityService.hasTenantAccess(#tenantId))")
    public ResponseEntity<GlobalApiResponse<TenantAdminResponse>> updateAdminStatus(
            @PathVariable Long tenantId,
            @PathVariable Long adminId,
            @Valid @RequestBody StatusUpdateRequest request) {
        log.info("Updating status for admin {} in tenant {}", adminId, tenantId);
        TenantAdminResponse admin = tenantAdminService.updateAdminStatus(tenantId, adminId, request.isActive());

        return ResponseEntity.ok(GlobalApiResponse.<TenantAdminResponse>builder()
                .success(true)
                .message("Tenant admin status updated successfully")
                .data(admin)
                .build());
    }

    static class StatusUpdateRequest {
        private boolean active;

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }
    }
}