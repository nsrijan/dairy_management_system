package com.jaysambhu.modulynx.milkCollectionBranch.repository;

import com.jaysambhu.modulynx.milkCollectionBranch.model.ChillVat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ChillVat entity with MCB and company-scoped operations
 */
@Repository
public interface ChillVatRepository extends JpaRepository<ChillVat, Long> {

        // Basic MCB-scoped queries
        List<ChillVat> findByMilkCollectionBranch_Id(Long mcbId);

        // Company-scoped queries for security
        @Query("SELECT cv FROM ChillVat cv WHERE cv.milkCollectionBranch.id = :mcbId " +
                        "AND cv.milkCollectionBranch.company.id = :companyId")
        List<ChillVat> findByMcbIdAndCompanyId(@Param("mcbId") Long mcbId, @Param("companyId") Long companyId);

        @Query("SELECT cv FROM ChillVat cv WHERE cv.id = :chillVatId " +
                        "AND cv.milkCollectionBranch.id = :mcbId " +
                        "AND cv.milkCollectionBranch.company.id = :companyId")
        Optional<ChillVat> findByIdAndMcbIdAndCompanyId(@Param("chillVatId") Long chillVatId,
                        @Param("mcbId") Long mcbId,
                        @Param("companyId") Long companyId);

        // Uniqueness checks
        boolean existsByNameAndMilkCollectionBranch_Id(String name, Long mcbId);

        boolean existsByNameAndMilkCollectionBranch_IdAndIdNot(String name, Long mcbId, Long excludeId);

        // Operational status queries
        List<ChillVat> findByMilkCollectionBranch_IdAndIsOperational(Long mcbId, Boolean isOperational);

        // Statistics queries
        @Query("SELECT COALESCE(SUM(cv.capacityInLiters), 0) FROM ChillVat cv " +
                        "WHERE cv.milkCollectionBranch.id = :mcbId")
        Integer getTotalCapacityByMcbId(@Param("mcbId") Long mcbId);

        @Query("SELECT COALESCE(SUM(cv.currentStockLiters), 0) FROM ChillVat cv " +
                        "WHERE cv.milkCollectionBranch.id = :mcbId")
        Integer getTotalCurrentStockByMcbId(@Param("mcbId") Long mcbId);

        @Query("SELECT COUNT(cv) FROM ChillVat cv WHERE cv.milkCollectionBranch.id = :mcbId " +
                        "AND cv.isOperational = true")
        Long countOperationalByMcbId(@Param("mcbId") Long mcbId);

        // Capacity utilization queries
        @Query("SELECT cv FROM ChillVat cv WHERE cv.milkCollectionBranch.id = :mcbId " +
                        "AND cv.currentStockLiters >= cv.capacityInLiters * 0.8")
        List<ChillVat> findNearCapacityByMcbId(@Param("mcbId") Long mcbId);
}