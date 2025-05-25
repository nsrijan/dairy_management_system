package com.jaysambhu.modulynx.core.tenant.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantSettingsDto {
    private Long id;
    private Long tenantId;

    // Contact Information
    @Email(message = "Invalid email format")
    private String contactEmail;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    private String contactPhone;

    private String contactAddress;

    // Business Settings
    private String businessHours;

    @Pattern(regexp = "^(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$", message = "Fiscal year start must be in MM-DD format")
    private String fiscalYearStart;

    @Pattern(regexp = "^(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$", message = "Fiscal year end must be in MM-DD format")
    private String fiscalYearEnd;

    // Branding
    private String logoUrl;
    private String faviconUrl;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Invalid color format")
    private String primaryColor;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Invalid color format")
    private String secondaryColor;

    @Pattern(regexp = "^(https?:\\/\\/)?[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-\\.,@?^=%&:/~\\+#]*$", message = "Invalid website URL")
    private String companyWebsite;

    // System Settings
    @NotBlank(message = "Default language is required")
    private String defaultLanguage;

    @NotBlank(message = "Date format is required")
    private String dateFormat;

    @NotBlank(message = "Time format is required")
    private String timeFormat;

    @NotBlank(message = "Number format is required")
    private String numberFormat;

    // Localization Settings
    @NotBlank(message = "Currency is required")
    private String currency;

    @NotBlank(message = "Timezone is required")
    private String timezone;

    // Audit fields
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}