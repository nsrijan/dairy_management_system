package com.jaysambhu.modulynx.core.company.repository;

import com.jaysambhu.modulynx.core.company.model.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for {@link Company} entity.
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    /**
     * Find all companies by tenant ID
     * 
     * @param tenantId The tenant ID to filter by
     * @return List of companies for the given tenant
     */
    List<Company> findByTenantId(Long tenantId);

    /**
     * Find all companies by tenant ID with pagination
     * 
     * @param tenantId The tenant ID to filter by
     * @param pageable Pagination information
     * @return Page of companies for the given tenant
     */
    Page<Company> findByTenantId(Long tenantId, Pageable pageable);

    /**
     * Find a company by ID and tenant ID
     * 
     * @param id       The company ID
     * @param tenantId The tenant ID
     * @return Optional containing the company if found
     */
    Optional<Company> findByIdAndTenantId(Long id, Long tenantId);

    /**
     * Find companies by name containing the given text and tenant ID
     * 
     * @param name     The name to search for
     * @param tenantId The tenant ID
     * @return List of matching companies
     */
    List<Company> findByNameContainingIgnoreCaseAndTenantId(String name, Long tenantId);

    /**
     * Check if a company with the given name exists for a tenant
     * 
     * @param name     The company name
     * @param tenantId The tenant ID
     * @return true if a company exists, false otherwise
     */
    boolean existsByNameAndTenantId(String name, Long tenantId);

    /**
     * Find a company by its name.
     * 
     * @param name the company name
     * @return an Optional containing the company if found
     */
    Optional<Company> findByName(String name);
}