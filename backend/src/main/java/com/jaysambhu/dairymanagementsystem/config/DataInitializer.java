package com.jaysambhu.dairymanagementsystem.config;

import com.jaysambhu.dairymanagementsystem.auth.model.Role;
import com.jaysambhu.dairymanagementsystem.auth.model.User;
import com.jaysambhu.dairymanagementsystem.auth.repository.RoleRepository;
import com.jaysambhu.dairymanagementsystem.auth.repository.UserRepository;
import com.jaysambhu.dairymanagementsystem.commons.RoleType;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create roles if they don't exist
        if (roleRepository.count() == 0) {
            createRoles();
        }

        // Create a test user if no users exist
        if (userRepository.count() == 0) {
            createTestUser();
        }
    }

    private void createRoles() {
        for (RoleType roleType : RoleType.values()) {
            Role role = new Role();
            role.setName(roleType.name());
            roleRepository.save(role);
        }
        System.out.println("Roles created successfully");
    }

    private void createTestUser() {
        Role adminRole = roleRepository.findByName(RoleType.ADMIN.name()).orElseThrow();
        
        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);

        User admin = User.builder()
                .email("admin@example.com")
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .enabled(true)
                .roles(roles)
                .build();

        userRepository.save(admin);
        System.out.println("Test user created successfully: email=admin@example.com, password=admin123");
    }
} 