package com.jaysambhu.modulynx.modules.dairy.shop.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import com.jaysambhu.modulynx.core.company.model.Company;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * Entity representing a retail/wholesale Shop for dairy product sales.
 * Company-scoped entity for sales operations.
 */
@Entity
@Table(name = "shop", uniqueConstraints = {
        @UniqueConstraint(name = "uk_shop_code_company", columnNames = { "code", "company_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop extends BaseEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "daily_sales", precision = 12, scale = 2)
    private BigDecimal dailySales;

    @Column(name = "monthly_sales", precision = 12, scale = 2)
    private BigDecimal monthlySales;

    @Enumerated(EnumType.STRING)
    @Column(name = "shop_type", length = 50)
    private ShopType shopType;

    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    @Column(name = "opening_hours", length = 100)
    private String openingHours;

    @Column(name = "delivery_radius_km")
    private Integer deliveryRadiusKm;

    @Column(name = "storage_capacity_liters")
    private Integer storageCapacityLiters;

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

    // Enum for shop types
    public enum ShopType {
        RETAIL("Retail Store"),
        WHOLESALE("Wholesale Distributor"),
        FRANCHISE("Franchise Outlet"),
        ONLINE("Online Store"),
        KIOSK("Kiosk/Stand");

        private final String displayName;

        ShopType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Utility methods for business logic
    public boolean isOperational() {
        return isActive != null && isActive;
    }

    public BigDecimal getAverageDailySales() {
        if (monthlySales == null) {
            return BigDecimal.ZERO;
        }
        return monthlySales.divide(BigDecimal.valueOf(30), 2, BigDecimal.ROUND_HALF_UP);
    }

    public boolean hasDeliveryService() {
        return deliveryRadiusKm != null && deliveryRadiusKm > 0;
    }

    public boolean hasStorageCapacity() {
        return storageCapacityLiters != null && storageCapacityLiters > 0;
    }
}