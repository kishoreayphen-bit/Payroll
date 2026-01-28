CREATE TABLE statutory_settings (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    
    -- PF Settings
    pf_enabled BOOLEAN DEFAULT TRUE,
    pf_employee_rate DECIMAL(5,2) DEFAULT 12.00,
    pf_employer_rate DECIMAL(5,2) DEFAULT 12.00,
    pf_admin_charges_rate DECIMAL(5,2) DEFAULT 0.50,
    pf_edli_rate DECIMAL(5,2) DEFAULT 0.50,
    pf_wage_ceiling DECIMAL(15,2) DEFAULT 15000.00,
    pf_include_employer_contribution_in_ctc BOOLEAN DEFAULT TRUE,
    pf_establishment_id VARCHAR(50),
    pf_establishment_name VARCHAR(255),
    restrict_pf_wage BOOLEAN DEFAULT TRUE,
    include_allowances_if_pf_wage_low BOOLEAN DEFAULT TRUE,
    prorate_restricted_pf_wage BOOLEAN DEFAULT FALSE,
    consider_applicable_allowances BOOLEAN DEFAULT TRUE,
    
    -- ESI Settings
    esi_enabled BOOLEAN DEFAULT TRUE,
    esi_employee_rate DECIMAL(5,2) DEFAULT 0.75,
    esi_employer_rate DECIMAL(5,2) DEFAULT 3.25,
    esi_wage_ceiling DECIMAL(15,2) DEFAULT 21000.00,
    esi_code VARCHAR(50),
    
    -- Professional Tax Settings
    pt_enabled BOOLEAN DEFAULT TRUE,
    pt_state VARCHAR(50) DEFAULT 'Tamil Nadu',
    
    -- TDS Settings
    tds_enabled BOOLEAN DEFAULT TRUE,
    tan_number VARCHAR(20),
    deductor_name VARCHAR(255),
    deductor_category VARCHAR(50) DEFAULT 'Company',
    
    -- LWF Settings
    lwf_enabled BOOLEAN DEFAULT FALSE,
    lwf_employee_contribution DECIMAL(10,2) DEFAULT 0.00,
    lwf_employer_contribution DECIMAL(10,2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default settings for the default tenant (ID 1)
INSERT INTO statutory_settings (
    tenant_id, 
    pf_enabled, pf_employee_rate, pf_employer_rate, pf_wage_ceiling,
    esi_enabled, esi_employee_rate, esi_employer_rate, esi_wage_ceiling,
    pt_enabled, pt_state,
    tds_enabled,
    created_at, updated_at
) VALUES (
    1, 
    true, 12.00, 12.00, 15000.00,
    true, 0.75, 3.25, 21000.00,
    true, 'Tamil Nadu',
    true,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);
