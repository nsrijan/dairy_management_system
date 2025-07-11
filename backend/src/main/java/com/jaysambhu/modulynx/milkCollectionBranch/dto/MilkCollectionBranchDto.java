package com.jaysambhu.modulynx.milkCollectionBranch.dto;

import com.jaysambhu.modulynx.milkCollectionBranch.enums.MilkType;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.RateType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for MilkCollectionBranch entity with nested DTOs
 */
@Data
@Builder
public class MilkCollectionBranchDto {
    private Long id;
    private String name;
    private String location;
    private String phoneNumber;
    private Boolean isActive;

    // Company info
    private Long companyId;
    private String companyName;

    // Manager info
    private Long managerId;
    private String managerName;
    private String managerUsername;

    // Calculated fields
    private Integer totalCapacity;
    private Integer chillVatCount;

    // Related entities
    private List<ChillVatDto> chillVats;
    private List<CurrentMilkRateDto> currentRates;

    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    @Data
    @Builder
    public static class ChillVatDto {
        private Long id;
        private String name;
        private Integer capacityInLiters;
        private Integer currentStockLiters;
        private Boolean isOperational;
        private Integer availableCapacity;
        private Double capacityUtilization;
    }

    @Data
    @Builder
    public static class CurrentMilkRateDto {
        private Long id;
        private MilkType milkType;
        private RateType rateType;
        private BigDecimal rate;
        private LocalDate effectiveFrom;
        private String displayName;
    }
}
