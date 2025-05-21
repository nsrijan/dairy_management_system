-- Create user_company_role table
CREATE TABLE user_company_role (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255),
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_ucr_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_ucr_company FOREIGN KEY (company_id) REFERENCES company (id),
    CONSTRAINT fk_ucr_role FOREIGN KEY (role_id) REFERENCES role (id),
    CONSTRAINT uk_user_company_role UNIQUE (user_id, company_id, role_id)
);

-- Create audit table for user_company_role
CREATE TABLE user_company_role_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    created_by VARCHAR(255),
    created_at TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP,
    version BIGINT,
    user_id BIGINT,
    company_id BIGINT,
    role_id BIGINT,
    is_active BOOLEAN,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_user_company_role_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo (id)
); 