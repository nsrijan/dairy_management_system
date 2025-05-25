package com.jaysambhu.modulynx.core.tenant.controller;

import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.core.tenant.dto.TenantSettingsDto;
import com.jaysambhu.modulynx.core.tenant.dto.TenantPreferencesDto;
import com.jaysambhu.modulynx.core.tenant.service.TenantSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tenant-settings")
@RequiredArgsConstructor
public class TenantSettingsController {

    private final TenantSettingsService tenantSettingsService;

    @GetMapping("/settings")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantSettingsDto>> getCurrentTenantSettings() {
        return ResponseEntity.ok(GlobalApiResponse.<TenantSettingsDto>builder()
                .success(true)
                .message("Tenant settings retrieved successfully")
                .data(tenantSettingsService.getCurrentTenantSettings())
                .build());
    }

    @GetMapping("/{tenantId}/settings")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantSettingsDto>> getTenantSettings(@PathVariable Long tenantId) {
        return ResponseEntity.ok(GlobalApiResponse.<TenantSettingsDto>builder()
                .success(true)
                .message("Tenant settings retrieved successfully")
                .data(tenantSettingsService.getSettings(tenantId))
                .build());
    }

    @PutMapping("/settings")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantSettingsDto>> updateCurrentTenantSettings(
            @Valid @RequestBody TenantSettingsDto settings) {
        return ResponseEntity.ok(GlobalApiResponse.<TenantSettingsDto>builder()
                .success(true)
                .message("Tenant settings updated successfully")
                .data(tenantSettingsService.updateSettings(null, settings))
                .build());
    }

    @PutMapping("/{tenantId}/settings")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantSettingsDto>> updateTenantSettings(
            @PathVariable Long tenantId,
            @Valid @RequestBody TenantSettingsDto settings) {
        return ResponseEntity.ok(GlobalApiResponse.<TenantSettingsDto>builder()
                .success(true)
                .message("Tenant settings updated successfully")
                .data(tenantSettingsService.updateSettings(tenantId, settings))
                .build());
    }

    @GetMapping("/preferences")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantPreferencesDto>> getCurrentTenantPreferences() {
        return ResponseEntity.ok(GlobalApiResponse.<TenantPreferencesDto>builder()
                .success(true)
                .message("Tenant preferences retrieved successfully")
                .data(tenantSettingsService.getCurrentTenantPreferences())
                .build());
    }

    @GetMapping("/{tenantId}/preferences")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantPreferencesDto>> getTenantPreferences(@PathVariable Long tenantId) {
        return ResponseEntity.ok(GlobalApiResponse.<TenantPreferencesDto>builder()
                .success(true)
                .message("Tenant preferences retrieved successfully")
                .data(tenantSettingsService.getPreferences(tenantId))
                .build());
    }

    @PutMapping("/preferences")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantPreferencesDto>> updateCurrentTenantPreferences(
            @Valid @RequestBody TenantPreferencesDto preferences) {
        return ResponseEntity.ok(GlobalApiResponse.<TenantPreferencesDto>builder()
                .success(true)
                .message("Tenant preferences updated successfully")
                .data(tenantSettingsService.updatePreferences(null, preferences))
                .build());
    }

    @PutMapping("/{tenantId}/preferences")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantPreferencesDto>> updateTenantPreferences(
            @PathVariable Long tenantId,
            @Valid @RequestBody TenantPreferencesDto preferences) {
        return ResponseEntity.ok(GlobalApiResponse.<TenantPreferencesDto>builder()
                .success(true)
                .message("Tenant preferences updated successfully")
                .data(tenantSettingsService.updatePreferences(tenantId, preferences))
                .build());
    }
}