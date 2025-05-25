package com.jaysambhu.modulynx.core.user.repository;

import com.jaysambhu.modulynx.core.user.model.UserCompanyRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Repository for the UserCompanyRole entity.
 */
@Repository
public interface UserCompanyRoleRepository extends JpaRepository<UserCompanyRole, Long> {

    /**
     * Find all user-company-role assignments for a specific user.
     *
     * @param userId The user ID to filter by
     * @return List of UserCompanyRole entities for the specified user
     */
    List<UserCompanyRole> findByUserId(Long userId);

    /**
     * Find all user-company-role assignments for a specific company.
     *
     * @param companyId The company ID to filter by
     * @return List of UserCompanyRole entities for the specified company
     */
    List<UserCompanyRole> findByCompanyId(Long companyId);

    /**
     * Find all users with a specific role in a company.
     *
     * @param companyId The company ID
     * @param roleId    The role ID
     * @return List of UserCompanyRole entities matching the criteria
     */
    List<UserCompanyRole> findByCompanyIdAndRoleId(Long companyId, Long roleId);

    /**
     * Find a specific user-company-role assignment.
     *
     * @param userId    The user ID
     * @param companyId The company ID
     * @param roleId    The role ID
     * @return Optional containing the UserCompanyRole if found
     */
    Optional<UserCompanyRole> findByUserIdAndCompanyIdAndRoleId(Long userId, Long companyId, Long roleId);

    /**
     * Find all roles a user has in a specific company.
     *
     * @param userId    The user ID
     * @param companyId The company ID
     * @return List of UserCompanyRole entities for the user in the company
     */
    List<UserCompanyRole> findByUserIdAndCompanyId(Long userId, Long companyId);

    /**
     * Check if a user has a specific role in a company.
     *
     * @param userId    The user ID
     * @param companyId The company ID
     * @param roleId    The role ID
     * @return true if the assignment exists, false otherwise
     */
    boolean existsByUserIdAndCompanyIdAndRoleId(Long userId, Long companyId, Long roleId);

    /**
     * Check if a user has any role in a company.
     *
     * @param userId    The user ID
     * @param companyId The company ID
     * @return true if the user has any role in the company, false otherwise
     */
    boolean existsByUserIdAndCompanyId(Long userId, Long companyId);

    /**
     * Find all role IDs a user has across all companies.
     *
     * @param userId The user ID
     * @return Set of role IDs associated with the user
     */
    @Query("SELECT DISTINCT ucr.role.id FROM UserCompanyRole ucr WHERE ucr.user.id = :userId AND ucr.isActive = true")
    Set<Long> findAllRoleIdsByUserId(@Param("userId") Long userId);

    /**
     * Find all company IDs a user has any role in.
     *
     * @param userId The user ID
     * @return Set of company IDs associated with the user
     */
    @Query("SELECT DISTINCT ucr.company.id FROM UserCompanyRole ucr WHERE ucr.user.id = :userId AND ucr.isActive = true")
    Set<Long> findAllCompanyIdsByUserId(@Param("userId") Long userId);

    /**
     * Delete all user-company-role assignments for a specific user.
     *
     * @param userId The user ID
     * @return The number of records deleted
     */
    @Modifying
    @Query("DELETE FROM UserCompanyRole ucr WHERE ucr.user.id = :userId")
    int deleteByUserId(@Param("userId") Long userId);

    /**
     * Delete a specific user-company-role assignment.
     *
     * @param userId    The user ID
     * @param companyId The company ID
     * @param roleId    The role ID
     * @return The number of records deleted (0 or 1)
     */
    @Modifying
    @Query("DELETE FROM UserCompanyRole ucr WHERE ucr.user.id = :userId AND ucr.company.id = :companyId AND ucr.role.id = :roleId")
    int deleteByUserIdAndCompanyIdAndRoleId(@Param("userId") Long userId, @Param("companyId") Long companyId,
            @Param("roleId") Long roleId);
}