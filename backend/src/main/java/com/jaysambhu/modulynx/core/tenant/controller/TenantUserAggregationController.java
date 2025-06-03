package com.jaysambhu.modulynx.core.tenant.controller;

import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.core.tenant.dto.TenantAdminResponse;
import com.jaysambhu.modulynx.core.tenant.dto.TenantUserAggregationResponse;
import com.jaysambhu.modulynx.core.tenant.service.TenantAdminService;
import com.jaysambhu.modulynx.core.tenant.service.TenantUserService;
import com.jaysambhu.modulynx.core.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for aggregating tenant user information.
 * This controller combines data from both admin and regular user services.
 */
@RestController
@RequestMapping("/api/v1/tenants/{tenantId}/aggregated-users")
@RequiredArgsConstructor
@Slf4j
public class TenantUserAggregationController {

    private final TenantAdminService tenantAdminService;
    private final TenantUserService tenantUserService;

    /**
     * Get all users (both admins and regular users) for a tenant
     *
     * @param tenantId The ID of the tenant
     * @return Combined list of admins and users with counts
     */
    @GetMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or (hasRole('TENANT_ADMIN') and @tenantSecurityService.hasTenantAccess(#tenantId))")
    public ResponseEntity<GlobalApiResponse<TenantUserAggregationResponse>> getAggregatedUsers(
            @PathVariable Long tenantId) {
        log.info("Fetching aggregated users for tenant {}", tenantId);

        // Get admins and users
        List<TenantAdminResponse> admins = tenantAdminService.getAdmins(tenantId);
        List<UserDto> users = tenantUserService.getUsersByTenantId(tenantId);

        // Build response
        TenantUserAggregationResponse response = TenantUserAggregationResponse.builder()
                .admins(admins)
                .users(users)
                .adminCount(admins.size())
                .userCount(users.size())
                .totalCount(admins.size() + users.size())
                .build();

        return ResponseEntity.ok(
                GlobalApiResponse.<TenantUserAggregationResponse>builder()
                        .success(true)
                        .message("Users retrieved successfully")
                        .data(response)
                        .build());
    }
}