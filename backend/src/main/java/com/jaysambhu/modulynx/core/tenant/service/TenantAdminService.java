package com.jaysambhu.modulynx.core.tenant.service;

import com.jaysambhu.modulynx.core.company.dto.CompanyDto;
import com.jaysambhu.modulynx.core.tenant.dto.CreateTenantAdminRequest;
import com.jaysambhu.modulynx.core.tenant.dto.TenantAdminResponse;
import com.jaysambhu.modulynx.core.tenant.dto.TenantDto;
import jakarta.transaction.Transactional;

import java.util.List;

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