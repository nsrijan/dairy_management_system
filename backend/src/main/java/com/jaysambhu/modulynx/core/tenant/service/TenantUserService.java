package com.jaysambhu.modulynx.core.tenant.service;

import com.jaysambhu.modulynx.core.user.dto.UserDto;
import com.jaysambhu.modulynx.core.user.dto.UserRegistrationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for tenant-specific user management operations.
 * These operations are scoped to the current tenant.
 */
public interface TenantUserService {

    /**
     * Create a new user in the current tenant
     *
     * @param userRegistrationDto User information
     * @return The created user
     */
    UserDto createUser(UserRegistrationDto userRegistrationDto);

    /**
     * Update a user in the current tenant
     *
     * @param id      User ID
     * @param userDto Updated user information
     * @return The updated user
     */
    UserDto updateUser(Long id, UserDto userDto);

    /**
     * Get a user by ID in the current tenant
     *
     * @param id User ID
     * @return The user
     */
    UserDto getUserById(Long id);

    /**
     * Get all users in the current tenant
     *
     * @return List of users
     */
    List<UserDto> getAllUsers();

    /**
     * Get all users in the current tenant with pagination
     *
     * @param pageable Pagination information
     * @return Page of users
     */
    Page<UserDto> getAllUsers(Pageable pageable);

    /**
     * Delete a user from the current tenant
     *
     * @param id User ID
     */
    void deleteUser(Long id);

    /**
     * Assign a role to a user in the current tenant
     *
     * @param userId    User ID
     * @param roleId    Role ID
     * @param companyId Company ID
     * @return Updated user
     */
    UserDto assignRole(Long userId, Long roleId, Long companyId);

    /**
     * Remove a role from a user in the current tenant
     *
     * @param userId    User ID
     * @param roleId    Role ID
     * @param companyId Company ID
     * @return Updated user
     */
    UserDto removeRole(Long userId, Long roleId, Long companyId);

    /**
     * Get all users in a specific tenant
     *
     * @param tenantId The ID of the tenant
     * @return List of users in the tenant
     */
    List<UserDto> getUsersByTenantId(Long tenantId);
}