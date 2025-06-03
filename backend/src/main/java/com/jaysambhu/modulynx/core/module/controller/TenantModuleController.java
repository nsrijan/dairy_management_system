package com.jaysambhu.modulynx.core.module.controller;

import com.jaysambhu.modulynx.core.module.dto.TenantModuleDto;
import com.jaysambhu.modulynx.core.module.service.TenantModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing tenant-module relationships.
 */
@RestController
@RequestMapping("/api/tenant-modules")
@RequiredArgsConstructor
public class TenantModuleController {

    private final TenantModuleService tenantModuleService;

    /**
     * Assign a module to a tenant
     */
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<TenantModuleDto> assignModuleToTenant(
            @Valid @RequestBody TenantModuleDto tenantModuleDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tenantModuleService.assignModuleToTenant(tenantModuleDto));
    }

    /**
     * Get all modules for a tenant
     */
    @GetMapping("/tenant/{tenantId}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or @securityService.isTenantAdmin(#tenantId)")
    public ResponseEntity<List<TenantModuleDto>> getModulesByTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(tenantModuleService.getModulesByTenantId(tenantId));
    }

    /**
     * Get all enabled modules for a tenant
     */
    @GetMapping("/tenant/{tenantId}/enabled")
    @PreAuthorize("hasRole('SUPER_ADMIN') or @securityService.isTenantAdmin(#tenantId)")
    public ResponseEntity<List<TenantModuleDto>> getEnabledModulesByTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(tenantModuleService.getEnabledModulesByTenantId(tenantId));
    }

    /**
     * Get a specific tenant-module relationship
     */
    @GetMapping("/tenant/{tenantId}/module/{moduleId}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or @securityService.isTenantAdmin(#tenantId)")
    public ResponseEntity<TenantModuleDto> getTenantModule(
            @PathVariable Long tenantId,
            @PathVariable Long moduleId) {
        return tenantModuleService.getTenantModule(tenantId, moduleId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Enable or disable a module for a tenant
     */
    @PutMapping("/tenant/{tenantId}/module/{moduleId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<TenantModuleDto> toggleModuleForTenant(
            @PathVariable Long tenantId,
            @PathVariable Long moduleId,
            @RequestParam boolean enabled) {
        return ResponseEntity.ok(tenantModuleService.toggleModuleForTenant(tenantId, moduleId, enabled));
    }

    /**
     * Remove a module from a tenant
     */
    @DeleteMapping("/tenant/{tenantId}/module/{moduleId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> removeModuleFromTenant(
            @PathVariable Long tenantId,
            @PathVariable Long moduleId) {
        tenantModuleService.removeModuleFromTenant(tenantId, moduleId);
        return ResponseEntity.noContent().build();
    }
}