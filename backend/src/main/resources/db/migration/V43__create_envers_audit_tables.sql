-- V43__create_envers_audit_tables.sql
-- Creates the necessary tables for Hibernate Envers to track entity history.

-- 1. Create the standard Envers revision tracking table
CREATE TABLE IF NOT EXISTS revinfo (
    rev BIGSERIAL PRIMARY KEY,
    revtstmp BIGINT NOT NULL
);

-- 2. Audit table for ChillVat
CREATE TABLE IF NOT EXISTS chill_vat_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(50),
    capacity_in_liters INTEGER,
    current_stock_liters INTEGER,
    is_operational BOOLEAN,
    milk_collection_branch_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_chill_vat_aud_rev FOREIGN KEY (rev) REFERENCES revinfo(rev)
);

-- 3. Audit table for McbMilkRate
CREATE TABLE IF NOT EXISTS mcb_milk_rate_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    milk_type VARCHAR(20),
    rate_type VARCHAR(20),
    rate DECIMAL(10,2),
    effective_from DATE,
    effective_to DATE,
    milk_collection_branch_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_mcb_milk_rate_aud_rev FOREIGN KEY (rev) REFERENCES revinfo(rev)
);

-- 4. Audit table for MilkCollectionBranch
CREATE TABLE IF NOT EXISTS milk_collection_branch_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(100),
    code VARCHAR(50),
    location VARCHAR(200),
    phone_number VARCHAR(20),
    is_active BOOLEAN,
    company_id BIGINT,
    manager_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_mcb_aud_rev FOREIGN KEY (rev) REFERENCES revinfo(rev)
);

-- 5. Audit table for User
CREATE TABLE IF NOT EXISTS users_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(255),
    is_active BOOLEAN,
    is_email_verified BOOLEAN,
    is_phone_verified BOOLEAN,
    primary_tenant_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_users_aud_rev FOREIGN KEY (rev) REFERENCES revinfo(rev)
);

-- 6. Audit table for Role and its many-to-many relationship with Permission
CREATE TABLE IF NOT EXISTS role_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(255),
    description VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_role_aud_rev FOREIGN KEY (rev) REFERENCES revinfo(rev)
);

CREATE TABLE IF NOT EXISTS role_permissions_aud (
    rev BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    revtype SMALLINT,
    PRIMARY KEY (rev, role_id, permission_id),
    CONSTRAINT fk_role_permissions_aud_rev FOREIGN KEY (rev) REFERENCES revinfo(rev)
);

-- 7. Audit table for Permission
CREATE TABLE IF NOT EXISTS permission_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(255),
    description VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_permission_aud_rev FOREIGN KEY (rev) REFERENCES revinfo(rev)
);

-- 8. Audit table for UserCompanyRole
CREATE TABLE IF NOT EXISTS user_company_role_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    user_id BIGINT,
    company_id BIGINT,
    role_id BIGINT,
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_user_company_role_aud_rev FOREIGN KEY (rev) REFERENCES revinfo(rev)
);