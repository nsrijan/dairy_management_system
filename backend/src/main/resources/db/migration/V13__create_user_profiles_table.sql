-- Create user_profiles table
CREATE TABLE user_profiles (
    id BIGSERIAL NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP,
    version BIGINT,
    user_id BIGINT NOT NULL,
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    postal_code VARCHAR(255),
    country VARCHAR(255),
    profile_picture_url VARCHAR(255),
    date_of_birth DATE,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT uk_user_profiles_user_id UNIQUE (user_id)
);

-- Create audit table for user_profiles entity
CREATE TABLE user_profiles_aud (
    id BIGINT NOT NULL,
    rev BIGINT NOT NULL,
    revtype SMALLINT,
    created_by VARCHAR(255),
    created_at TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP,
    version BIGINT,
    user_id BIGINT,
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    postal_code VARCHAR(255),
    country VARCHAR(255),
    profile_picture_url VARCHAR(255),
    date_of_birth DATE,
    PRIMARY KEY (id, rev),
    CONSTRAINT fk_user_profiles_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo (id)
); 