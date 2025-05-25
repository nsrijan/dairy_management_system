-- Create the company table
CREATE TABLE company (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL,
    tenant_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    CONSTRAINT fk_company_tenant FOREIGN KEY (tenant_id) REFERENCES tenant (id)
);

-- Create audit table for company
CREATE TABLE company_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(255),
    description TEXT,
    is_active BOOLEAN,
    tenant_id BIGINT,
    created_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_company_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo (id)
);