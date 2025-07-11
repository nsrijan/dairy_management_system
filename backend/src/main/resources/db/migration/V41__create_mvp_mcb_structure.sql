-- V41__create_mvp_mcb_structure.sql
-- MVP-ready MCB structure with clean separation of concerns

-- Drop old milk_collection_branch table if exists
DROP TABLE IF EXISTS milk_collection_branch CASCADE;

-- Create updated milk_collection_branch table
CREATE TABLE milk_collection_branch (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    company_id BIGINT NOT NULL,
    manager_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Foreign key constraints
    CONSTRAINT fk_mcb_company FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE,
    CONSTRAINT fk_mcb_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Unique constraints
    CONSTRAINT uk_mcb_name_company UNIQUE (name, company_id)
);

-- Create indexes for milk_collection_branch
CREATE INDEX idx_mcb_company_id ON milk_collection_branch(company_id);
CREATE INDEX idx_mcb_manager_id ON milk_collection_branch(manager_id);
CREATE INDEX idx_mcb_is_active ON milk_collection_branch(is_active);
CREATE INDEX idx_mcb_name ON milk_collection_branch(name);
CREATE INDEX idx_mcb_location ON milk_collection_branch(location);

-- Create chill_vat table
CREATE TABLE chill_vat (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    capacity_in_liters INTEGER NOT NULL CHECK (capacity_in_liters > 0),
    current_stock_liters INTEGER NOT NULL DEFAULT 0 CHECK (current_stock_liters >= 0),
    is_operational BOOLEAN NOT NULL DEFAULT true,
    milk_collection_branch_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Foreign key constraints
    CONSTRAINT fk_chill_vat_mcb FOREIGN KEY (milk_collection_branch_id) REFERENCES milk_collection_branch(id) ON DELETE CASCADE,
    
    -- Unique constraints
    CONSTRAINT uk_chill_vat_name_mcb UNIQUE (name, milk_collection_branch_id),
    
    -- Check constraints
    CONSTRAINT chk_chill_vat_stock_capacity CHECK (current_stock_liters <= capacity_in_liters)
);

-- Create indexes for chill_vat
CREATE INDEX idx_chill_vat_mcb_id ON chill_vat(milk_collection_branch_id);
CREATE INDEX idx_chill_vat_operational ON chill_vat(is_operational);
CREATE INDEX idx_chill_vat_capacity ON chill_vat(capacity_in_liters);

-- Create mcb_milk_rate table
CREATE TABLE mcb_milk_rate (
    id BIGSERIAL PRIMARY KEY,
    milk_type VARCHAR(20) NOT NULL CHECK (milk_type IN ('RAW', 'WHOLE')),
    rate_type VARCHAR(20) NOT NULL CHECK (rate_type IN ('BUY', 'SELL')),
    rate DECIMAL(10,2) NOT NULL CHECK (rate > 0),
    effective_from DATE NOT NULL,
    effective_to DATE,
    milk_collection_branch_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Foreign key constraints
    CONSTRAINT fk_mcb_milk_rate_mcb FOREIGN KEY (milk_collection_branch_id) REFERENCES milk_collection_branch(id) ON DELETE CASCADE,
    
    -- Check constraints
    CONSTRAINT chk_mcb_milk_rate_date_range CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

-- Create indexes for mcb_milk_rate
CREATE INDEX idx_mcb_milk_rate_effective ON mcb_milk_rate(milk_collection_branch_id, milk_type, rate_type, effective_from, effective_to);
CREATE INDEX idx_mcb_milk_rate_current ON mcb_milk_rate(milk_collection_branch_id, milk_type, rate_type, effective_to);
CREATE INDEX idx_mcb_milk_rate_mcb_id ON mcb_milk_rate(milk_collection_branch_id);
CREATE INDEX idx_mcb_milk_rate_dates ON mcb_milk_rate(effective_from, effective_to);

-- Add comments for documentation
COMMENT ON TABLE milk_collection_branch IS 'MVP milk collection branch entity with clean structure';
COMMENT ON COLUMN milk_collection_branch.name IS 'Unique branch name within company scope';
COMMENT ON COLUMN milk_collection_branch.location IS 'Full address/location of the branch';
COMMENT ON COLUMN milk_collection_branch.phone_number IS 'Contact phone number in +977XXXXXXXXXX format';
COMMENT ON COLUMN milk_collection_branch.manager_id IS 'Reference to the user who manages this MCB';

COMMENT ON TABLE chill_vat IS 'Chill vats belonging to milk collection branches';
COMMENT ON COLUMN chill_vat.capacity_in_liters IS 'Maximum capacity of the chill vat in liters';
COMMENT ON COLUMN chill_vat.current_stock_liters IS 'Current milk stock in the vat';

COMMENT ON TABLE mcb_milk_rate IS 'Historical milk rates for buy/sell operations';
COMMENT ON COLUMN mcb_milk_rate.milk_type IS 'Type of milk: RAW or WHOLE';
COMMENT ON COLUMN mcb_milk_rate.rate_type IS 'Operation type: BUY or SELL';
COMMENT ON COLUMN mcb_milk_rate.effective_from IS 'Start date for this rate';
COMMENT ON COLUMN mcb_milk_rate.effective_to IS 'End date for this rate (NULL for current rate)';

-- Insert sample data for testing (optional)
-- This can be uncommented for development/testing environments
/*
-- Sample MCB
INSERT INTO milk_collection_branch (name, location, phone_number, company_id, created_by, updated_by) 
VALUES 
    ('Central Collection Point', 'Kathmandu, Nepal', '+9771234567890', 1, 'system', 'system'),
    ('Eastern Branch MCB', 'Biratnagar, Nepal', '+9779876543210', 1, 'system', 'system');

-- Sample Chill Vats
INSERT INTO chill_vat (name, capacity_in_liters, milk_collection_branch_id, created_by, updated_by)
VALUES 
    ('Main Vat 1', 2000, 1, 'system', 'system'),
    ('Main Vat 2', 1500, 1, 'system', 'system'),
    ('Storage Vat 1', 1000, 2, 'system', 'system');

-- Sample Milk Rates
INSERT INTO mcb_milk_rate (milk_type, rate_type, rate, effective_from, milk_collection_branch_id, created_by, updated_by)
VALUES 
    ('RAW', 'BUY', 45.00, CURRENT_DATE, 1, 'system', 'system'),
    ('RAW', 'SELL', 50.00, CURRENT_DATE, 1, 'system', 'system'),
    ('WHOLE', 'BUY', 55.00, CURRENT_DATE, 1, 'system', 'system'),
    ('WHOLE', 'SELL', 60.00, CURRENT_DATE, 1, 'system', 'system'),
    ('RAW', 'BUY', 44.00, CURRENT_DATE, 2, 'system', 'system'),
    ('RAW', 'SELL', 49.00, CURRENT_DATE, 2, 'system', 'system');
*/ 