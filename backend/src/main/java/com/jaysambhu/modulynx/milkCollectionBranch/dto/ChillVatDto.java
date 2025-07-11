package com.jaysambhu.modulynx.milkCollectionBranch.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for ChillVat entity
 */
@Data
@Builder
public class ChillVatDto {
    private Long id;
    private String name;
    private Integer capacityInLiters;
    private Integer currentStockLiters;
    private Boolean isOperational;

    // Calculated fields
    private Integer availableCapacity;
    private Double capacityUtilization;

    // MCB info
    private Long milkCollectionBranchId;
    private String milkCollectionBranchName;

    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}