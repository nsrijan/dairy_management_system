package com.jaysambhu.modulynx.core.tenant.repository;

import com.jaysambhu.modulynx.core.tenant.model.TenantSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantSettingsRepository extends JpaRepository<TenantSettings, Long> {

    /**
     * Find settings by tenant ID
     * 
     * @param tenantId The tenant ID to search for
     * @return Optional containing the settings if found
     */
    Optional<TenantSettings> findByTenantId(Long tenantId);

    /**
     * Check if settings exist for a tenant
     * 
     * @param tenantId The tenant ID to check
     * @return true if settings exist, false otherwise
     */
    boolean existsByTenantId(Long tenantId);
}