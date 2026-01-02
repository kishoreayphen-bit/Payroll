-- Salary Components System Migration
-- This migration creates tables for flexible salary component management

-- Create salary_components table
CREATE TABLE IF NOT EXISTS salary_components (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('EARNING', 'DEDUCTION')),
    calculation_type VARCHAR(20) NOT NULL CHECK (calculation_type IN ('FIXED', 'PERCENTAGE', 'FORMULA')),
    base_component_id BIGINT REFERENCES salary_components(id) ON DELETE SET NULL,
    formula TEXT,
    is_taxable BOOLEAN DEFAULT true,
    is_statutory BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_salary_components_code_org UNIQUE (code, organization_id)
);

-- Create employee_salary_components table
CREATE TABLE IF NOT EXISTS employee_salary_components (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    component_id BIGINT NOT NULL REFERENCES salary_components(id) ON DELETE CASCADE,
    value DECIMAL(15,2) NOT NULL,
    calculated_amount DECIMAL(15,2),
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_employee_salary_components UNIQUE (employee_id, component_id, effective_from)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_salary_components_org ON salary_components(organization_id);
CREATE INDEX IF NOT EXISTS idx_salary_components_type ON salary_components(type);
CREATE INDEX IF NOT EXISTS idx_salary_components_active ON salary_components(is_active);
CREATE INDEX IF NOT EXISTS idx_employee_salary_components_emp ON employee_salary_components(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_salary_components_comp ON employee_salary_components(component_id);
CREATE INDEX IF NOT EXISTS idx_employee_salary_components_active ON employee_salary_components(is_active);
CREATE INDEX IF NOT EXISTS idx_employee_salary_components_dates ON employee_salary_components(effective_from, effective_to);

-- Add comments for documentation
COMMENT ON TABLE salary_components IS 'Master table for all salary components (earnings and deductions)';
COMMENT ON TABLE employee_salary_components IS 'Assignment of salary components to employees with effective dates';

COMMENT ON COLUMN salary_components.type IS 'EARNING or DEDUCTION';
COMMENT ON COLUMN salary_components.calculation_type IS 'FIXED (fixed amount), PERCENTAGE (% of another component), or FORMULA (complex calculation)';
COMMENT ON COLUMN salary_components.base_component_id IS 'For PERCENTAGE type - the component to calculate percentage from';
COMMENT ON COLUMN salary_components.formula IS 'For FORMULA type - the calculation formula';
COMMENT ON COLUMN salary_components.is_taxable IS 'Whether this component is taxable';
COMMENT ON COLUMN salary_components.is_statutory IS 'Whether this is a statutory component (PF, ESI, PT, etc.)';

COMMENT ON COLUMN employee_salary_components.value IS 'Fixed amount or percentage value depending on calculation_type';
COMMENT ON COLUMN employee_salary_components.calculated_amount IS 'Final calculated amount after applying formula/percentage';
COMMENT ON COLUMN employee_salary_components.effective_from IS 'Date from which this component is effective';
COMMENT ON COLUMN employee_salary_components.effective_to IS 'Date until which this component is effective (NULL = current)';
