package com.jaysambhu.dairymanagementsystem.modules.tenant.repository;

import com.jaysambhu.dairymanagementsystem.modules.tenant.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {

    /**
     * Find a tenant by its unique slug
     * 
     * @param slug The slug to search for
     * @return An Optional containing the tenant if found
     */
    Optional<Tenant> findBySlug(String slug);

    /**
     * Find an active tenant by slug
     * 
     * @param slug     The slug to search for
     * @param isActive The active status to match
     * @return An Optional containing the tenant if found
     */
    Optional<Tenant> findBySlugAndIsActive(String slug, boolean isActive);
}