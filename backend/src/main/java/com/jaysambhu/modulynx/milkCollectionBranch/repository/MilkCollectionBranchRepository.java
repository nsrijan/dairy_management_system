package com.jaysambhu.modulynx.milkCollectionBranch.repository;

import com.jaysambhu.modulynx.milkCollectionBranch.model.MilkCollectionBranch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for MilkCollectionBranch entity with company-scoped operations
 */
@Repository
public interface MilkCollectionBranchRepository extends JpaRepository<MilkCollectionBranch, Long> {

        // Basic company-scoped queries
        List<MilkCollectionBranch> findByCompany_Id(Long companyId);

        Optional<MilkCollectionBranch> findByIdAndCompany_Id(Long id, Long companyId);

        List<MilkCollectionBranch> findByCompany_IdAndIsActive(Long companyId, Boolean isActive);

        Page<MilkCollectionBranch> findByCompany_Id(Long companyId, Pageable pageable);

        // Uniqueness checks
        boolean existsByNameAndCompany_Id(String name, Long companyId);

        boolean existsByNameAndCompany_IdAndIdNot(String name, Long companyId, Long excludeId);

        // Search operations
        @Query("SELECT mcb FROM MilkCollectionBranch mcb WHERE mcb.company.id = :companyId " +
                        "AND (LOWER(mcb.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
                        "OR LOWER(mcb.location) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
        List<MilkCollectionBranch> searchByNameOrLocation(@Param("companyId") Long companyId,
                        @Param("searchTerm") String searchTerm);

        // Statistics queries
        long countByCompany_Id(Long companyId);

        long countByCompany_IdAndIsActive(Long companyId, Boolean isActive);

        @Query("SELECT COALESCE(SUM(cv.capacityInLiters), 0) FROM MilkCollectionBranch mcb " +
                        "JOIN mcb.chillVats cv WHERE mcb.company.id = :companyId")
        Integer getTotalCapacityByCompanyId(@Param("companyId") Long companyId);

        @Query("SELECT COALESCE(SUM(cv.currentStockLiters), 0) FROM MilkCollectionBranch mcb " +
                        "JOIN mcb.chillVats cv WHERE mcb.company.id = :companyId")
        Integer getTotalCurrentStockByCompanyId(@Param("companyId") Long companyId);

        // Manager-related queries
        List<MilkCollectionBranch> findByManager_IdAndCompany_Id(Long managerId, Long companyId);

        Optional<MilkCollectionBranch> findByManager_Id(Long managerId);
}