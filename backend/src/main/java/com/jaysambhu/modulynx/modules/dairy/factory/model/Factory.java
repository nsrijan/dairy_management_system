package com.jaysambhu.modulynx.modules.dairy.factory.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import com.jaysambhu.modulynx.core.company.model.Company;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.user.model.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing a Factory for dairy processing operations.
 * Company-scoped entity for production management.
 */
@Entity
@Table(name = "factory", uniqueConstraints = {
        @UniqueConstraint(name = "uk_factory_code_company", columnNames = { "code", "company_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Factory extends BaseEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "production_capacity_per_day")
    private Integer productionCapacityPerDay;

    @Column(name = "current_production")
    private Integer currentProduction;

    @Enumerated(EnumType.STRING)
    @Column(name = "factory_type", length = 50)
    private FactoryType factoryType;

    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    @Column(name = "certifications", columnDefinition = "TEXT")
    private String certifications; // JSON or comma-separated

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

    // Enum for factory types
    public enum FactoryType {
        PROCESSING("Processing Plant"),
        PACKAGING("Packaging Facility"),
        STORAGE("Storage Facility"),
        MIXED("Mixed Operations");

        private final String displayName;

        FactoryType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Utility methods for business logic
    public boolean hasProductionCapacity() {
        if (productionCapacityPerDay == null || currentProduction == null) {
            return true;
        }
        return currentProduction < productionCapacityPerDay;
    }

    public Integer getAvailableCapacity() {
        if (productionCapacityPerDay == null || currentProduction == null) {
            return null;
        }
        return productionCapacityPerDay - currentProduction;
    }

    public Double getCapacityUtilization() {
        if (productionCapacityPerDay == null || currentProduction == null || productionCapacityPerDay == 0) {
            return 0.0;
        }
        return (double) currentProduction / productionCapacityPerDay * 100;
    }
}