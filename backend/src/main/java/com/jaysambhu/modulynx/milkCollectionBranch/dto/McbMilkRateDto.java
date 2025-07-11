package com.jaysambhu.modulynx.milkCollectionBranch.dto;

import com.jaysambhu.modulynx.milkCollectionBranch.enums.MilkType;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.RateType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for McbMilkRate entity
 */
@Data
@Builder
public class McbMilkRateDto {
    private Long id;
    private MilkType milkType;
    private RateType rateType;
    private BigDecimal rate;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    private Boolean isCurrentlyActive;
    private String displayName;

    // MCB info
    private Long milkCollectionBranchId;
    private String milkCollectionBranchName;

    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}