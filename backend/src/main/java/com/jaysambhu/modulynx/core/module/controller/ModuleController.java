package com.jaysambhu.modulynx.core.module.controller;

import com.jaysambhu.modulynx.core.module.dto.ModuleDto;
import com.jaysambhu.modulynx.core.module.service.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing modules.
 */
@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    /**
     * Create a new module
     */
    @PostMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<ModuleDto> createModule(@Valid @RequestBody ModuleDto moduleDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(moduleService.createModule(moduleDto));
    }

    /**
     * Get a module by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<ModuleDto> getModule(@PathVariable Long id) {
        return moduleService.getModuleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get a module by code
     */
    @GetMapping("/code/{code}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<ModuleDto> getModuleByCode(@PathVariable String code) {
        return moduleService.getModuleByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all modules with pagination
     */
    @GetMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Page<ModuleDto>> getAllModules(Pageable pageable) {
        return ResponseEntity.ok(moduleService.getAllModules(pageable));
    }

    /**
     * Update a module
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<ModuleDto> updateModule(
            @PathVariable Long id,
            @Valid @RequestBody ModuleDto moduleDto) {
        return ResponseEntity.ok(moduleService.updateModule(id, moduleDto));
    }

    /**
     * Delete a module
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }
}