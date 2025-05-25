package com.jaysambhu.modulynx.core.tenant.model;

import com.jaysambhu.modulynx.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "tenant_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Audited
public class TenantPreferences extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false, unique = true)
    private Tenant tenant;

    // UI Preferences
    @Column(name = "default_theme", nullable = false)
    private String defaultTheme;

    @Column(name = "sidebar_collapsed")
    private Boolean sidebarCollapsed;

    @Column(name = "enable_animations")
    private Boolean enableAnimations;

    @Column(name = "enable_notifications")
    private Boolean enableNotifications;

    // Notification Preferences
    @Column(name = "email_notifications")
    private Boolean emailNotifications;

    @Column(name = "sms_notifications")
    private Boolean smsNotifications;

    @Column(name = "push_notifications")
    private Boolean pushNotifications;

    // System Defaults
    @Column(name = "default_page_size")
    private Integer defaultPageSize;

    @Column(name = "default_view_mode")
    private String defaultViewMode;

    @Column(name = "auto_refresh_interval")
    private Integer autoRefreshInterval;

    // Email Settings
    @Column(name = "email_footer_text", columnDefinition = "TEXT")
    private String emailFooterText;

    @Column(name = "email_signature", columnDefinition = "TEXT")
    private String emailSignature;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof TenantPreferences))
            return false;
        TenantPreferences that = (TenantPreferences) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}