package com.jaysambhu.dairymanagementsystem.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jaysambhu.dairymanagementsystem.auth.model.Role;
import com.jaysambhu.dairymanagementsystem.commons.RoleType;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}