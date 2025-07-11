package com.jaysambhu.modulynx.milkCollectionBranch.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request DTO for creating a new MCB with all related data
 */
@Data
public class CreateMilkCollectionBranchRequest {

    // MCB basic details
    @NotBlank(message = "Branch name is required")
    @Size(max = 100, message = "Branch name must not exceed 100 characters")
    private String branchName;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must not exceed 200 characters")
    private String location;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;

    @NotNull(message = "Active status is required")
    private Boolean isActive = true;

    // Manager details
    @NotBlank(message = "Manager name is required")
    @Size(max = 100, message = "Manager name must not exceed 100 characters")
    private String managerName;

    @NotBlank(message = "Manager username is required")
    @Size(min = 3, max = 50, message = "Manager username must be between 3 and 50 characters")
    private String managerUsername;

    @NotBlank(message = "Manager password is required")
    @Size(min = 6, message = "Manager password must be at least 6 characters")
    private String managerPassword;

    // Chill vats
    @NotEmpty(message = "At least one chill vat is required")
    @Valid
    private List<ChillVatRequest> chillVats;

    // Milk rates
    @NotNull(message = "Raw milk buy rate is required")
    @Positive(message = "Raw milk buy rate must be positive")
    private BigDecimal rawMilkBuyRate;

    @NotNull(message = "Raw milk sale rate is required")
    @Positive(message = "Raw milk sale rate must be positive")
    private BigDecimal rawMilkSaleRate;

    @NotNull(message = "Whole milk buy rate is required")
    @Positive(message = "Whole milk buy rate must be positive")
    private BigDecimal wholeMilkBuyRate;

    @NotNull(message = "Whole milk sale rate is required")
    @Positive(message = "Whole milk sale rate must be positive")
    private BigDecimal wholeMilkSaleRate;

    @Data
    public static class ChillVatRequest {
        @NotBlank(message = "Chill vat name is required")
        @Size(max = 50, message = "Chill vat name must not exceed 50 characters")
        private String name;

        @NotNull(message = "Chill vat capacity is required")
        @Positive(message = "Chill vat capacity must be positive")
        private Integer capacity;
    }
}