package com.jaysambhu.dairymanagementsystem.auth.service.impl;

import com.jaysambhu.dairymanagementsystem.auth.model.User;
import com.jaysambhu.dairymanagementsystem.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service("customUserDetailsServiceImpl")
@RequiredArgsConstructor
public class CustomUserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Try to find by username first
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        
        // If not found, try by email
        if (!userOpt.isPresent()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }
        
        User user = userOpt.orElseThrow(() -> 
            new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail));

        var authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isEnabled(),
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                authorities
        );
    }
}