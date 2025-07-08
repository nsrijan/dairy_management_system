package com.jaysambhu.modulynx.modules.dairy.milkcollection.repository;

import com.jaysambhu.modulynx.modules.dairy.milkcollection.model.MilkCollectionBranch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for MilkCollectionBranch with company-scoped methods.
 * Following the pattern for CompanyContext usage.
 */
@Repository
public interface MilkCollectionBranchRepository extends JpaRepository<MilkCollectionBranch, Long> {

    // ============ COMPANY-SCOPED METHODS (Required) ============
    // These are the key methods for CompanyContext usage

    /**
     * Find all MCBs by company ID
     * Used with CompanyContext.get() in service layer
     */
    List<MilkCollectionBranch> findByCompany_Id(Long companyId);

    /**
     * Find MCB by ID and company ID
     * Used with CompanyContext.get() for secure access
     */
    Optional<MilkCollectionBranch> findByIdAndCompany_Id(Long id, Long companyId);

    /**
     * Find active MCBs by company ID
     */
    List<MilkCollectionBranch> findByCompany_IdAndIsActive(Long companyId, Boolean isActive);

    /**
     * Find MCBs by company ID with pagination
     */
    Page<MilkCollectionBranch> findByCompany_Id(Long companyId, Pageable pageable);

    /**
     * Find MCB by code and company ID
     * Useful for unique code validation within company scope
     */
    Optional<MilkCollectionBranch> findByCodeAndCompany_Id(String code, Long companyId);

    /**
     * Check if MCB exists by code and company ID
     */
    boolean existsByCodeAndCompany_Id(String code, Long companyId);

    // ============ ADDITIONAL COMPANY-SCOPED QUERIES ============

    /**
     * Find MCBs by manager and company ID
     */
    List<MilkCollectionBranch> findByManager_IdAndCompany_Id(Long managerId, Long companyId);

    /**
     * Count MCBs by company ID
     */
    long countByCompany_Id(Long companyId);

    /**
     * Count active MCBs by company ID
     */
    long countByCompany_IdAndIsActive(Long companyId, Boolean isActive);

    /**
     * Find MCBs by name containing text and company ID
     */
    List<MilkCollectionBranch> findByNameContainingIgnoreCaseAndCompany_Id(String name, Long companyId);

    // ============ CUSTOM QUERIES FOR BUSINESS LOGIC ============

    /**
     * Find MCBs with available capacity by company ID
     */
    @Query("SELECT m FROM MilkCollectionBranch m WHERE m.company.id = :companyId " +
            "AND m.isActive = true " +
            "AND (m.currentStockLiters < m.capacityLiters OR m.capacityLiters IS NULL)")
    List<MilkCollectionBranch> findMcbsWithAvailableCapacity(@Param("companyId") Long companyId);

    /**
     * Get total capacity for company
     */
    @Query("SELECT COALESCE(SUM(m.capacityLiters), 0) FROM MilkCollectionBranch m " +
            "WHERE m.company.id = :companyId AND m.isActive = true")
    Long getTotalCapacityByCompanyId(@Param("companyId") Long companyId);

    /**
     * Get total current stock for company
     */
    @Query("SELECT COALESCE(SUM(m.currentStockLiters), 0) FROM MilkCollectionBranch m " +
            "WHERE m.company.id = :companyId AND m.isActive = true")
    Long getTotalCurrentStockByCompanyId(@Param("companyId") Long companyId);

    /**
     * Find MCBs by location pattern and company ID
     */
    @Query("SELECT m FROM MilkCollectionBranch m WHERE m.company.id = :companyId " +
            "AND LOWER(m.address) LIKE LOWER(CONCAT('%', :location, '%')) " +
            "AND m.isActive = true")
    List<MilkCollectionBranch> findByLocationContainingAndCompanyId(@Param("location") String location,
            @Param("companyId") Long companyId);

    // ============ TENANT-SCOPED METHODS (Fallback) ============
    // These can be used when company scope is not available

    /**
     * Find all MCBs by tenant ID (fallback when no company context)
     */
    List<MilkCollectionBranch> findByTenant_Id(Long tenantId);

    /**
     * Find MCB by ID and tenant ID (fallback)
     */
    Optional<MilkCollectionBranch> findByIdAndTenant_Id(Long id, Long tenantId);
}