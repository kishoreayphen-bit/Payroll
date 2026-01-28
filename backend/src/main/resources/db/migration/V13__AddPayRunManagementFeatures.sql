-- Create table for tracked skipped employees
CREATE TABLE IF NOT EXISTS pay_run_employee_skips (
    id BIGSERIAL PRIMARY KEY,
    pay_run_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    skip_type VARCHAR(50) NOT NULL, -- SKIP, PAY_AS_ARREARS
    reason TEXT,
    skipped_by BIGINT,
    skipped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_skip_pay_run FOREIGN KEY (pay_run_id) REFERENCES pay_runs(id),
    CONSTRAINT fk_skip_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Create table for one-time earnings and deductions
CREATE TABLE IF NOT EXISTS pay_run_one_time_components (
    id BIGSERIAL PRIMARY KEY,
    pay_run_employee_id BIGINT NOT NULL,
    component_type VARCHAR(20) NOT NULL, -- EARNING, DEDUCTION
    component_name VARCHAR(100) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    is_taxable BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_otc_pay_run_employee FOREIGN KEY (pay_run_employee_id) REFERENCES pay_run_employees(id) ON DELETE CASCADE
);

-- Add skip tracking columns to pay_run_employees
ALTER TABLE pay_run_employees ADD COLUMN IF NOT EXISTS is_skipped BOOLEAN DEFAULT FALSE;
ALTER TABLE pay_run_employees ADD COLUMN IF NOT EXISTS skip_reason TEXT;
