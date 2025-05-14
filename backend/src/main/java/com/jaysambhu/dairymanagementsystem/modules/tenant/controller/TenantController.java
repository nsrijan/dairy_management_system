package com.jaysambhu.dairymanagementsystem.modules.tenant.controller;

import com.jaysambhu.dairymanagementsystem.common.response.GlobalApiResponse;
import com.jaysambhu.dairymanagementsystem.modules.tenant.dto.TenantDto;
import com.jaysambhu.dairymanagementsystem.modules.tenant.service.TenantService;
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

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GlobalApiResponse<List<TenantDto>>> getAllTenants() {
        List<TenantDto> tenants = tenantService.findAll();
        return ResponseEntity.ok(GlobalApiResponse.<List<TenantDto>>builder()
                .success(true)
                .message("Tenants retrieved successfully")
                .data(tenants)
                .build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantDto>> getTenantById(@PathVariable Long id) {
        return ResponseEntity.ok(GlobalApiResponse.<TenantDto>builder()
                .success(true)
                .message("Tenant retrieved successfully")
                .data(tenantService.mapToDto(tenantService.findById(id)))
                .build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GlobalApiResponse<TenantDto>> createTenant(@Valid @RequestBody TenantDto tenantDto) {
        TenantDto createdTenant = tenantService.create(tenantDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(GlobalApiResponse.<TenantDto>builder()
                .success(true)
                .message("Tenant created successfully")
                .data(createdTenant)
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
}