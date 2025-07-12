-- Create tenant_settings table
CREATE TABLE tenant_settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL UNIQUE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address TEXT,
    business_hours TEXT,
    fiscal_year_start VARCHAR(5),
    fiscal_year_end VARCHAR(5),
    logo_url VARCHAR(255),
    favicon_url VARCHAR(255),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    company_website VARCHAR(255),
    default_language VARCHAR(10) NOT NULL,
    date_format VARCHAR(50) NOT NULL,
    time_format VARCHAR(50) NOT NULL,
    number_format VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    CONSTRAINT fk_tenant_settings_tenant FOREIGN KEY (tenant_id) REFERENCES tenant (id)
);

-- Create tenant_settings_aud table for auditing
CREATE TABLE tenant_settings_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    tenant_id BIGINT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address TEXT,
    business_hours TEXT,
    fiscal_year_start VARCHAR(5),
    fiscal_year_end VARCHAR(5),
    logo_url VARCHAR(255),
    favicon_url VARCHAR(255),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    company_website VARCHAR(255),
    default_language VARCHAR(10),
    date_format VARCHAR(50),
    time_format VARCHAR(50),
    number_format VARCHAR(50),
    currency VARCHAR(10),
    timezone VARCHAR(50),
    created_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_tenant_settings_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo (id)
);

-- Create tenant_preferences table
CREATE TABLE tenant_preferences (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL UNIQUE,
    default_theme VARCHAR(50) NOT NULL,
    sidebar_collapsed BOOLEAN,
    enable_animations BOOLEAN,
    enable_notifications BOOLEAN,
    email_notifications BOOLEAN,
    sms_notifications BOOLEAN,
    push_notifications BOOLEAN,
    default_page_size INTEGER,
    default_view_mode VARCHAR(50),
    auto_refresh_interval INTEGER,
    email_footer_text TEXT,
    email_signature TEXT,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    CONSTRAINT fk_tenant_preferences_tenant FOREIGN KEY (tenant_id) REFERENCES tenant (id)
);

-- Create tenant_preferences_aud table for auditing
CREATE TABLE tenant_preferences_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    tenant_id BIGINT,
    default_theme VARCHAR(50),
    sidebar_collapsed BOOLEAN,
    enable_animations BOOLEAN,
    enable_notifications BOOLEAN,
    email_notifications BOOLEAN,
    sms_notifications BOOLEAN,
    push_notifications BOOLEAN,
    default_page_size INTEGER,
    default_view_mode VARCHAR(50),
    auto_refresh_interval INTEGER,
    email_footer_text TEXT,
    email_signature TEXT,
    created_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_tenant_preferences_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo (id)
);

-- Move data from tenant to tenant_settings
INSERT INTO tenant_settings (
    tenant_id,
    default_language,
    date_format,
    time_format,
    number_format,
    currency,
    timezone,
    created_at
)
SELECT 
    id as tenant_id,
    'en' as default_language,
    'MM/dd/yyyy' as date_format,
    'HH:mm:ss' as time_format,
    '#,##0.00' as number_format,
    'USD' as currency,
    'UTC' as timezone,
    NOW() as created_at
FROM tenant;

-- Remove columns from tenant table
ALTER TABLE tenant DROP COLUMN IF EXISTS currency;