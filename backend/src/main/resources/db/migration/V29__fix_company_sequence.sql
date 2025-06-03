-- Drop the existing sequence if it exists
DROP SEQUENCE IF EXISTS company_id_seq CASCADE;

-- Create a new sequence
CREATE SEQUENCE company_id_seq
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Set the sequence's current value to max id
SELECT setval('company_id_seq', COALESCE((SELECT MAX(id) FROM company), 0), true);

-- Set the sequence as the default for the id column
ALTER TABLE company ALTER COLUMN id SET DEFAULT nextval('company_id_seq');

-- Set the sequence ownership
ALTER SEQUENCE company_id_seq OWNED BY company.id; 