package com.jaysambhu.modulynx.core.tenant.repository;

import com.jaysambhu.modulynx.core.tenant.model.TenantPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantPreferencesRepository extends JpaRepository<TenantPreferences, Long> {

    /**
     * Find preferences by tenant ID
     * 
     * @param tenantId The tenant ID to search for
     * @return Optional containing the preferences if found
     */
    Optional<TenantPreferences> findByTenantId(Long tenantId);

    /**
     * Check if preferences exist for a tenant
     * 
     * @param tenantId The tenant ID to check
     * @return true if preferences exist, false otherwise
     */
    boolean existsByTenantId(Long tenantId);
}