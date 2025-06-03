-- Create module audit table
CREATE TABLE module_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    name VARCHAR(255),
    code VARCHAR(255),
    description TEXT,
    active BOOLEAN,
    created_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_module_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo(id)
);

-- Create feature audit table
CREATE TABLE feature_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    name VARCHAR(255),
    code VARCHAR(255),
    description TEXT,
    active BOOLEAN,
    module_id BIGINT,
    created_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_feature_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo(id)
);

-- Create tenant_module audit table
CREATE TABLE tenant_module_aud (
    id BIGINT NOT NULL,
    rev INTEGER NOT NULL,
    revtype SMALLINT,
    tenant_id BIGINT,
    module_id BIGINT,
    enabled BOOLEAN,
    enabled_at TIMESTAMP,
    disabled_at TIMESTAMP,
    created_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_tenant_module_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo(id)
); 