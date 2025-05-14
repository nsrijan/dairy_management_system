-- Create audit table for role_permissions join table
CREATE TABLE role_permissions_aud (
    rev BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    revtype SMALLINT,
    PRIMARY KEY (rev, role_id, permission_id),
    CONSTRAINT fk_role_permissions_aud_revinfo FOREIGN KEY (rev) REFERENCES revinfo (id)
); 