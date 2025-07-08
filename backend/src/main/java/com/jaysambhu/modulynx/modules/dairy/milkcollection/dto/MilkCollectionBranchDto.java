package com.jaysambhu.modulynx.modules.dairy.milkcollection.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class MilkCollectionBranchDto {
    private Long id;
    private Long branchId;
    private Long farmerId;
    private LocalDate collectionDate;
    private LocalTime collectionTime;
    private Double quantityInLiters;
    private Double fatContent;
    private Double snfContent;
    private Double ratePerLiter;
    private Double totalAmount;
}
