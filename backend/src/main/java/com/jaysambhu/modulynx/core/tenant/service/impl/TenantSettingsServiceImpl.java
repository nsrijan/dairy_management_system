package com.jaysambhu.modulynx.core.tenant.service.impl;

import com.jaysambhu.modulynx.common.exception.ResourceNotFoundException;
import com.jaysambhu.modulynx.common.service.AbstractTenantAwareService;
import com.jaysambhu.modulynx.context.TenantContext;
import com.jaysambhu.modulynx.core.tenant.dto.TenantSettingsDto;
import com.jaysambhu.modulynx.core.tenant.dto.TenantPreferencesDto;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.tenant.model.TenantSettings;
import com.jaysambhu.modulynx.core.tenant.model.TenantPreferences;
import com.jaysambhu.modulynx.core.tenant.repository.TenantSettingsRepository;
import com.jaysambhu.modulynx.core.tenant.repository.TenantPreferencesRepository;
import com.jaysambhu.modulynx.core.tenant.service.TenantService;
import com.jaysambhu.modulynx.core.tenant.service.TenantSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantSettingsServiceImpl extends AbstractTenantAwareService implements TenantSettingsService {

    private final TenantService tenantService;
    private final TenantSettingsRepository settingsRepository;
    private final TenantPreferencesRepository preferencesRepository;

    @Override
    @Transactional(readOnly = true)
    public TenantSettingsDto getSettings(Long tenantId) {
        TenantSettings settings = settingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> createDefaultSettings(tenantId));
        return mapToSettingsDto(settings);
    }

    @Override
    @Transactional(readOnly = true)
    public TenantSettingsDto getCurrentTenantSettings() {
        Long currentTenantId = TenantContext.getCurrentTenant();
        return getSettings(currentTenantId);
    }

    @Override
    @Transactional
    public TenantSettingsDto updateSettings(Long tenantId, TenantSettingsDto settingsDto) {
        TenantSettings settings = settingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> createDefaultSettings(tenantId));

        updateSettingsFromDto(settings, settingsDto);
        TenantSettings savedSettings = settingsRepository.save(settings);
        return mapToSettingsDto(savedSettings);
    }

    @Override
    @Transactional(readOnly = true)
    public TenantPreferencesDto getPreferences(Long tenantId) {
        TenantPreferences preferences = preferencesRepository.findByTenantId(tenantId)
                .orElseGet(() -> createDefaultPreferences(tenantId));
        return mapToPreferencesDto(preferences);
    }

    @Override
    @Transactional(readOnly = true)
    public TenantPreferencesDto getCurrentTenantPreferences() {
        Long currentTenantId = TenantContext.getCurrentTenant();
        return getPreferences(currentTenantId);
    }

    @Override
    @Transactional
    public TenantPreferencesDto updatePreferences(Long tenantId, TenantPreferencesDto preferencesDto) {
        TenantPreferences preferences = preferencesRepository.findByTenantId(tenantId)
                .orElseGet(() -> createDefaultPreferences(tenantId));

        updatePreferencesFromDto(preferences, preferencesDto);
        TenantPreferences savedPreferences = preferencesRepository.save(preferences);
        return mapToPreferencesDto(savedPreferences);
    }

    private TenantSettings createDefaultSettings(Long tenantId) {
        Tenant tenant = tenantService.findById(tenantId);
        return settingsRepository.save(TenantSettings.builder()
                .tenant(tenant)
                .defaultLanguage("en")
                .dateFormat("MM/dd/yyyy")
                .timeFormat("HH:mm:ss")
                .numberFormat("#,##0.00")
                .currency("USD")
                .timezone("UTC")
                .build());
    }

    private TenantPreferences createDefaultPreferences(Long tenantId) {
        Tenant tenant = tenantService.findById(tenantId);
        return preferencesRepository.save(TenantPreferences.builder()
                .tenant(tenant)
                .defaultTheme("light")
                .sidebarCollapsed(false)
                .enableAnimations(true)
                .enableNotifications(true)
                .emailNotifications(true)
                .smsNotifications(false)
                .pushNotifications(true)
                .defaultPageSize(10)
                .defaultViewMode("grid")
                .autoRefreshInterval(0)
                .build());
    }

    private void updateSettingsFromDto(TenantSettings settings, TenantSettingsDto dto) {
        settings.setContactEmail(dto.getContactEmail());
        settings.setContactPhone(dto.getContactPhone());
        settings.setContactAddress(dto.getContactAddress());
        settings.setBusinessHours(dto.getBusinessHours());
        settings.setFiscalYearStart(dto.getFiscalYearStart());
        settings.setFiscalYearEnd(dto.getFiscalYearEnd());
        settings.setLogoUrl(dto.getLogoUrl());
        settings.setFaviconUrl(dto.getFaviconUrl());
        settings.setPrimaryColor(dto.getPrimaryColor());
        settings.setSecondaryColor(dto.getSecondaryColor());
        settings.setCompanyWebsite(dto.getCompanyWebsite());
        settings.setDefaultLanguage(dto.getDefaultLanguage());
        settings.setDateFormat(dto.getDateFormat());
        settings.setTimeFormat(dto.getTimeFormat());
        settings.setNumberFormat(dto.getNumberFormat());
        settings.setCurrency(dto.getCurrency());
        settings.setTimezone(dto.getTimezone());
    }

    private void updatePreferencesFromDto(TenantPreferences preferences, TenantPreferencesDto dto) {
        preferences.setDefaultTheme(dto.getDefaultTheme());
        preferences.setSidebarCollapsed(dto.getSidebarCollapsed());
        preferences.setEnableAnimations(dto.getEnableAnimations());
        preferences.setEnableNotifications(dto.getEnableNotifications());
        preferences.setEmailNotifications(dto.getEmailNotifications());
        preferences.setSmsNotifications(dto.getSmsNotifications());
        preferences.setPushNotifications(dto.getPushNotifications());
        preferences.setDefaultPageSize(dto.getDefaultPageSize());
        preferences.setDefaultViewMode(dto.getDefaultViewMode());
        preferences.setAutoRefreshInterval(dto.getAutoRefreshInterval());
        preferences.setEmailFooterText(dto.getEmailFooterText());
        preferences.setEmailSignature(dto.getEmailSignature());
    }

    private TenantSettingsDto mapToSettingsDto(TenantSettings settings) {
        return TenantSettingsDto.builder()
                .id(settings.getId())
                .tenantId(settings.getTenant().getId())
                .contactEmail(settings.getContactEmail())
                .contactPhone(settings.getContactPhone())
                .contactAddress(settings.getContactAddress())
                .businessHours(settings.getBusinessHours())
                .fiscalYearStart(settings.getFiscalYearStart())
                .fiscalYearEnd(settings.getFiscalYearEnd())
                .logoUrl(settings.getLogoUrl())
                .faviconUrl(settings.getFaviconUrl())
                .primaryColor(settings.getPrimaryColor())
                .secondaryColor(settings.getSecondaryColor())
                .companyWebsite(settings.getCompanyWebsite())
                .defaultLanguage(settings.getDefaultLanguage())
                .dateFormat(settings.getDateFormat())
                .timeFormat(settings.getTimeFormat())
                .numberFormat(settings.getNumberFormat())
                .currency(settings.getCurrency())
                .timezone(settings.getTimezone())
                .createdAt(settings.getCreatedAt())
                .createdBy(settings.getCreatedBy())
                .updatedAt(settings.getUpdatedAt())
                .updatedBy(settings.getUpdatedBy())
                .build();
    }

    private TenantPreferencesDto mapToPreferencesDto(TenantPreferences preferences) {
        return TenantPreferencesDto.builder()
                .id(preferences.getId())
                .tenantId(preferences.getTenant().getId())
                .defaultTheme(preferences.getDefaultTheme())
                .sidebarCollapsed(preferences.getSidebarCollapsed())
                .enableAnimations(preferences.getEnableAnimations())
                .enableNotifications(preferences.getEnableNotifications())
                .emailNotifications(preferences.getEmailNotifications())
                .smsNotifications(preferences.getSmsNotifications())
                .pushNotifications(preferences.getPushNotifications())
                .defaultPageSize(preferences.getDefaultPageSize())
                .defaultViewMode(preferences.getDefaultViewMode())
                .autoRefreshInterval(preferences.getAutoRefreshInterval())
                .emailFooterText(preferences.getEmailFooterText())
                .emailSignature(preferences.getEmailSignature())
                .createdAt(preferences.getCreatedAt())
                .createdBy(preferences.getCreatedBy())
                .updatedAt(preferences.getUpdatedAt())
                .updatedBy(preferences.getUpdatedBy())
                .build();
    }
}