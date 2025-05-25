package com.jaysambhu.modulynx.core.tenant.service;

import com.jaysambhu.modulynx.core.tenant.dto.TenantSettingsDto;
import com.jaysambhu.modulynx.core.tenant.dto.TenantPreferencesDto;

/**
 * Service interface for managing tenant settings and preferences.
 * This service provides operations for both tenant-specific and current tenant
 * settings.
 */
public interface TenantSettingsService {

    /**
     * Get settings for a specific tenant
     *
     * @param tenantId The tenant ID
     * @return The tenant settings
     */
    TenantSettingsDto getSettings(Long tenantId);

    /**
     * Get settings for the current tenant context
     *
     * @return The tenant settings for the current tenant
     */
    TenantSettingsDto getCurrentTenantSettings();

    /**
     * Update settings for a specific tenant
     *
     * @param tenantId The tenant ID
     * @param settings The settings to update
     * @return The updated settings
     */
    TenantSettingsDto updateSettings(Long tenantId, TenantSettingsDto settings);

    /**
     * Get preferences for a specific tenant
     *
     * @param tenantId The tenant ID
     * @return The tenant preferences
     */
    TenantPreferencesDto getPreferences(Long tenantId);

    /**
     * Get preferences for the current tenant context
     *
     * @return The tenant preferences for the current tenant
     */
    TenantPreferencesDto getCurrentTenantPreferences();

    /**
     * Update preferences for a specific tenant
     *
     * @param tenantId    The tenant ID
     * @param preferences The preferences to update
     * @return The updated preferences
     */
    TenantPreferencesDto updatePreferences(Long tenantId, TenantPreferencesDto preferences);
}