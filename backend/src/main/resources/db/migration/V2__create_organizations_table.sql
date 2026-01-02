-- Create organizations/companies table
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    business_location VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    has_run_payroll BOOLEAN DEFAULT FALSE,
    created_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on created_by_user_id for faster queries
CREATE INDEX idx_organizations_created_by ON organizations(created_by_user_id);

-- Create index on company_name for search
CREATE INDEX idx_organizations_company_name ON organizations(company_name);
