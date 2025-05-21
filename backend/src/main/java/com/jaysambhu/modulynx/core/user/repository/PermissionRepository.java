package com.jaysambhu.modulynx.core.user.repository;

import com.jaysambhu.modulynx.core.user.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

/**
 * Repository for the Permission entity.
 */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    /**
     * Find a permission by its name.
     *
     * @param name The permission name to search for
     * @return An Optional containing the permission if found
     */
    Optional<Permission> findByName(String name);

    /**
     * Check if a permission with the given name exists.
     *
     * @param name The permission name to check
     * @return true if a permission exists with this name, false otherwise
     */
    boolean existsByName(String name);

    /**
     * Find all permissions associated with a specific role.
     *
     * @param roleId The role ID
     * @return Set of permissions for the specified role
     */
    @Query("SELECT p FROM Permission p JOIN p.roles r WHERE r.id = :roleId")
    Set<Permission> findPermissionsByRoleId(@Param("roleId") Long roleId);

    /**
     * Find all permissions with names matching any in the provided set.
     *
     * @param names Set of permission names to search for
     * @return Set of matching permissions
     */
    Set<Permission> findByNameIn(Set<String> names);
}