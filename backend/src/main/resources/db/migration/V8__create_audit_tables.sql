-- Create audit table for role entity
CREATE TABLE role_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    created_by VARCHAR(255),
    created_at TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP,
    version BIGINT,
    description VARCHAR(255),
    name VARCHAR(255),
    role_type VARCHAR(50),
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_role_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo (id)
); 