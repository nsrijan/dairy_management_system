package com.jaysambhu.modulynx.core.module.service;

import com.jaysambhu.modulynx.core.module.dto.TenantModuleDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing tenant-module relationships.
 */
public interface TenantModuleService {

    /**
     * Assign a module to a tenant
     * 
     * @param tenantModuleDto The tenant-module relationship data
     * @return The created relationship
     */
    TenantModuleDto assignModuleToTenant(TenantModuleDto tenantModuleDto);

    /**
     * Get all modules for a tenant
     * 
     * @param tenantId The tenant ID
     * @return List of tenant-module relationships
     */
    List<TenantModuleDto> getModulesByTenantId(Long tenantId);

    /**
     * Get all enabled modules for a tenant
     * 
     * @param tenantId The tenant ID
     * @return List of enabled tenant-module relationships
     */
    List<TenantModuleDto> getEnabledModulesByTenantId(Long tenantId);

    /**
     * Get a specific tenant-module relationship
     * 
     * @param tenantId The tenant ID
     * @param moduleId The module ID
     * @return Optional containing the relationship if found
     */
    Optional<TenantModuleDto> getTenantModule(Long tenantId, Long moduleId);

    /**
     * Enable or disable a module for a tenant
     * 
     * @param tenantId The tenant ID
     * @param moduleId The module ID
     * @param enabled  Whether to enable or disable
     * @return The updated relationship
     */
    TenantModuleDto toggleModuleForTenant(Long tenantId, Long moduleId, boolean enabled);

    /**
     * Remove a module from a tenant
     * 
     * @param tenantId The tenant ID
     * @param moduleId The module ID
     */
    void removeModuleFromTenant(Long tenantId, Long moduleId);
}