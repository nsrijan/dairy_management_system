package com.jaysambhu.modulynx.core.user.repository;

import com.jaysambhu.modulynx.core.user.model.Role;
import com.jaysambhu.modulynx.core.user.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Role entity operations.
 * Provides data access methods for role management.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Finds a role by its name.
     *
     * @param name The role name to search for
     * @return Optional containing the role if found, empty otherwise
     */
    Optional<Role> findByName(RoleName name);

    /**
     * Checks if a role exists by its name.
     *
     * @param name The role name to check
     * @return true if the role exists, false otherwise
     */
    boolean existsByName(RoleName name);

    /**
     * Finds all roles associated with a specific company.
     *
     * @param companyId The ID of the company
     * @return List of roles for the company
     */
    @Query("SELECT DISTINCT r FROM Role r JOIN r.userCompanyRoles ucr WHERE ucr.company.id = :companyId")
    List<Role> findByCompanyId(@Param("companyId") Long companyId);
}