package com.jaysambhu.modulynx.milkCollectionBranch.service;

import com.jaysambhu.modulynx.core.user.dto.UserDto;
import com.jaysambhu.modulynx.core.user.dto.UserRegistrationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for managing users associated with MCBs.
 * Handles manager assignment and MCB-specific user operations.
 */
public interface McbUserManagementService {

    /**
     * Create a manager user for an MCB
     *
     * @param mcbId               MCB ID
     * @param userRegistrationDto User registration information
     * @return The created user
     */
    UserDto createMcbManager(Long mcbId, UserRegistrationDto userRegistrationDto);

    /**
     * Assign an existing user as MCB manager
     *
     * @param mcbId  MCB ID
     * @param userId User ID to assign as manager
     * @return The updated user
     */
    UserDto assignMcbManager(Long mcbId, Long userId);

    /**
     * Remove manager from an MCB
     *
     * @param mcbId MCB ID
     */
    void removeMcbManager(Long mcbId);

    /**
     * Get the current manager of an MCB
     *
     * @param mcbId MCB ID
     * @return The manager user, or null if no manager assigned
     */
    UserDto getMcbManager(Long mcbId);

    /**
     * Get all users eligible to be MCB managers
     *
     * @return List of eligible users
     */
    List<UserDto> getEligibleMcbManagers();

    /**
     * Get all users eligible to be MCB managers with pagination
     *
     * @param pageable Pagination information
     * @return Page of eligible users
     */
    Page<UserDto> getEligibleMcbManagers(Pageable pageable);

    /**
     * Find user by username within company context
     *
     * @param username Username to search for
     * @return The user if found
     */
    UserDto findUserByUsername(String username);

    /**
     * Check if a user can be assigned as MCB manager
     *
     * @param userId User ID
     * @return true if user can be assigned as manager
     */
    boolean canAssignAsManager(Long userId);

    /**
     * Get all MCBs managed by a specific user
     *
     * @param userId User ID
     * @return List of MCB IDs managed by the user
     */
    List<Long> getMcbsMangedByUser(Long userId);
}