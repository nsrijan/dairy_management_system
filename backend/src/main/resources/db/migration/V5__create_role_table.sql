-- Create role table based on Role entity
CREATE TABLE role (
    id BIGINT NOT NULL,
    created_by VARCHAR(255),
    created_date TIMESTAMP,
    last_modified_by VARCHAR(255),
    last_modified_date TIMESTAMP,
    version INTEGER,
    description VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    role_type VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- Create join table for role-permission many-to-many relationship
CREATE TABLE role_permission (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permission_role FOREIGN KEY (role_id) REFERENCES role (id),
    CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id) REFERENCES permission (id)
);

-- Create index on role name
CREATE INDEX idx_role_name ON role (name); 