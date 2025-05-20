package com.jaysambhu.dairymanagementsystem.config;

import com.jaysambhu.dairymanagementsystem.modules.company.model.Company;
import com.jaysambhu.dairymanagementsystem.modules.company.repository.CompanyRepository;
import com.jaysambhu.dairymanagementsystem.modules.tenant.model.Tenant;
import com.jaysambhu.dairymanagementsystem.modules.tenant.repository.TenantRepository;
import com.jaysambhu.dairymanagementsystem.modules.user.model.Role;
import com.jaysambhu.dairymanagementsystem.modules.user.model.RoleName;
import com.jaysambhu.dairymanagementsystem.modules.user.model.User;
import com.jaysambhu.dairymanagementsystem.modules.user.model.UserCompanyRole;
import com.jaysambhu.dairymanagementsystem.modules.user.model.UserType;
import com.jaysambhu.dairymanagementsystem.modules.user.repository.RoleRepository;
import com.jaysambhu.dairymanagementsystem.modules.user.repository.UserCompanyRoleRepository;
import com.jaysambhu.dairymanagementsystem.modules.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Component responsible for seeding initial data that requires complex logic
 * beyond what can be accomplished with SQL migration scripts.
 * This includes creating users with encrypted passwords and proper
 * relationships.
 */
@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test") // Don't run during tests
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TenantRepository tenantRepository;
    private final CompanyRepository companyRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting data seeding...");

        // Only seed if no users exist (idempotent operation)
        if (userRepository.count() == 0) {
            seedSystemAdmin();
        }

        log.info("Data seeding completed");
    }

    /**
     * Seeds the system administrator user with proper role assignment.
     */
    private void seedSystemAdmin() {
        log.info("Seeding system administrator user...");

        // Get the system tenant
        Tenant systemTenant = tenantRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("System tenant not found"));

        // Get the system admin role
        Role systemAdminRole = roleRepository.findByName(RoleName.SYSTEM_ADMIN)
                .orElseThrow(() -> new RuntimeException("System admin role not found"));

        // Create default system company if it doesn't exist
        Company systemCompany = getOrCreateSystemCompany(systemTenant);

        // Create the system admin user
        User adminUser = User.builder()
                .username("admin")
                .email("admin@dms.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("System")
                .lastName("Administrator")
                .isActive(true)
                .isEmailVerified(true)
                .isPhoneVerified(true)
                .userType(UserType.INTERNAL)
                .primaryTenant(systemTenant)
                .build();

        adminUser.setCreatedAt(LocalDateTime.now());
        adminUser.setUpdatedAt(LocalDateTime.now());
        adminUser.setVersion(0L);

        // Save and flush to ensure the entity is persisted with an ID
        adminUser = userRepository.saveAndFlush(adminUser);

        // Make sure user is detached and reattached to avoid any issues
        entityManager.detach(adminUser);
        adminUser = entityManager.find(User.class, adminUser.getId());

        // Assign the system admin role to the admin user for the system company
        UserCompanyRole userCompanyRole = UserCompanyRole.builder()
                .user(adminUser)
                .company(systemCompany)
                .role(systemAdminRole)
                .isActive(true)
                .build();

        userCompanyRole.setCreatedAt(LocalDateTime.now());
        userCompanyRole.setUpdatedAt(LocalDateTime.now());
        userCompanyRole.setVersion(0L);

        userCompanyRoleRepository.save(userCompanyRole);

        log.info("System administrator user created successfully with ID: {}", adminUser.getId());
    }

    /**
     * Gets or creates the system company.
     */
    private Company getOrCreateSystemCompany(Tenant systemTenant) {
        Optional<Company> existingCompany = companyRepository.findByName("System Company");

        if (existingCompany.isPresent()) {
            return existingCompany.get();
        }

        Company systemCompany = Company.builder()
                .name("System Company")
                .isActive(true)
                .tenant(systemTenant)
                .build();

        systemCompany.setCreatedAt(LocalDateTime.now());
        systemCompany.setUpdatedAt(LocalDateTime.now());
        systemCompany.setVersion(0L);

        // Save and flush to ensure the entity is persisted with an ID
        return companyRepository.saveAndFlush(systemCompany);
    }
}