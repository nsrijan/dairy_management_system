package com.jaysambhu.modulynx.milkCollectionBranch.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import org.hibernate.envers.Audited;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing a Chill Vat in a Milk Collection Branch.
 * Each MCB can have multiple chill vats.
 */
@Entity
@Table(name = "chill_vat", uniqueConstraints = {
        @UniqueConstraint(name = "uk_chill_vat_name_mcb", columnNames = { "name", "milk_collection_branch_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Audited
public class ChillVat extends BaseEntity {

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "capacity_in_liters", nullable = false, precision = 10, scale = 2)
    private Integer capacityInLiters;

    @Column(name = "current_stock_liters", precision = 10, scale = 2)
    @Builder.Default
    private Integer currentStockLiters = 0;

    @Column(name = "is_operational", nullable = false)
    @Builder.Default
    private Boolean isOperational = true;

    // ============ MILK COLLECTION BRANCH ASSOCIATION ============
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "milk_collection_branch_id", nullable = false)
    private MilkCollectionBranch milkCollectionBranch;

    // ============ UTILITY METHODS ============

    public boolean hasAvailableCapacity() {
        return currentStockLiters < capacityInLiters;
    }

    public Integer getAvailableCapacity() {
        return capacityInLiters - currentStockLiters;
    }

    public Double getCapacityUtilization() {
        if (capacityInLiters == 0) {
            return 0.0;
        }
        return (double) currentStockLiters / capacityInLiters * 100;
    }
}