package com.jaysambhu.dairymanagementsystem.modules.auth.service.impl;

import com.jaysambhu.dairymanagementsystem.modules.user.model.User;
import com.jaysambhu.dairymanagementsystem.modules.user.model.Role;
import com.jaysambhu.dairymanagementsystem.modules.user.model.UserCompanyRole;
import com.jaysambhu.dairymanagementsystem.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service to load user-specific data for Spring Security
 */
@Service("customUserDetailsServiceImpl")
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        log.debug("Loading user by username or email: {}", usernameOrEmail);

        // Try to find by username first
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);

        // If not found, try by email
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }

        User user = userOpt.orElseThrow(
                () -> new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail));

        // Build authorities from user's roles across all companies
        Collection<? extends GrantedAuthority> authorities = getAuthorities(user);

        log.debug("User found: {}, with authorities: {}", user.getUsername(), authorities);

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isActive(),
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                authorities);
    }

    /**
     * Get all authorities (roles) for a user
     *
     * @param user The user
     * @return Collection of authorities
     */
    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Add roles from all company assignments
        for (UserCompanyRole userCompanyRole : user.getUserCompanyRoles()) {
            if (userCompanyRole.isActive()) {
                Role role = userCompanyRole.getRole();

                // Add the role itself
                String roleName = "ROLE_" + role.getName().name();
                authorities.add(new SimpleGrantedAuthority(roleName));

                // Add all permissions from the role
                role.getPermissions().forEach(permission -> authorities
                        .add(new SimpleGrantedAuthority("PERMISSION_" + permission.getName())));
            }
        }

        return authorities;
    }
}