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

    /**
     * Find a user by username and tenant ID.
     *
     * @param username The username to search for
     * @param tenantId The tenant ID to filter by
     * @return An Optional containing the user if found
     */
    Optional<User> findByUsernameAndPrimaryTenantId(String username, Long tenantId);

    /**
     * Find a user by email and tenant ID.
     *
     * @param email    The email to search for
     * @param tenantId The tenant ID to filter by
     * @return An Optional containing the user if found
     */
    Optional<User> findByEmailAndPrimaryTenantId(String email, Long tenantId);

    /**
     * Find users by username or email and tenant ID.
     *
     * @param usernameOrEmail The username or email to search for
     * @param tenantId        The tenant ID to filter by
     * @return List of users matching the criteria
     */
    @Query("SELECT u FROM User u WHERE (u.username = :usernameOrEmail OR u.email = :usernameOrEmail) AND u.primaryTenant.id = :tenantId")
    List<User> findByUsernameOrEmailAndPrimaryTenantId(@Param("usernameOrEmail") String usernameOrEmail,
            @Param("tenantId") Long tenantId);

    /**
     * Find a user by username or email and tenant ID, returning the first match.
     *
     * @param usernameOrEmail The username or email to search for
     * @param tenantId        The tenant ID to filter by
     * @return An Optional containing the user if found
     */
    default Optional<User> findFirstByUsernameOrEmailAndPrimaryTenantId(String usernameOrEmail, Long tenantId) {
        List<User> users = findByUsernameOrEmailAndPrimaryTenantId(usernameOrEmail, tenantId);
        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    /**
     * Find system admin users (users with SYSTEM_ADMIN role)
     *
     * @param usernameOrEmail The username or email to search for
     * @return Optional containing the system admin user if found
     */
    @Query("SELECT DISTINCT u FROM User u JOIN u.userCompanyRoles ucr JOIN ucr.role r WHERE (u.username = :usernameOrEmail OR u.email = :usernameOrEmail) AND r.name = 'SYSTEM_ADMIN'")
    Optional<User> findSystemAdminByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);

    /**
     * Find a user by ID and company ID.
     *
     * @param userId    The user ID
     * @param companyId The company ID
     * @return Optional containing the user if found
     */
    @Query("SELECT DISTINCT u FROM User u JOIN u.userCompanyRoles ucr WHERE u.id = :userId AND ucr.company.id = :companyId")
    Optional<User> findByIdAndCompany_Id(@Param("userId") Long userId, @Param("companyId") Long companyId);

    /**
     * Find a user by username and company ID.
     *
     * @param username  The username
     * @param companyId The company ID
     * @return Optional containing the user if found
     */
    @Query("SELECT DISTINCT u FROM User u JOIN u.userCompanyRoles ucr WHERE u.username = :username AND ucr.company.id = :companyId")
    Optional<User> findByUsernameAndCompany_Id(@Param("username") String username, @Param("companyId") Long companyId);

    /**
     * Find users by company ID (alias for existing method for consistency).
     *
     * @param companyId The company ID
     * @return List of users associated with the company
     */
    @Query("SELECT DISTINCT u FROM User u JOIN u.userCompanyRoles ucr WHERE ucr.company.id = :companyId")
    List<User> findByCompany_Id(@Param("companyId") Long companyId);
}