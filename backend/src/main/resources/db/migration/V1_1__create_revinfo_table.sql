-- Create the REVINFO table for Hibernate Envers auditing
CREATE TABLE revinfo (
    id BIGSERIAL PRIMARY KEY,
    timestamp BIGINT,
    created_at TIMESTAMP
);
