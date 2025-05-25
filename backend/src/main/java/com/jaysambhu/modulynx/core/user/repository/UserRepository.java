package com.jaysambhu.modulynx.core.user.repository;

import com.jaysambhu.modulynx.core.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for the User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by username.
     *
     * @param username The username to search for
     * @return An Optional containing the user if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Find a user by email.
     *
     * @param email The email to search for
     * @return An Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user with the given username exists.
     *
     * @param username The username to check
     * @return true if a user exists with this username, false otherwise
     */
    boolean existsByUsername(String username);

    /**
     * Check if a user with the given email exists.
     *
     * @param email The email to check
     * @return true if a user exists with this email, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Find all users belonging to a specific tenant.
     *
     * @param tenantId The tenant ID
     * @return List of users belonging to the tenant
     */
    List<User> findByPrimaryTenantId(Long tenantId);

    /**
     * Find all users belonging to a specific tenant with pagination.
     *
     * @param tenantId The tenant ID
     * @param pageable Pagination information
     * @return Page of users belonging to the tenant
     */
    Page<User> findByPrimaryTenantId(Long tenantId, Pageable pageable);

    /**
     * Find all users associated with a specific company through UserCompanyRole.
     *
     * @param companyId The company ID
     * @return List of users associated with the company
     */
    @Query("SELECT DISTINCT u FROM User u JOIN u.userCompanyRoles ucr WHERE ucr.company.id = :companyId")
    List<User> findUsersByCompanyId(@Param("companyId") Long companyId);

    /**
     * Find all users associated with a specific company having a specific role.
     *
     * @param companyId The company ID
     * @param roleId    The role ID
     * @return List of users with the specified role in the company
     */
    @Query("SELECT DISTINCT u FROM User u JOIN u.userCompanyRoles ucr WHERE ucr.company.id = :companyId AND ucr.role.id = :roleId")
    List<User> findUsersByCompanyIdAndRoleId(@Param("companyId") Long companyId, @Param("roleId") Long roleId);

    /**
     * Search for users by name (first name or last name) within a tenant.
     *
     * @param searchTerm The search term to look for in first or last name
     * @param tenantId   The tenant ID
     * @param pageable   Pagination information
     * @return Page of matching users
     */
    @Query("SELECT u FROM User u WHERE (u.firstName LIKE %:searchTerm% OR u.lastName LIKE %:searchTerm%) AND u.primaryTenant.id = :tenantId")
    Page<User> searchUsersByName(@Param("searchTerm") String searchTerm, @Param("tenantId") Long tenantId,
            Pageable pageable);
}