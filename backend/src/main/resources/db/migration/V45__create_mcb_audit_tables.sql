-- =====================================================
-- Migration: V45 - Create MCB audit tables
-- Description: Create audit tables for MCB entities with @Audited annotation
-- =====================================================

-- Create audit table for milk_collection_branch
CREATE TABLE milk_collection_branch_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(100),
    location VARCHAR(200),
    phone_number VARCHAR(20),
    is_active BOOLEAN,
    company_id BIGINT,
    manager_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_milk_collection_branch_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo(id)
);

-- Create audit table for chill_vat
CREATE TABLE chill_vat_aud (
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
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_chill_vat_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo(id)
);

-- Create audit table for mcb_milk_rate
CREATE TABLE mcb_milk_rate_aud (
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
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_mcb_milk_rate_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo(id)
);

-- Add indexes for better audit query performance
CREATE INDEX idx_milk_collection_branch_aud_rev ON milk_collection_branch_aud(rev);
CREATE INDEX idx_milk_collection_branch_aud_revtype ON milk_collection_branch_aud(revtype);

CREATE INDEX idx_chill_vat_aud_rev ON chill_vat_aud(rev);
CREATE INDEX idx_chill_vat_aud_revtype ON chill_vat_aud(revtype);

CREATE INDEX idx_mcb_milk_rate_aud_rev ON mcb_milk_rate_aud(rev);
CREATE INDEX idx_mcb_milk_rate_aud_revtype ON mcb_milk_rate_aud(revtype); 