package com.jaysambhu.modulynx.core.module.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;

/**
 * Entity representing a feature within a module.
 * Features are specific functionalities that can be enabled/disabled per
 * tenant.
 */
@Entity
@Table(name = "feature")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Audited
public class Feature extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Feature))
            return false;
        Feature feature = (Feature) o;
        return getId() != null && getId().equals(feature.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}