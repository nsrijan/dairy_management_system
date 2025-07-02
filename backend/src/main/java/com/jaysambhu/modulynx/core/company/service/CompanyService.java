package com.jaysambhu.modulynx.core.company.service;

import com.jaysambhu.modulynx.core.company.dto.CompanyDto;
import com.jaysambhu.modulynx.core.company.dto.CompanyWithAdminCountDto;
import com.jaysambhu.modulynx.core.user.dto.UserDto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CompanyService {

    /**
     * Create a new company for the current tenant
     * 
     * @param companyDto The company data
     * @return The created company
     */
    CompanyDto createCompany(CompanyDto companyDto);

    /**
     * Update an existing company
     * 
     * @param id         The company ID
     * @param companyDto The updated company data
     * @return The updated company
     */
    CompanyDto updateCompany(Long id, CompanyDto companyDto);

    /**
     * Get all companies for the current tenant
     * 
     * @return List of companies
     */
    List<CompanyDto> getCompaniesByTenant();

    /**
     * Get all companies for the current tenant with pagination
     * 
     * @param pageable Pagination information
     * @return Page of companies
     */
    Page<CompanyDto> getCompaniesByTenant(Pageable pageable);

    /**
     * Get a company by ID for the current tenant
     * 
     * @param id The company ID
     * @return The company data
     */
    CompanyDto getCompanyById(Long id);

    /**
     * Delete a company
     * 
     * @param id The company ID
     */
    void deleteCompany(Long id);

    /**
     * Search companies by name for the current tenant
     * 
     * @param name The name to search for
     * @return List of matching companies
     */
    List<CompanyDto> searchCompaniesByName(String name);

    /**
     * Get all companies for a specific tenant (System Admin only)
     *
     * @param tenantId The ID of the tenant
     * @return List of companies for the specified tenant
     */
    List<CompanyDto> getCompaniesByTenantId(Long tenantId);

    /**
     * Get all users belonging to a specific company.
     *
     * @param companyId The ID of the company
     * @return List of users belonging to the company
     */
    List<UserDto> getAllUsersByCompanyId(Long companyId);

    /**
     * Get all companies with admin count for the current tenant with id
     * 
     * @return List of companies with admin count
     */
    List<CompanyWithAdminCountDto> getAllCompaniesWithAdminCountWithTenantId(Long tenantId);
}