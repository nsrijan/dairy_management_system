-- Create the permission table
CREATE TABLE permission (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT
);

-- Create audit table for permission
CREATE TABLE permission_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    name VARCHAR(255),
    description VARCHAR(255),
    created_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_permission_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo (id)
); 