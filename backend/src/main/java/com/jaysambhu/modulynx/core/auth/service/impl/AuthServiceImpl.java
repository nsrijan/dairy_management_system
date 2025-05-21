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

        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user details from the authenticated user
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Get roles and permissions
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .collect(Collectors.toList());

        List<String> permissions = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("PERMISSION_"))
                .collect(Collectors.toList());

        // Generate token with comprehensive user information
        String token = jwtService.generateToken(userDetails, user.getId(), user.getPrimaryTenant().getId());

        // Get available companies for the user
        Set<Long> companyIds = userCompanyRoleRepository.findAllCompanyIdsByUserId(user.getId());

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