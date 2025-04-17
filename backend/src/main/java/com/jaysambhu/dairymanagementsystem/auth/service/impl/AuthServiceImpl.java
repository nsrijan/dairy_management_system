package com.jaysambhu.dairymanagementsystem.auth.service.impl;

import com.jaysambhu.dairymanagementsystem.auth.dto.AuthResponse;
import com.jaysambhu.dairymanagementsystem.auth.dto.LoginRequest;
import com.jaysambhu.dairymanagementsystem.auth.dto.RegisterRequest;
import com.jaysambhu.dairymanagementsystem.auth.model.Role;
import com.jaysambhu.dairymanagementsystem.auth.model.User;
import com.jaysambhu.dairymanagementsystem.auth.repository.UserRepository;
import com.jaysambhu.dairymanagementsystem.auth.service.AuthService;
import com.jaysambhu.dairymanagementsystem.auth.service.RoleService;
import com.jaysambhu.dairymanagementsystem.commons.RoleType;
import com.jaysambhu.dairymanagementsystem.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .roles(new HashSet<>(Collections.singletonList(roleService.findByName(RoleType.CUSTOMER))))
                .build();
        
        userRepository.save(user);
        
        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtService.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String usernameOrEmail = request.getUsernameOrEmail();
        
        // Authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        usernameOrEmail,
                        request.getPassword()
                )
        );
        
        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(usernameOrEmail);
        String token = jwtService.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(token)
                .username(usernameOrEmail)
                .build();
    }
} 