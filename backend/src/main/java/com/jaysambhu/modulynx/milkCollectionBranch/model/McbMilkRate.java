package com.jaysambhu.modulynx.milkCollectionBranch.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.MilkType;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.RateType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.hibernate.envers.Audited;

/**
 * Entity representing milk rates for buy/sell operations over time.
 * Tracks both raw and whole milk rates with effective date ranges.
 */
@Entity
@Table(name = "mcb_milk_rate", indexes = {
        @Index(name = "idx_mcb_milk_rate_effective", columnList = "milk_collection_branch_id, milk_type, rate_type, effective_from, effective_to"),
        @Index(name = "idx_mcb_milk_rate_current", columnList = "milk_collection_branch_id, milk_type, rate_type, effective_to")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Audited
public class McbMilkRate extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "milk_type", nullable = false, length = 20)
    private MilkType milkType;

    @Enumerated(EnumType.STRING)
    @Column(name = "rate_type", nullable = false, length = 20)
    private RateType rateType;

    @Column(name = "rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal rate;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    // ============ MILK COLLECTION BRANCH ASSOCIATION ============
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "milk_collection_branch_id", nullable = false)
    private MilkCollectionBranch milkCollectionBranch;

    // ============ UTILITY METHODS ============

    public boolean isCurrentlyActive() {
        LocalDate today = LocalDate.now();
        return !effectiveFrom.isAfter(today) &&
                (effectiveTo == null || !effectiveTo.isBefore(today));
    }

    public boolean isActiveOn(LocalDate date) {
        return !effectiveFrom.isAfter(date) &&
                (effectiveTo == null || !effectiveTo.isBefore(date));
    }

    public void closeRate(LocalDate endDate) {
        this.effectiveTo = endDate;
    }
}