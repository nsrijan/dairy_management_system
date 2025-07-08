package com.jaysambhu.modulynx.modules.dairy.milkcollection.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import com.jaysambhu.modulynx.core.company.model.Company;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.user.model.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing a Milk Collection Branch (MCB).
 * Company-scoped entity for dairy operations.
 */
@Entity
@Table(name = "milk_collection_branch", uniqueConstraints = {
        @UniqueConstraint(name = "uk_mcb_code_company", columnNames = { "code", "company_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MilkCollectionBranch extends BaseEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "capacity_liters")
    private Integer capacityLiters;

    @Column(name = "current_stock_liters")
    private Integer currentStockLiters;

    @Column(name = "chill_vat_count")
    private Integer chillVatCount;

    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // ============ COMPANY ASSOCIATION (COMPOSITION) ============
    // This is the key requirement - explicit Company association
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    // ============ OTHER RELATIONSHIPS ============

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    // Utility methods for business logic
    public boolean hasAvailableCapacity() {
        if (capacityLiters == null || currentStockLiters == null) {
            return true;
        }
        return currentStockLiters < capacityLiters;
    }

    public Integer getAvailableCapacity() {
        if (capacityLiters == null || currentStockLiters == null) {
            return null;
        }
        return capacityLiters - currentStockLiters;
    }

    public Double getCapacityUtilization() {
        if (capacityLiters == null || currentStockLiters == null || capacityLiters == 0) {
            return 0.0;
        }
        return (double) currentStockLiters / capacityLiters * 100;
    }
}