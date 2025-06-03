package com.jaysambhu.modulynx.core.module.repository;

import com.jaysambhu.modulynx.core.module.model.TenantModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for the TenantModule entity.
 */
@Repository
public interface TenantModuleRepository extends JpaRepository<TenantModule, Long> {

    /**
     * Find all tenant-module relationships for a specific tenant
     * 
     * @param tenantId The tenant ID to filter by
     * @return List of tenant-module relationships
     */
    List<TenantModule> findByTenantId(Long tenantId);

    /**
     * Find all enabled tenant-module relationships for a specific tenant
     * 
     * @param tenantId The tenant ID to filter by
     * @param enabled  The enabled status to match
     * @return List of enabled tenant-module relationships
     */
    List<TenantModule> findByTenantIdAndEnabled(Long tenantId, boolean enabled);

    /**
     * Find a specific tenant-module relationship
     * 
     * @param tenantId The tenant ID
     * @param moduleId The module ID
     * @return Optional containing the relationship if found
     */
    Optional<TenantModule> findByTenantIdAndModuleId(Long tenantId, Long moduleId);

    /**
     * Check if a tenant-module relationship exists
     * 
     * @param tenantId The tenant ID
     * @param moduleId The module ID
     * @return true if the relationship exists
     */
    boolean existsByTenantIdAndModuleId(Long tenantId, Long moduleId);
}