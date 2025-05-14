-- Create the REVINFO table for Hibernate Envers auditing
CREATE TABLE revinfo (
    id BIGSERIAL PRIMARY KEY,
    timestamp BIGINT,
    created_at TIMESTAMP
);

-- Create the tenant table
CREATE TABLE tenant (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    CONSTRAINT uk_tenant_slug UNIQUE (slug)
);

-- Create audit table for tenant
CREATE TABLE tenant_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(255),
    slug VARCHAR(255),
    is_active BOOLEAN,
    created_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_tenant_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo (id)
); 