package com.jaysambhu.modulynx.core.tenant.service.impl;

import com.jaysambhu.modulynx.common.exception.BadRequestException;
import com.jaysambhu.modulynx.common.exception.ResourceNotFoundException;
import com.jaysambhu.modulynx.core.tenant.dto.CreateTenantAdminRequest;
import com.jaysambhu.modulynx.core.tenant.dto.TenantAdminResponse;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.tenant.service.TenantAdminService;
import com.jaysambhu.modulynx.core.tenant.service.TenantService;
import com.jaysambhu.modulynx.core.user.model.Role;
import com.jaysambhu.modulynx.core.user.model.RoleName;
import com.jaysambhu.modulynx.core.user.model.User;
import com.jaysambhu.modulynx.core.user.model.UserType;
import com.jaysambhu.modulynx.core.user.model.UserCompanyRole;
import com.jaysambhu.modulynx.core.user.repository.RoleRepository;
import com.jaysambhu.modulynx.core.user.repository.UserRepository;
import com.jaysambhu.modulynx.core.user.repository.UserCompanyRoleRepository;
import com.jaysambhu.modulynx.core.company.model.Company;
import com.jaysambhu.modulynx.core.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of TenantAdminService for managing tenant administrators
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TenantAdminServiceImpl implements TenantAdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TenantService tenantService;
    private final PasswordEncoder passwordEncoder;
    private final CompanyRepository companyRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;

    @Override
    @Transactional
    public TenantAdminResponse createAdmin(Long tenantId, CreateTenantAdminRequest request) {
        // Validate tenant exists
        Tenant tenant = tenantService.findById(tenantId);

        // Check username and email uniqueness
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        // Get tenant admin role
        Role adminRole = roleRepository.findByName(RoleName.TENANT_ADMIN)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", RoleName.TENANT_ADMIN));

        // Create user entity
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .isActive(true)
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .userType(UserType.INTERNAL)
                .primaryTenant(tenant)
                .build();

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setVersion(0L);

        User savedUser = userRepository.save(user);

        // Get or create the default company for the tenant
        Company company = companyRepository.findFirstByTenantId(tenantId)
                .orElseGet(() -> {
                    Company newCompany = Company.builder()
                            .name(tenant.getName() + " Company")
                            .isActive(true)
                            .tenant(tenant)
                            .build();
                    newCompany.setCreatedAt(LocalDateTime.now());
                    newCompany.setUpdatedAt(LocalDateTime.now());
                    newCompany.setVersion(0L);
                    return companyRepository.save(newCompany);
                });

        // Create UserCompanyRole association
        UserCompanyRole userCompanyRole = UserCompanyRole.builder()
                .user(savedUser)
                .company(company)
                .role(adminRole)
                .isActive(true)
                .build();

        userCompanyRole.setCreatedAt(LocalDateTime.now());
        userCompanyRole.setUpdatedAt(LocalDateTime.now());
        userCompanyRole.setVersion(0L);

        userCompanyRoleRepository.save(userCompanyRole);

        log.info("Created new admin user: {} for tenant: {}", savedUser.getUsername(), tenant.getName());

        return mapToAdminResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantAdminResponse> getAdmins(Long tenantId) {
        // Validate tenant exists
        tenantService.findById(tenantId);

        // Get tenant admin role
        Role adminRole = roleRepository.findByName(RoleName.TENANT_ADMIN)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", RoleName.TENANT_ADMIN));

        // Find all users with tenant admin role in this tenant
        List<User> adminUsers = userRepository.findByPrimaryTenantId(tenantId).stream()
                .filter(user -> user.getUserCompanyRoles().stream()
                        .anyMatch(ucr -> ucr.getRole().equals(adminRole)))
                .collect(Collectors.toList());

        return adminUsers.stream()
                .map(this::mapToAdminResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TenantAdminResponse updateAdminStatus(Long tenantId, Long adminId, boolean isActive) {
        // Validate tenant exists
        tenantService.findById(tenantId);

        // Find user and verify they belong to this tenant
        User user = userRepository.findById(adminId)
                .filter(u -> u.getPrimaryTenant().getId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("Admin", "id", adminId));

        // Verify user is actually an admin
        Role adminRole = roleRepository.findByName(RoleName.TENANT_ADMIN)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", RoleName.TENANT_ADMIN));

        boolean isAdmin = user.getUserCompanyRoles().stream()
                .anyMatch(ucr -> ucr.getRole().equals(adminRole));

        if (!isAdmin) {
            throw new BadRequestException("User is not a tenant admin");
        }

        // Update status
        user.setActive(isActive);
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        log.info("Updated status to {} for admin: {} in tenant: {}",
                isActive, user.getUsername(), user.getPrimaryTenant().getName());

        return mapToAdminResponse(updatedUser);
    }

    private TenantAdminResponse mapToAdminResponse(User user) {
        return TenantAdminResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .updatedAt(user.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .build();
    }
}