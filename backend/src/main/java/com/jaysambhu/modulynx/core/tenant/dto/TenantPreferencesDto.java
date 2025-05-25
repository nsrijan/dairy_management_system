package com.jaysambhu.modulynx.core.tenant.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantPreferencesDto {
    private Long id;
    private Long tenantId;

    // UI Preferences
    @NotBlank(message = "Default theme is required")
    private String defaultTheme;

    private Boolean sidebarCollapsed;
    private Boolean enableAnimations;
    private Boolean enableNotifications;

    // Notification Preferences
    private Boolean emailNotifications;
    private Boolean smsNotifications;
    private Boolean pushNotifications;

    // System Defaults
    @Min(value = 5, message = "Page size must be at least 5")
    @Max(value = 100, message = "Page size must not exceed 100")
    private Integer defaultPageSize;

    private String defaultViewMode;

    @Min(value = 0, message = "Auto refresh interval must be non-negative")
    @Max(value = 3600, message = "Auto refresh interval must not exceed 3600 seconds")
    private Integer autoRefreshInterval;

    // Email Settings
    private String emailFooterText;
    private String emailSignature;

    // Audit fields
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}