package com.jaysambhu.modulynx.core.tenant.controller;

import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.core.tenant.dto.TenantDto;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.tenant.repository.TenantRepository;
import com.jaysambhu.modulynx.core.tenant.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;
    private final TenantRepository tenantRepository;

    @GetMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or hasRole('TENANT_ADMIN')")
    public ResponseEntity<GlobalApiResponse<List<TenantDto>>> getAllTenants() {
        List<TenantDto> tenants = tenantService.findAll();
        return ResponseEntity.ok(GlobalApiResponse.<List<TenantDto>>builder()
                .success(true)
                .message("Tenants retrieved successfully")
                .data(tenants)
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or hasRole('TENANT_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantDto>> getTenantById(@PathVariable Long id) {
        return ResponseEntity.ok(GlobalApiResponse.<TenantDto>builder()
                .success(true)
                .message("Tenant retrieved successfully")
                .data(tenantService.mapToDto(tenantService.findById(id)))
                .build());
    }

    @PostMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantDto>> createTenant(@Valid @RequestBody TenantDto tenantDto) {
        TenantDto createdTenant = tenantService.create(tenantDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(GlobalApiResponse.<TenantDto>builder()
                .success(true)
                .message("Tenant created successfully")
                .data(createdTenant)
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or hasRole('TENANT_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantDto>> updateTenant(
            @PathVariable Long id, @Valid @RequestBody TenantDto tenantDto) {
        TenantDto updatedTenant = tenantService.update(id, tenantDto);
        return ResponseEntity.ok(GlobalApiResponse.<TenantDto>builder()
                .success(true)
                .message("Tenant updated successfully")
                .data(updatedTenant)
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<GlobalApiResponse<Void>> deleteTenant(@PathVariable Long id) {
        tenantService.delete(id);
        return ResponseEntity.ok(GlobalApiResponse.<Void>builder()
                .success(true)
                .message("Tenant deleted successfully")
                .build());
    }

    @GetMapping("/current")
    public ResponseEntity<GlobalApiResponse<TenantDto>> getCurrentTenant() {
        return ResponseEntity.ok(GlobalApiResponse.<TenantDto>builder()
                .success(true)
                .message("Current tenant retrieved successfully")
                .data(tenantService.getCurrentTenant())
                .build());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or hasRole('TENANT_ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantDto>> changeTenantStatus(
            @PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        TenantDto updatedTenant = tenantService.updateStatus(id, request.isActive());

        return ResponseEntity.ok(GlobalApiResponse.<TenantDto>builder()
                .success(true)
                .message("Tenant status updated successfully")
                .data(updatedTenant)
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