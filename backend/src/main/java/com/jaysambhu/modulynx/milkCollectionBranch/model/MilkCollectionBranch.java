package com.jaysambhu.modulynx.milkCollectionBranch.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import com.jaysambhu.modulynx.core.company.model.Company;
import com.jaysambhu.modulynx.core.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "milk_collection_branch", uniqueConstraints = {
        @UniqueConstraint(name = "uk_mcb_name_company", columnNames = { "name", "company_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Audited
public class MilkCollectionBranch extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @OneToMany(mappedBy = "milkCollectionBranch", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ChillVat> chillVats = new HashSet<>();

    @OneToMany(mappedBy = "milkCollectionBranch", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<McbMilkRate> milkRates = new HashSet<>();

    // ============ UTILITY METHODS ============

    /**
     * Calculates the total capacity of all chill vats in this branch.
     *
     * @return The sum of capacities in liters.
     */
    public Integer getTotalCapacity() {
        if (chillVats == null) {
            return 0;
        }
        return chillVats.stream().mapToInt(ChillVat::getCapacityInLiters).sum();
    }

    /**
     * Gets the count of chill vats in this branch.
     *
     * @return The number of chill vats.
     */
    public int getChillVatCount() {
        return chillVats != null ? chillVats.size() : 0;
    }
}