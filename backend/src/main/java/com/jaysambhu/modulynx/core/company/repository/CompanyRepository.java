package com.jaysambhu.modulynx.core.company.repository;

import com.jaysambhu.modulynx.core.company.model.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    /**
     * Find the first company for a tenant
     *
     * @param tenantId The tenant ID
     * @return Optional containing the first company if found
     */
    Optional<Company> findFirstByTenantId(Long tenantId);

    /**
     * Example: Find company-specific data using CompanyContext
     * This method demonstrates how repository methods can leverage CompanyContext
     * for automatic scoping in business operations.
     * 
     * Note: This is a conceptual example. In practice, you would use CompanyContext
     * in service methods that call standard repository methods.
     */
    @Query("SELECT c FROM Company c WHERE c.id = :companyId")
    Optional<Company> findByIdForCurrentCompany(@Param("companyId") Long companyId);

    /**
     * Example: Custom query that could use CompanyContext for additional filtering
     * This demonstrates how custom queries can incorporate company-specific logic.
     */
    @Query("SELECT c FROM Company c WHERE c.id = :companyId AND c.isActive = true")
    Optional<Company> findActiveCompanyById(@Param("companyId") Long companyId);
}