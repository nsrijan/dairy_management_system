package com.jaysambhu.modulynx.core.tenant.service;

import com.jaysambhu.modulynx.core.company.dto.CompanyDto;
import com.jaysambhu.modulynx.core.tenant.dto.CreateTenantAdminRequest;
import com.jaysambhu.modulynx.core.tenant.dto.TenantAdminResponse;
import com.jaysambhu.modulynx.core.tenant.dto.TenantDto;
import com.jaysambhu.modulynx.core.tenant.model.ModuleType;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.tenant.repository.TenantRepository;
import com.jaysambhu.modulynx.core.company.model.Company;
import com.jaysambhu.modulynx.core.company.repository.CompanyRepository;
import com.jaysambhu.modulynx.core.module.model.Module;
import com.jaysambhu.modulynx.core.module.repository.ModuleRepository;
import com.jaysambhu.modulynx.core.module.service.TenantModuleService;
import com.jaysambhu.modulynx.security.model.Role;
import com.jaysambhu.modulynx.security.model.User;
import com.jaysambhu.modulynx.security.repository.RoleRepository;
import com.jaysambhu.modulynx.security.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

/**
 * Service interface for managing tenant administrators
 */
public interface TenantAdminService {

    /**
     * Create a new tenant admin
     *
     * @param tenantId The ID of the tenant
     * @param request  The admin creation request
     * @return The created admin
     */
    TenantAdminResponse createAdmin(Long tenantId, CreateTenantAdminRequest request);

    /**
     * Get all admins for a tenant
     *
     * @param tenantId The ID of the tenant
     * @return List of tenant admins
     */
    List<TenantAdminResponse> getAdmins(Long tenantId);

    /**
     * Update a tenant admin's status
     *
     * @param tenantId The ID of the tenant
     * @param adminId  The ID of the admin
     * @param isActive The new active status
     * @return The updated admin
     */
    TenantAdminResponse updateAdminStatus(Long tenantId, Long adminId, boolean isActive);

    /**
     * Set up a new tenant with company and admin
     *
     * @param tenantDto    The tenant data
     * @param companyDto   The company data
     * @param adminRequest The admin creation request
     * @return The created admin response
     */
    @Transactional
    TenantAdminResponse setupTenant(TenantDto tenantDto, CompanyDto companyDto, CreateTenantAdminRequest adminRequest);
}