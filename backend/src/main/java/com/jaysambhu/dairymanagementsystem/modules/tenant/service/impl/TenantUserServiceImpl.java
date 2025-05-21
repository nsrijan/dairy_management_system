package com.jaysambhu.dairymanagementsystem.modules.tenant.service.impl;

import com.jaysambhu.dairymanagementsystem.common.exception.BadRequestException;
import com.jaysambhu.dairymanagementsystem.common.exception.ResourceNotFoundException;
import com.jaysambhu.dairymanagementsystem.common.service.AbstractTenantAwareService;
import com.jaysambhu.dairymanagementsystem.context.TenantContext;
import com.jaysambhu.dairymanagementsystem.modules.tenant.model.Tenant;
import com.jaysambhu.dairymanagementsystem.modules.tenant.service.TenantService;
import com.jaysambhu.dairymanagementsystem.modules.tenant.service.TenantUserService;
import com.jaysambhu.dairymanagementsystem.modules.user.dto.UserDto;
import com.jaysambhu.dairymanagementsystem.modules.user.dto.UserRegistrationDto;
import com.jaysambhu.dairymanagementsystem.modules.user.model.Role;
import com.jaysambhu.dairymanagementsystem.modules.user.model.User;
import com.jaysambhu.dairymanagementsystem.modules.user.model.UserCompanyRole;
import com.jaysambhu.dairymanagementsystem.modules.user.repository.RoleRepository;
import com.jaysambhu.dairymanagementsystem.modules.user.repository.UserCompanyRoleRepository;
import com.jaysambhu.dairymanagementsystem.modules.user.repository.UserRepository;
import com.jaysambhu.dairymanagementsystem.modules.company.model.Company;
import com.jaysambhu.dairymanagementsystem.modules.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of TenantUserService for tenant-specific user management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TenantUserServiceImpl extends AbstractTenantAwareService implements TenantUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;
    private final TenantService tenantService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDto createUser(UserRegistrationDto registrationDto) {
        // Get current tenant ID - this ensures users can only be created in the current
        // tenant context
        Long tenantId = TenantContext.getCurrentTenant();
        if (TenantContext.isSuperAdmin()) {
            // For super admin, use the tenantId from the DTO if provided
            if (registrationDto.getTenantId() != null) {
                tenantId = registrationDto.getTenantId();
            } else {
                throw new BadRequestException("Tenant ID is required when creating a user as super admin");
            }
        }

        // Validate tenant
        Tenant tenant = tenantService.findById(tenantId);

        // Check username and email uniqueness
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        // Create user entity
        User user = User.builder()
                .username(registrationDto.getUsername())
                .email(registrationDto.getEmail())
                .password(passwordEncoder.encode(registrationDto.getPassword()))
                .firstName(registrationDto.getFirstName())
                .lastName(registrationDto.getLastName())
                .phone(registrationDto.getPhone())
                .isActive(true)
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .userType(registrationDto.getUserType())
                .primaryTenant(tenant)
                .build();

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setVersion(0L);

        // Save user
        User savedUser = userRepository.save(user);
        log.info("Created user: {} for tenant: {}", savedUser.getUsername(), tenantId);

        // Assign company roles if provided
        if (registrationDto.getCompanyIds() != null && registrationDto.getRoleIds() != null
                && registrationDto.getCompanyIds().length > 0
                && registrationDto.getCompanyIds().length == registrationDto.getRoleIds().length) {

            for (int i = 0; i < registrationDto.getCompanyIds().length; i++) {
                Long companyId = registrationDto.getCompanyIds()[i];
                Long roleId = registrationDto.getRoleIds()[i];

                // Verify company belongs to the tenant
                Company company = companyRepository.findByIdAndTenantId(companyId, tenantId)
                        .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

                // Get the role
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));

                // Create user company role
                UserCompanyRole userCompanyRole = UserCompanyRole.builder()
                        .user(savedUser)
                        .company(company)
                        .role(role)
                        .isActive(true)
                        .build();

                userCompanyRole.setCreatedAt(LocalDateTime.now());
                userCompanyRole.setUpdatedAt(LocalDateTime.now());
                userCompanyRole.setVersion(0L);

                userCompanyRoleRepository.save(userCompanyRole);
                log.info("Assigned role: {} in company: {} to user: {}", role.getName(), company.getName(),
                        savedUser.getUsername());
            }
        }

        return mapUserToDto(savedUser);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        Long tenantId = TenantContext.getCurrentTenant();

        // Find user ensuring they belong to the current tenant
        User user = findUserByIdAndTenantId(id, tenantId);

        // Check if email is being changed and is unique
        if (!user.getEmail().equals(userDto.getEmail()) && userRepository.existsByEmail(userDto.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        // Update user fields
        user.setEmail(userDto.getEmail());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPhone(userDto.getPhone());
        user.setActive(userDto.isActive());

        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        log.info("Updated user: {} in tenant: {}", updatedUser.getUsername(), tenantId);

        return mapUserToDto(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        Long tenantId = TenantContext.getCurrentTenant();
        User user = findUserByIdAndTenantId(id, tenantId);
        return mapUserToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return findAllTenantAware(
                tenantId -> userRepository.findByPrimaryTenantId(tenantId),
                userRepository::findAll).stream().map(this::mapUserToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(Pageable pageable) {
        return findAllTenantAware(
                pageable,
                tenantId -> userRepository.findByPrimaryTenantId(tenantId, pageable),
                userRepository::findAll).map(this::mapUserToDto);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        Long tenantId = TenantContext.getCurrentTenant();
        User user = findUserByIdAndTenantId(id, tenantId);

        // First delete user-company-role associations
        userCompanyRoleRepository.deleteByUserId(user.getId());

        // Then delete the user
        userRepository.delete(user);
        log.info("Deleted user: {} from tenant: {}", user.getUsername(), tenantId);
    }

    @Override
    @Transactional
    public UserDto assignRole(Long userId, Long roleId, Long companyId) {
        Long tenantId = TenantContext.getCurrentTenant();

        // Find user ensuring they belong to the current tenant
        User user = findUserByIdAndTenantId(userId, tenantId);

        // Verify company belongs to the tenant
        Company company = companyRepository.findByIdAndTenantId(companyId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        // Get the role
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));

        // Check if association already exists
        if (userCompanyRoleRepository.existsByUserIdAndCompanyIdAndRoleId(userId, companyId, roleId)) {
            throw new BadRequestException("User already has this role in the company");
        }

        // Create user company role
        UserCompanyRole userCompanyRole = UserCompanyRole.builder()
                .user(user)
                .company(company)
                .role(role)
                .isActive(true)
                .build();

        userCompanyRole.setCreatedAt(LocalDateTime.now());
        userCompanyRole.setUpdatedAt(LocalDateTime.now());
        userCompanyRole.setVersion(0L);

        userCompanyRoleRepository.save(userCompanyRole);
        log.info("Assigned role: {} in company: {} to user: {}", role.getName(), company.getName(), user.getUsername());

        return mapUserToDto(user);
    }

    @Override
    @Transactional
    public UserDto removeRole(Long userId, Long roleId, Long companyId) {
        Long tenantId = TenantContext.getCurrentTenant();

        // Find user ensuring they belong to the current tenant
        User user = findUserByIdAndTenantId(userId, tenantId);

        // Delete the association
        int deleted = userCompanyRoleRepository.deleteByUserIdAndCompanyIdAndRoleId(userId, companyId, roleId);

        if (deleted == 0) {
            throw new ResourceNotFoundException("UserCompanyRole", "combination",
                    String.format("userId=%d, companyId=%d, roleId=%d", userId, companyId, roleId));
        }

        log.info("Removed role with ID: {} in company: {} from user: {}", roleId, companyId, user.getUsername());

        return mapUserToDto(user);
    }

    /**
     * Find a user by ID ensuring they belong to the specified tenant
     */
    private User findUserByIdAndTenantId(Long userId, Long tenantId) {
        if (TenantContext.isSuperAdmin()) {
            return userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        } else {
            return userRepository.findById(userId)
                    .filter(user -> user.getPrimaryTenant().getId().equals(tenantId))
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        }
    }

    /**
     * Map User entity to UserDto
     */
    private UserDto mapUserToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .isActive(user.isActive())
                .isEmailVerified(user.isEmailVerified())
                .isPhoneVerified(user.isPhoneVerified())
                .userType(user.getUserType())
                .primaryTenantId(user.getPrimaryTenant().getId())
                .createdAt(user.getCreatedAt())
                .createdBy(user.getCreatedBy())
                .updatedAt(user.getUpdatedAt())
                .updatedBy(user.getUpdatedBy())
                .build();
    }
}