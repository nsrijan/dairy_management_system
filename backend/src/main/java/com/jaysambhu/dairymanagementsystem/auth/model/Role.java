package com.jaysambhu.dairymanagementsystem.auth.model;

import com.jaysambhu.dairymanagementsystem.commons.RoleType;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
    
    // Getters/setters for working with RoleType
    public RoleType getRoleType() {
        return name != null ? RoleType.valueOf(name) : null;
    }
    
    public void setRoleType(RoleType roleType) {
        this.name = roleType != null ? roleType.name() : null;
    }
}
