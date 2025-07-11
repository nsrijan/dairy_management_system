package com.jaysambhu.modulynx.milkCollectionBranch.service;

import com.jaysambhu.modulynx.milkCollectionBranch.dto.*;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.MilkType;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.RateType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Service interface for MilkCollectionBranch operations
 */
public interface MilkCollectionBranchService {

    // ============ MCB MANAGEMENT ============

    MilkCollectionBranchDto createMcb(CreateMilkCollectionBranchRequest request);

    MilkCollectionBranchDto updateMcb(Long mcbId, CreateMilkCollectionBranchRequest request);

    MilkCollectionBranchDto getMcbById(Long mcbId);

    List<MilkCollectionBranchDto> getAllMcbs();

    Page<MilkCollectionBranchDto> getMcbs(Pageable pageable);

    List<MilkCollectionBranchDto> getActiveMcbs();

    List<MilkCollectionBranchDto> searchMcbsByName(String searchTerm);

    void deleteMcb(Long mcbId);

    boolean isNameUnique(String name);

    // ============ CHILL VAT MANAGEMENT ============

    ChillVatDto addChillVat(Long mcbId, String name, Integer capacityInLiters);

    ChillVatDto updateChillVat(Long mcbId, Long chillVatId, String name, Integer capacityInLiters);

    List<ChillVatDto> getChillVatsByMcbId(Long mcbId);

    void deleteChillVat(Long mcbId, Long chillVatId);

    // ============ MILK RATE MANAGEMENT ============

    McbMilkRateDto addMilkRate(Long mcbId, MilkType milkType, RateType rateType,
            BigDecimal rate, LocalDate effectiveFrom);

    McbMilkRateDto getCurrentRate(Long mcbId, MilkType milkType, RateType rateType);

    List<McbMilkRateDto> getRateHistory(Long mcbId, MilkType milkType, RateType rateType);

    List<McbMilkRateDto> getCurrentRatesByMcbId(Long mcbId);

    void closeCurrentRate(Long mcbId, MilkType milkType, RateType rateType, LocalDate endDate);

    // ============ STATISTICS ============

    Map<String, Object> getCompanyStats();

    Map<String, Object> getMcbStats(Long mcbId);
}