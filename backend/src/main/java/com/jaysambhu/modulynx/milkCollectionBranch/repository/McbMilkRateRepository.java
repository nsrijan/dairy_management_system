package com.jaysambhu.modulynx.milkCollectionBranch.repository;

import com.jaysambhu.modulynx.milkCollectionBranch.enums.MilkType;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.RateType;
import com.jaysambhu.modulynx.milkCollectionBranch.model.McbMilkRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for McbMilkRate entity with temporal and company-scoped operations
 */
@Repository
public interface McbMilkRateRepository extends JpaRepository<McbMilkRate, Long> {

        // Basic MCB-scoped queries
        List<McbMilkRate> findByMilkCollectionBranch_Id(Long mcbId);

        // Company-scoped queries for security
        @Query("SELECT mr FROM McbMilkRate mr WHERE mr.milkCollectionBranch.id = :mcbId " +
                        "AND mr.milkCollectionBranch.company.id = :companyId")
        List<McbMilkRate> findByMcbIdAndCompanyId(@Param("mcbId") Long mcbId, @Param("companyId") Long companyId);

        // Current rate queries
        @Query("SELECT mr FROM McbMilkRate mr WHERE mr.milkCollectionBranch.id = :mcbId " +
                        "AND mr.milkType = :milkType AND mr.rateType = :rateType " +
                        "AND mr.effectiveFrom <= :date " +
                        "AND (mr.effectiveTo IS NULL OR mr.effectiveTo >= :date)")
        Optional<McbMilkRate> findCurrentRate(@Param("mcbId") Long mcbId,
                        @Param("milkType") MilkType milkType,
                        @Param("rateType") RateType rateType,
                        @Param("date") LocalDate date);

        @Query("SELECT mr FROM McbMilkRate mr WHERE mr.milkCollectionBranch.id = :mcbId " +
                        "AND mr.milkType = :milkType AND mr.rateType = :rateType " +
                        "AND mr.effectiveFrom <= :date " +
                        "AND (mr.effectiveTo IS NULL OR mr.effectiveTo >= :date) " +
                        "AND mr.milkCollectionBranch.company.id = :companyId")
        Optional<McbMilkRate> findCurrentRateWithCompanyId(@Param("mcbId") Long mcbId,
                        @Param("milkType") MilkType milkType,
                        @Param("rateType") RateType rateType,
                        @Param("date") LocalDate date,
                        @Param("companyId") Long companyId);

        // Rate history queries
        @Query("SELECT mr FROM McbMilkRate mr WHERE mr.milkCollectionBranch.id = :mcbId " +
                        "AND mr.milkType = :milkType AND mr.rateType = :rateType " +
                        "ORDER BY mr.effectiveFrom DESC")
        List<McbMilkRate> findRateHistory(@Param("mcbId") Long mcbId,
                        @Param("milkType") MilkType milkType,
                        @Param("rateType") RateType rateType);

        // Overlapping rate queries for validation
        @Query("SELECT mr FROM McbMilkRate mr WHERE mr.milkCollectionBranch.id = :mcbId " +
                        "AND mr.milkType = :milkType AND mr.rateType = :rateType " +
                        "AND mr.effectiveTo IS NULL")
        List<McbMilkRate> findOverlappingActiveRates(@Param("mcbId") Long mcbId,
                        @Param("milkType") MilkType milkType,
                        @Param("rateType") RateType rateType);

        // Statistics and analysis queries
        @Query("SELECT mr FROM McbMilkRate mr WHERE mr.milkCollectionBranch.id = :mcbId " +
                        "AND mr.effectiveTo IS NULL")
        List<McbMilkRate> findActiveRatesByMcbId(@Param("mcbId") Long mcbId);

        @Query("SELECT COUNT(mr) FROM McbMilkRate mr WHERE mr.milkCollectionBranch.id = :mcbId")
        Long countRateChangesByMcbId(@Param("mcbId") Long mcbId);
}