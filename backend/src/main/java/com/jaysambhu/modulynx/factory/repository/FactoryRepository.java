package com.jaysambhu.modulynx.factory.repository;

import com.jaysambhu.modulynx.factory.model.Factory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Factory with company-scoped methods.
 * Following the pattern for CompanyContext usage.
 */
@Repository
public interface FactoryRepository extends JpaRepository<Factory, Long> {

        // ============ COMPANY-SCOPED METHODS (Required) ============

        /**
         * Find all factories by company ID
         * Used with CompanyContext.get() in service layer
         */
        List<Factory> findByCompany_Id(Long companyId);

        /**
         * Find factory by ID and company ID
         * Used with CompanyContext.get() for secure access
         */
        Optional<Factory> findByIdAndCompany_Id(Long id, Long companyId);

        /**
         * Find active factories by company ID
         */
        List<Factory> findByCompany_IdAndIsActive(Long companyId, Boolean isActive);

        /**
         * Find factories by company ID with pagination
         */
        Page<Factory> findByCompany_Id(Long companyId, Pageable pageable);

        /**
         * Count factories by company ID
         */
        long countByCompany_Id(Long companyId);

        /**
         * Count active factories by company ID
         */
        long countByCompany_IdAndIsActive(Long companyId, Boolean isActive);

        /**
         * Find factories by type and company ID
         */
        List<Factory> findByFactoryTypeAndCompany_Id(Factory.FactoryType factoryType, Long companyId);

        // ============ CUSTOM QUERIES FOR BUSINESS LOGIC ============

        /**
         * Get total production capacity for company
         */
        @Query("SELECT COALESCE(SUM(f.productionCapacityPerDay), 0) FROM Factory f " +
                        "WHERE f.company.id = :companyId AND f.isActive = true")
        Long getTotalProductionCapacityByCompanyId(@Param("companyId") Long companyId);

        /**
         * Get total current production for company
         */
        @Query("SELECT COALESCE(SUM(f.currentProduction), 0) FROM Factory f " +
                        "WHERE f.company.id = :companyId AND f.isActive = true")
        Long getTotalCurrentProductionByCompanyId(@Param("companyId") Long companyId);
}