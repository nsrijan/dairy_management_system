package com.jaysambhu.modulynx.core.tenant.service;

import com.jaysambhu.modulynx.core.tenant.dto.TenantDto;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;

import java.util.List;
import java.util.Optional;

public interface TenantService {

    /**
     * Find a tenant by its slug
     *
     * @param slug The slug to search for
     * @return The tenant if found
     */
    Tenant findBySlug(String slug);

    /**
     * Find an active tenant by slug
     *
     * @param slug The slug to search for
     * @return The tenant if found
     */
    Tenant findActiveBySlug(String slug);

    /**
     * Find a tenant by its ID
     *
     * @param id The ID to search for
     * @return The tenant if found
     */
    Tenant findById(Long id);

    /**
     * Get all tenants
     *
     * @return List of all tenants
     */
    List<TenantDto> findAll();

    /**
     * Create a new tenant
     *
     * @param tenantDto The tenant data to create
     * @return The created tenant
     */
    TenantDto create(TenantDto tenantDto);

    /**
     * Update an existing tenant
     *
     * @param id        The ID of the tenant to update
     * @param tenantDto The updated tenant data
     * @return The updated tenant
     */
    TenantDto update(Long id, TenantDto tenantDto);

    /**
     * Delete a tenant
     *
     * @param id The ID of the tenant to delete
     */
    void delete(Long id);

    /**
     * Get the current tenant based on TenantContext
     * 
     * @return The current tenant DTO
     */
    TenantDto getCurrentTenant();

    /**
     * Map a Tenant entity to a TenantDto
     * 
     * @param tenant The tenant entity to map
     * @return The mapped tenant DTO
     */
    TenantDto mapToDto(Tenant tenant);
}