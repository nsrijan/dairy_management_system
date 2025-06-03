package com.jaysambhu.modulynx.core.module.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;

import java.time.LocalDateTime;

/**
 * Entity representing the relationship between tenants and modules.
 * Tracks which modules are enabled for each tenant.
 */
@Entity
@Table(name = "tenant_module", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "tenant_id", "module_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Audited
public class TenantModule extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(name = "enabled_at")
    private LocalDateTime enabledAt;

    @Column(name = "disabled_at")
    private LocalDateTime disabledAt;

    @PrePersist
    public void prePersist() {
        if (enabled) {
            enabledAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (enabled) {
            enabledAt = LocalDateTime.now();
            disabledAt = null;
        } else {
            disabledAt = LocalDateTime.now();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof TenantModule))
            return false;
        TenantModule that = (TenantModule) o;
        return getId() != null && getId().equals(that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}