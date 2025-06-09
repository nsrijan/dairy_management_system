package com.jaysambhu.modulynx.core.user.repository;

import com.jaysambhu.modulynx.core.user.model.Role;
import com.jaysambhu.modulynx.core.user.model.RoleName;
import com.jaysambhu.modulynx.core.user.model.RoleType;
import com.jaysambhu.modulynx.core.user.model.ModuleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for the Role entity.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Find a role by its name.
     *
     * @param name The role name to search for
     * @return An Optional containing the role if found
     */
    Optional<Role> findByName(RoleName name);

    /**
     * Find all roles of a specific type.
     *
     * @param roleType The role type to filter by
     * @return List of roles of the specified type
     */
    List<Role> findByRoleType(RoleType roleType);

    /**
     * Check if a role with the given name exists.
     *
     * @param name The role name to check
     * @return true if a role exists with this name, false otherwise
     */
    boolean existsByName(RoleName name);

    /**
     * Find all roles for a specific module.
     *
     * @param moduleId The module ID to filter by
     * @return List of roles for the specified module
     */
    List<Role> findByModuleId(Long moduleId);

    /**
     * Find all roles for a specific module type.
     *
     * @param moduleType The module type to filter by
     * @return List of roles for the specified module type
     */
    List<Role> findByModuleType(ModuleType moduleType);

    /**
     * Find all global roles (roles not tied to any module).
     *
     * @return List of global roles
     */
    List<Role> findByModuleIsNull();
}