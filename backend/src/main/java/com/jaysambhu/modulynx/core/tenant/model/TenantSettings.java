package com.jaysambhu.modulynx.core.tenant.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "tenant_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Audited
public class TenantSettings extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false, unique = true)
    private Tenant tenant;

    // Contact Information
    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_address", columnDefinition = "TEXT")
    private String contactAddress;

    // Business Settings
    @Column(name = "business_hours", columnDefinition = "TEXT")
    private String businessHours;

    @Column(name = "fiscal_year_start")
    private String fiscalYearStart;

    @Column(name = "fiscal_year_end")
    private String fiscalYearEnd;

    // Branding
    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "favicon_url")
    private String faviconUrl;

    @Column(name = "primary_color")
    private String primaryColor;

    @Column(name = "secondary_color")
    private String secondaryColor;

    @Column(name = "company_website")
    private String companyWebsite;

    // System Settings
    @Column(name = "default_language", nullable = false)
    private String defaultLanguage;

    @Column(name = "date_format", nullable = false)
    private String dateFormat;

    @Column(name = "time_format", nullable = false)
    private String timeFormat;

    @Column(name = "number_format", nullable = false)
    private String numberFormat;

    // Localization Settings
    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "timezone", nullable = false)
    private String timezone;
    
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof TenantSettings))
            return false;
        TenantSettings that = (TenantSettings) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}