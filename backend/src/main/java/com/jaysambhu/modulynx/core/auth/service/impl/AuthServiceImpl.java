package com.jaysambhu.modulynx.core.auth.service.impl;

import com.jaysambhu.modulynx.common.exception.BadRequestException;
import com.jaysambhu.modulynx.context.TenantContext;
import com.jaysambhu.modulynx.core.auth.service.AuthService;
import com.jaysambhu.modulynx.core.auth.service.JwtService;
import com.jaysambhu.modulynx.core.auth.service.TokenBlacklistService;
import com.jaysambhu.modulynx.core.user.dto.AuthResponse;
import com.jaysambhu.modulynx.core.user.dto.LoginRequest;
import com.jaysambhu.modulynx.core.user.dto.RegistrationRequest;
import com.jaysambhu.modulynx.core.user.dto.UserDto;
import com.jaysambhu.modulynx.core.user.model.RoleName;
import com.jaysambhu.modulynx.core.user.model.User;
import com.jaysambhu.modulynx.core.user.model.UserCompanyRole;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.tenant.service.TenantService;
import com.jaysambhu.modulynx.core.user.repository.RoleRepository;
import com.jaysambhu.modulynx.core.user.repository.UserRepository;
import com.jaysambhu.modulynx.core.user.repository.UserCompanyRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of the AuthService interface
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;
    private final TenantService tenantService;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;

    @Override
    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        log.debug("Attempting to authenticate user: {}", loginRequest.getUsernameOrEmail());

        Long currentTenantId = TenantContext.getCurrentTenant();
        boolean isSuperAdminContext = TenantContext.isSuperAdmin();

        log.debug("Login context: tenantId={}, isSuperAdmin={}", currentTenantId, isSuperAdminContext);

        User user;

        if (isSuperAdminContext) {
            // Admin domain access - only allow system admin users
            log.debug("Processing admin domain login for user: {}", loginRequest.getUsernameOrEmail());

            user = userRepository.findSystemAdminByUsernameOrEmail(loginRequest.getUsernameOrEmail())
                    .orElseThrow(() -> new BadRequestException(
                            "Admin credentials not found or user is not a system administrator"));

            // Validate password manually
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                log.warn("Invalid password for admin user: {}", loginRequest.getUsernameOrEmail());
                throw new BadRequestException("Invalid credentials");
            }

            // Verify user is active
            if (!user.isActive()) {
                log.warn("Inactive admin user attempted login: {}", loginRequest.getUsernameOrEmail());
                throw new BadRequestException("Account is inactive");
            }

            log.info("System admin login successful: {}", user.getUsername());

        } else {
            // Tenant domain access - only allow tenant-specific users
            if (currentTenantId == null) {
                log.error("No tenant context found for tenant domain access");
                throw new BadRequestException("Tenant context not found");
            }

            log.debug("Processing tenant domain login for user: {} in tenant: {}",
                    loginRequest.getUsernameOrEmail(), currentTenantId);

            user = userRepository.findFirstByUsernameOrEmailAndPrimaryTenantId(
                    loginRequest.getUsernameOrEmail(), currentTenantId)
                    .orElseThrow(() -> new BadRequestException("User not found in this tenant"));

            // Validate password manually
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                log.warn("Invalid password for tenant user: {}", loginRequest.getUsernameOrEmail());
                throw new BadRequestException("Invalid credentials");
            }

            // Verify user is active
            if (!user.isActive()) {
                log.warn("Inactive tenant user attempted login: {}", loginRequest.getUsernameOrEmail());
                throw new BadRequestException("Account is inactive");
            }

            // Verify user belongs to the correct tenant
            if (!user.getPrimaryTenant().getId().equals(currentTenantId)) {
                log.warn("User {} attempted to login from wrong tenant domain. User tenant: {}, Request tenant: {}",
                        user.getUsername(), user.getPrimaryTenant().getId(), currentTenantId);
                throw new BadRequestException("Access denied: User not authorized for this tenant");
            }

            // Ensure system admin cannot login from tenant subdomains
            boolean isSystemAdmin = user.getUserCompanyRoles().stream()
                    .anyMatch(ucr -> ucr.getRole().getName().name().equals("SYSTEM_ADMIN"));

            if (isSystemAdmin) {
                log.warn("System admin {} attempted to login from tenant subdomain", user.getUsername());
                throw new BadRequestException("System administrators cannot login from tenant subdomains");
            }

            log.info("Tenant user login successful: {} for tenant: {}", user.getUsername(), currentTenantId);
        }

        // Create UserDetails for token generation
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());

        // Get roles and permissions
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .collect(Collectors.toList());

        List<String> permissions = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("PERMISSION_"))
                .collect(Collectors.toList());

        // Get available companies for the user
        Set<Long> companyIds = userCompanyRoleRepository.findAllCompanyIdsByUserId(user.getId());

        // Generate token with comprehensive user information including company access
        // For super admin context, use SUPER_ADMIN_CONTEXT value in token
        Long tokenTenantId = isSuperAdminContext ? TenantContext.SUPER_ADMIN_CONTEXT : currentTenantId;
        String token = jwtService.generateToken(userDetails, user.getId(), tokenTenantId, companyIds);

        // Create the auth response
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.extractClaim(token, claims -> claims.getExpiration().getTime()))
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .primaryTenantId(user.getPrimaryTenant().getId())
                .primaryTenantName(user.getPrimaryTenant().getName())
                .roles(roles)
                .permissions(permissions)
                .companyIds(companyIds)
                .build();
    }

    @Override
    @Transactional
    public UserDto register(RegistrationRequest registrationRequest) {
        log.debug("Registering new user: {}", registrationRequest.getUsername());

        // Check if username already exists
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        // Get the tenant (uses tenant context or explicit tenant ID)
        Tenant tenant;
        if (registrationRequest.getTenantId() != null) {
            tenant = tenantService.findById(registrationRequest.getTenantId());
        } else {
            Long currentTenantId = TenantContext.getCurrentTenant();
            tenant = tenantService.findById(currentTenantId);
        }

        // Create the user
        User user = User.builder()
                .username(registrationRequest.getUsername())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .firstName(registrationRequest.getFirstName())
                .lastName(registrationRequest.getLastName())
                .phone(registrationRequest.getPhone())
                .isActive(true)
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .userType(registrationRequest.getUserType())
                .primaryTenant(tenant)
                .build();

        // Save the user
        User savedUser = userRepository.save(user);

        log.info("User registered successfully: {}", savedUser.getUsername());

        // Convert to DTO and return
        return mapToDto(savedUser);
    }

    @Override
    public void logout(String token) {
        tokenBlacklistService.blacklist(token);
        log.debug("Token blacklisted successfully");
    }

    @Override
    public boolean validateToken(String token) {
        // Check if token is blacklisted
        if (tokenBlacklistService.isBlacklisted(token)) {
            return false;
        }

        try {
            // Extract username and check if it's valid
            String username = jwtService.extractUsername(token);

            // Use UserDetailsService to load the user, which will convert to Spring
            // Security UserDetails
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            return userDetails != null && jwtService.isTokenValid(token, userDetails);
        } catch (Exception e) {
            log.error("Error validating token", e);
            return false;
        }
    }

    /**
     * Convert a User entity to UserDto
     *
     * @param user The user entity
     * @return The user DTO
     */
    private UserDto mapToDto(User user) {
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
                .primaryTenantName(user.getPrimaryTenant().getName())
                .createdAt(user.getCreatedAt())
                .createdBy(user.getCreatedBy())
                .updatedAt(user.getUpdatedAt())
                .updatedBy(user.getUpdatedBy())
                .build();
    }
}