package com.jaysambhu.modulynx.core.tenant.controller;

import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.core.tenant.service.TenantUserService;
import com.jaysambhu.modulynx.core.user.dto.UserDto;
import com.jaysambhu.modulynx.core.user.dto.UserRegistrationDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for tenant-specific user management operations.
 * These operations are scoped to the current tenant context.
 */
@RestController
@RequestMapping("/api/v1/tenant/users")
@RequiredArgsConstructor
@Slf4j
public class TenantUserController {

    private final TenantUserService tenantUserService;

    /**
     * Get all users in the current tenant
     *
     * @return List of users
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('PERMISSION_USER_READ')")
    public ResponseEntity<GlobalApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = tenantUserService.getAllUsers();

        return ResponseEntity.ok(
                GlobalApiResponse.<List<UserDto>>builder()
                        .success(true)
                        .message("Users retrieved successfully")
                        .data(users)
                        .build());
    }

    /**
     * Get all users in the current tenant with pagination
     *
     * @param pageable Pagination information
     * @return Page of users
     */
    @GetMapping("/paged")
    @PreAuthorize("hasAnyAuthority('PERMISSION_USER_READ')")
    public ResponseEntity<GlobalApiResponse<Page<UserDto>>> getAllUsersPaged(Pageable pageable) {
        Page<UserDto> usersPage = tenantUserService.getAllUsers(pageable);

        return ResponseEntity.ok(
                GlobalApiResponse.<Page<UserDto>>builder()
                        .success(true)
                        .message("Users page retrieved successfully")
                        .data(usersPage)
                        .build());
    }

    /**
     * Get a user by ID
     *
     * @param id User ID
     * @return The user
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_USER_READ')")
    public ResponseEntity<GlobalApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto user = tenantUserService.getUserById(id);

        return ResponseEntity.ok(
                GlobalApiResponse.<UserDto>builder()
                        .success(true)
                        .message("User retrieved successfully")
                        .data(user)
                        .build());
    }

    /**
     * Create a new user in the current tenant
     *
     * @param registrationDto User registration information
     * @return The created user
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('PERMISSION_USER_CREATE')")
    public ResponseEntity<GlobalApiResponse<UserDto>> createUser(
            @Valid @RequestBody UserRegistrationDto registrationDto) {
        UserDto createdUser = tenantUserService.createUser(registrationDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                GlobalApiResponse.<UserDto>builder()
                        .success(true)
                        .message("User created successfully")
                        .data(createdUser)
                        .build());
    }

    /**
     * Update a user
     *
     * @param id      User ID
     * @param userDto Updated user information
     * @return The updated user
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_USER_UPDATE')")
    public ResponseEntity<GlobalApiResponse<UserDto>> updateUser(@PathVariable Long id,
            @Valid @RequestBody UserDto userDto) {
        UserDto updatedUser = tenantUserService.updateUser(id, userDto);

        return ResponseEntity.ok(
                GlobalApiResponse.<UserDto>builder()
                        .success(true)
                        .message("User updated successfully")
                        .data(updatedUser)
                        .build());
    }

    /**
     * Delete a user
     *
     * @param id User ID
     * @return Success response
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_USER_DELETE')")
    public ResponseEntity<GlobalApiResponse<Void>> deleteUser(@PathVariable Long id) {
        tenantUserService.deleteUser(id);

        return ResponseEntity.ok(
                GlobalApiResponse.<Void>builder()
                        .success(true)
                        .message("User deleted successfully")
                        .build());
    }

    /**
     * Assign a role to a user
     *
     * @param userId    User ID
     * @param roleId    Role ID
     * @param companyId Company ID
     * @return The updated user
     */
    @PostMapping("/{userId}/roles/{roleId}/companies/{companyId}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_USER_UPDATE')")
    public ResponseEntity<GlobalApiResponse<UserDto>> assignRole(
            @PathVariable Long userId,
            @PathVariable Long roleId,
            @PathVariable Long companyId) {

        UserDto updatedUser = tenantUserService.assignRole(userId, roleId, companyId);

        return ResponseEntity.ok(
                GlobalApiResponse.<UserDto>builder()
                        .success(true)
                        .message("Role assigned successfully")
                        .data(updatedUser)
                        .build());
    }

    /**
     * Remove a role from a user
     *
     * @param userId    User ID
     * @param roleId    Role ID
     * @param companyId Company ID
     * @return The updated user
     */
    @DeleteMapping("/{userId}/roles/{roleId}/companies/{companyId}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_USER_UPDATE')")
    public ResponseEntity<GlobalApiResponse<UserDto>> removeRole(
            @PathVariable Long userId,
            @PathVariable Long roleId,
            @PathVariable Long companyId) {

        UserDto updatedUser = tenantUserService.removeRole(userId, roleId, companyId);

        return ResponseEntity.ok(
                GlobalApiResponse.<UserDto>builder()
                        .success(true)
                        .message("Role removed successfully")
                        .data(updatedUser)
                        .build());
    }
}