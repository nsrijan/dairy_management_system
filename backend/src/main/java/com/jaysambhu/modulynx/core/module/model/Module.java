package com.jaysambhu.modulynx.core.module.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;

import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a module in the system.
 * Modules are top-level business domains that can be enabled/disabled per
 * tenant.
 */
@Entity
@Table(name = "module")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Audited
public class Module extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Feature> features = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Module))
            return false;
        Module module = (Module) o;
        return getId() != null && getId().equals(module.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}