package com.jaysambhu.modulynx.core.tenant.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;

/**
 * Entity representing a tenant in the system.
 * Core tenant identity and status information.
 */
@Entity
@Table(name = "tenant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Audited
public class Tenant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private boolean isActive;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModuleType moduleType;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Tenant))
            return false;
        Tenant tenant = (Tenant) o;
        return id != null && id.equals(tenant.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}